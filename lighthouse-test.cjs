const { default: lighthouse } = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const ROUTES = [
    { path: "/", name: "Home" },
    { path: "/results?q=manchester", name: "Results" },
    { path: "/courts/manchester-crown-court", name: "Court Details" },
];

const THRESHOLDS = {
    accessibility: 90,
    performance: 80,
    "best-practices": 80,
    seo: 80,
};

async function runLighthouseAudit(url, name) {
    console.log(`Running Lighthouse audit for ${name}: ${url}`);

    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = {
        logLevel: "info",
        output: "json",
        onlyCategories: [
            "accessibility",
            "performance",
            "best-practices",
            "seo",
        ],
        port: chrome.port,
    };

    const runnerResult = await lighthouse(url, options);
    await chrome.kill();

    return {
        name,
        url,
        scores: {
            accessibility: Math.round(
                runnerResult.lhr.categories.accessibility.score * 100
            ),
            performance: Math.round(
                runnerResult.lhr.categories.performance.score * 100
            ),
            "best-practices": Math.round(
                runnerResult.lhr.categories["best-practices"].score * 100
            ),
            seo: Math.round(runnerResult.lhr.categories.seo.score * 100),
        },
        audits: {
            "first-contentful-paint":
                runnerResult.lhr.audits["first-contentful-paint"].displayValue,
            "largest-contentful-paint":
                runnerResult.lhr.audits["largest-contentful-paint"]
                    .displayValue,
            "cumulative-layout-shift":
                runnerResult.lhr.audits["cumulative-layout-shift"].displayValue,
            "total-blocking-time":
                runnerResult.lhr.audits["total-blocking-time"].displayValue,
        },
        timestamp: new Date().toISOString(),
    };
}

async function runLighthouseTests() {
    console.log("Starting Lighthouse performance and accessibility audits...");

    const results = {
        timestamp: new Date().toISOString(),
        routes: [],
        summary: {
            totalRoutes: ROUTES.length,
            passedThresholds: 0,
            failedThresholds: 0,
            averageScores: {
                accessibility: 0,
                performance: 0,
                "best-practices": 0,
                seo: 0,
            },
        },
    };

    for (const route of ROUTES) {
        try {
            const result = await runLighthouseAudit(
                `${BASE_URL}${route.path}`,
                route.name
            );
            results.routes.push(result);

            // Check thresholds
            let routePassed = true;
            Object.keys(THRESHOLDS).forEach((category) => {
                if (result.scores[category] < THRESHOLDS[category]) {
                    routePassed = false;
                    results.summary.failedThresholds++;
                } else {
                    results.summary.passedThresholds++;
                }
            });

            console.log(
                `  ✓ ${route.name}: A${result.scores.accessibility} P${
                    result.scores.performance
                } BP${result.scores["best-practices"]} SEO${
                    result.scores.seo
                } ${routePassed ? "PASS" : "FAIL"}`
            );
        } catch (error) {
            console.error(`  ✗ Error auditing ${route.name}:`, error.message);

            results.routes.push({
                name: route.name,
                url: `${BASE_URL}${route.path}`,
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }

    // Calculate averages
    const validResults = results.routes.filter((r) => r.scores);
    if (validResults.length > 0) {
        results.summary.averageScores.accessibility = Math.round(
            validResults.reduce((sum, r) => sum + r.scores.accessibility, 0) /
                validResults.length
        );
        results.summary.averageScores.performance = Math.round(
            validResults.reduce((sum, r) => sum + r.scores.performance, 0) /
                validResults.length
        );
        results.summary.averageScores["best-practices"] = Math.round(
            validResults.reduce(
                (sum, r) => sum + r.scores["best-practices"],
                0
            ) / validResults.length
        );
        results.summary.averageScores.seo = Math.round(
            validResults.reduce((sum, r) => sum + r.scores.seo, 0) /
                validResults.length
        );
    }

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, "reports");
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Write detailed results
    const detailedResultsPath = path.join(
        reportsDir,
        `lighthouse-results-${new Date().toISOString().split("T")[0]}.json`
    );
    fs.writeFileSync(detailedResultsPath, JSON.stringify(results, null, 2));

    // Write summary
    const summaryPath = path.join(reportsDir, "lighthouse-summary.json");
    fs.writeFileSync(
        summaryPath,
        JSON.stringify(
            {
                timestamp: results.timestamp,
                thresholds: THRESHOLDS,
                summary: results.summary,
                status:
                    results.summary.failedThresholds === 0 ? "PASS" : "FAIL",
            },
            null,
            2
        )
    );

    // Generate HTML report for first route
    if (validResults.length > 0) {
        const chrome = await chromeLauncher.launch({
            chromeFlags: ["--headless"],
        });
        const options = {
            logLevel: "info",
            output: "html",
            onlyCategories: [
                "accessibility",
                "performance",
                "best-practices",
                "seo",
            ],
            port: chrome.port,
        };

        const htmlReport = await lighthouse(
            `${BASE_URL}${ROUTES[0].path}`,
            options
        );
        await chrome.kill();

        const htmlPath = path.join(reportsDir, "lighthouse-results.html");
        fs.writeFileSync(htmlPath, htmlReport.report);
        console.log(`HTML report saved to: ${htmlPath}`);
    }

    console.log("\n=== Lighthouse Test Results ===");
    console.log(`Total routes audited: ${results.summary.totalRoutes}`);
    console.log(`Thresholds passed: ${results.summary.passedThresholds}`);
    console.log(`Thresholds failed: ${results.summary.failedThresholds}`);
    console.log(`Average scores:`);
    console.log(
        `  Accessibility: ${results.summary.averageScores.accessibility}/100`
    );
    console.log(
        `  Performance: ${results.summary.averageScores.performance}/100`
    );
    console.log(
        `  Best Practices: ${results.summary.averageScores["best-practices"]}/100`
    );
    console.log(`  SEO: ${results.summary.averageScores.seo}/100`);
    console.log(
        `Status: ${results.summary.failedThresholds === 0 ? "PASS" : "FAIL"}`
    );

    console.log(`\nDetailed results saved to: ${detailedResultsPath}`);
    console.log(`Summary saved to: ${summaryPath}`);

    // Exit with error code if thresholds failed
    if (results.summary.failedThresholds > 0) {
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
    console.log("Checking if development server is running...");

    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.error(
            "❌ Development server is not running at http://localhost:3000"
        );
        console.error('Please run "npm run dev" first');
        process.exit(1);
    }

    console.log("✅ Development server is running");
    await runLighthouseTests();
}

main().catch((error) => {
    console.error("Test execution failed:", error);
    process.exit(1);
});
