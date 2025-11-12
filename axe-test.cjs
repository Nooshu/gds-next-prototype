const { AxePuppeteer } = require("@axe-core/puppeteer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const ROUTES = [
    "/",
    "/results?q=manchester",
    "/results?q=birmingham",
    "/courts/manchester-crown-court",
    "/courts/birmingham-crown-court",
    "/courts/inner-london-crown-court",
];

async function runAxeTests() {
    console.log("Starting axe-core accessibility tests...");

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const results = {
        timestamp: new Date().toISOString(),
        routes: [],
        summary: {
            totalRoutes: ROUTES.length,
            violationsFound: 0,
            checksPassed: 0,
        },
    };

    for (const route of ROUTES) {
        console.log(`Testing route: ${route}`);

        try {
            const page = await browser.newPage();
            await page.goto(`${BASE_URL}${route}`, {
                waitUntil: "networkidle0",
                timeout: 10000,
            });

            // Wait for any dynamic content to load
            await page.waitForTimeout(1000);

            const axeResults = await new AxePuppeteer(page).analyze();

            const routeResult = {
                route,
                url: `${BASE_URL}${route}`,
                violations: axeResults.violations,
                passes: axeResults.passes,
                incomplete: axeResults.incomplete,
                inapplicable: axeResults.inapplicable,
                timestamp: new Date().toISOString(),
            };

            results.routes.push(routeResult);
            results.summary.violationsFound += axeResults.violations.length;
            results.summary.checksPassed += axeResults.passes.length;

            console.log(
                `  ✓ ${axeResults.passes.length} checks passed, ${axeResults.violations.length} violations found`
            );

            await page.close();
        } catch (error) {
            console.error(`  ✗ Error testing ${route}:`, error.message);

            results.routes.push({
                route,
                url: `${BASE_URL}${route}`,
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }

    await browser.close();

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, "reports");
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Write detailed results
    const detailedResultsPath = path.join(
        reportsDir,
        `axe-${new Date().toISOString().split("T")[0]}.json`
    );
    fs.writeFileSync(detailedResultsPath, JSON.stringify(results, null, 2));

    // Write summary
    const summaryPath = path.join(reportsDir, "axe-summary.json");
    fs.writeFileSync(
        summaryPath,
        JSON.stringify(
            {
                timestamp: results.timestamp,
                totalRoutes: results.summary.totalRoutes,
                violationsFound: results.summary.violationsFound,
                checksPassed: results.summary.checksPassed,
                status: results.summary.violationsFound === 0 ? "PASS" : "FAIL",
            },
            null,
            2
        )
    );

    console.log("\n=== Axe Test Results ===");
    console.log(`Total routes tested: ${results.summary.totalRoutes}`);
    console.log(`Checks passed: ${results.summary.checksPassed}`);
    console.log(`Violations found: ${results.summary.violationsFound}`);
    console.log(
        `Status: ${results.summary.violationsFound === 0 ? "PASS" : "FAIL"}`
    );

    if (results.summary.violationsFound > 0) {
        console.log("\nViolations by route:");
        results.routes.forEach((route) => {
            if (route.violations && route.violations.length > 0) {
                console.log(
                    `  ${route.route}: ${route.violations.length} violations`
                );
                route.violations.forEach((violation) => {
                    console.log(
                        `    - ${violation.id}: ${violation.description}`
                    );
                });
            }
        });
    }

    console.log(`\nDetailed results saved to: ${detailedResultsPath}`);
    console.log(`Summary saved to: ${summaryPath}`);

    // Exit with error code if violations found
    if (results.summary.violationsFound > 0) {
        process.exit(1);
    }
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch(BASE_URL);
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log("Checking if server is running...");

    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.error(
            "❌ Server is not running at http://localhost:3000"
        );
        console.error('Please run "npm run build && npm start" first');
        process.exit(1);
    }

    console.log("✅ Server is running");
    await runAxeTests();
}

main().catch((error) => {
    console.error("Test execution failed:", error);
    process.exit(1);
});
