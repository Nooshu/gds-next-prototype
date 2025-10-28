import { test, expect } from "@playwright/test";

test.describe("Progressive Enhancement", () => {
    test("search form works without JavaScript", async ({ browser }) => {
        // Create a new browser context with JavaScript disabled
        const context = await browser.newContext({
            javaScriptEnabled: false,
        });
        const newPage = await context.newPage();

        await newPage.goto("/");
        await newPage.waitForLoadState("networkidle");

        // Fill out the search form
        const searchInput = newPage.locator('input[name="query"]');
        await expect(searchInput).toBeVisible();
        await searchInput.fill("manchester");

        // Submit the form
        const submitButton = newPage.locator('button[type="submit"]');
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // Should redirect to results page
        await newPage.waitForURL("**/results**");
        expect(newPage.url()).toContain("q=manchester");

        await context.close();
    });

    test("navigation works without JavaScript", async ({ browser }) => {
        const context = await browser.newContext({
            javaScriptEnabled: false,
        });
        const newPage = await context.newPage();

        await newPage.goto("/");
        await newPage.waitForLoadState("networkidle");

        // Navigate to results page
        await newPage.goto("/results?q=manchester");
        await newPage.waitForLoadState("networkidle");

        // Should see results content
        const resultsHeading = newPage.locator("h1");
        await expect(resultsHeading).toBeVisible();
        await expect(resultsHeading).toContainText("Search results");

        // Navigate to court details
        const courtLink = newPage.locator('a[href*="/courts/"]').first();
        await expect(courtLink).toBeVisible();
        await courtLink.click();

        // Should navigate to court details page
        await newPage.waitForURL("**/courts/**");
        const courtHeading = newPage.locator("h1");
        await expect(courtHeading).toBeVisible();

        await context.close();
    });

    test("breadcrumb navigation works without JavaScript", async ({
        browser,
    }) => {
        const context = await browser.newContext({
            javaScriptEnabled: false,
        });
        const newPage = await context.newPage();

        await newPage.goto("/courts/manchester-crown-court");
        await newPage.waitForLoadState("networkidle");

        // Check breadcrumbs are present
        const breadcrumbs = newPage.locator(".govuk-breadcrumbs");
        await expect(breadcrumbs).toBeVisible();

        // Click on breadcrumb link
        const breadcrumbLink = breadcrumbs.locator("a").first();
        await expect(breadcrumbLink).toBeVisible();
        await breadcrumbLink.click();

        // Should navigate back
        await newPage.waitForURL("**/");
        expect(newPage.url()).toBe("http://localhost:3000/");

        await context.close();
    });

    test("error handling works without JavaScript", async ({ browser }) => {
        const context = await browser.newContext({
            javaScriptEnabled: false,
        });
        const newPage = await context.newPage();

        await newPage.goto("/");
        await newPage.waitForLoadState("networkidle");

        // Submit empty form
        const submitButton = newPage.locator('button[type="submit"]');
        await submitButton.click();

        // Should redirect with error parameter
        await newPage.waitForURL("**/?error=**");
        expect(newPage.url()).toContain("error=");

        await context.close();
    });

    test("page loads with meaningful content without JavaScript", async ({
        browser,
    }) => {
        const context = await browser.newContext({
            javaScriptEnabled: false,
        });
        const newPage = await context.newPage();

        await newPage.goto("/");
        await newPage.waitForLoadState("networkidle");

        // Should see meaningful content immediately
        const heading = newPage.locator("h1");
        await expect(heading).toBeVisible();
        await expect(heading).toContainText("Find a court or tribunal");

        const searchForm = newPage.locator("form");
        await expect(searchForm).toBeVisible();

        const searchInput = newPage.locator('input[name="query"]');
        await expect(searchInput).toBeVisible();

        await context.close();
    });
});
