import { test, expect } from "@playwright/test";

test.describe("Forms", () => {
    test("form validation shows error messages", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Submit form without filling it
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for error summary to appear
        await page.waitForTimeout(300);

        const errorSummary = page.locator(".govuk-error-summary");
        await expect(errorSummary).toBeVisible();

        // Check error summary content
        const errorTitle = errorSummary.locator(".govuk-error-summary__title");
        await expect(errorTitle).toContainText("There is a problem");

        const errorList = errorSummary.locator(".govuk-error-summary__list");
        await expect(errorList).toBeVisible();
    });

    test("form validation shows inline error messages", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Submit form without filling it
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for error summary to appear
        await page.waitForTimeout(300);

        // Check for inline error message
        const errorMessage = page.locator(".govuk-error-message");
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText("Enter a search term");
    });

    test("form validation links error summary to field", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Submit form without filling it
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for error summary to appear
        await page.waitForTimeout(300);

        const errorSummary = page.locator(".govuk-error-summary");
        await expect(errorSummary).toBeVisible();

        // Check error summary link
        const errorLink = errorSummary.locator('a[href*="#"]');
        await expect(errorLink).toBeVisible();

        // Click error link
        await errorLink.click();

        // Focus should move to input field
        const inputField = page.locator('input[name="query"]');
        const isFocused = await inputField.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });

    test("form field has proper aria-describedby", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Submit form without filling it
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for error summary to appear
        await page.waitForTimeout(300);

        // Check input field has aria-describedby
        const inputField = page.locator('input[name="query"]');
        const ariaDescribedBy = await inputField.getAttribute(
            "aria-describedby"
        );
        expect(ariaDescribedBy).toMatch(/hint/);
        expect(ariaDescribedBy.split(" ").length).toBeGreaterThan(1);
    });

    test("form submission with valid input works", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Fill in search term
        const searchInput = page.locator('input[name="query"]');
        await searchInput.fill("manchester");

        // Submit form
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Should navigate to results page
        await page.waitForURL("**/results**");
        expect(page.url()).toContain("q=manchester");

        // Should see results
        const resultsHeading = page.locator("h1");
        await expect(resultsHeading).toContainText("Search results");
    });

    test("form keyboard navigation works", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Tab to input field
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");

        const inputField = page.locator('input[name="query"]');
        const isFocused = await inputField.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);

        // Tab to submit button
        await page.keyboard.press("Tab");

        const submitButton = page.locator('button[type="submit"]');
        const buttonFocused = await submitButton.evaluate(
            (el) => el === document.activeElement
        );
        expect(buttonFocused).toBe(true);

        // Submit with Enter key
        await page.keyboard.press("Enter");

        // Should navigate to results page
        await page.waitForURL("**/results**");
    });

    test("form error summary receives focus on submission", async ({
        page,
    }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Submit form without filling it
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for error summary to appear and receive focus
        await page.waitForTimeout(300);

        const errorSummary = page.locator(".govuk-error-summary");
        await expect(errorSummary).toBeVisible();

        // Error summary should have focus
        const isFocused = await errorSummary.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });
});
