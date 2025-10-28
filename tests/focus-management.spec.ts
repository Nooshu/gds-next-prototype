import { test, expect } from "@playwright/test";

test.describe("Focus Management", () => {
    test("focus moves to h1 on page load", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Focus should be on h1
        const h1 = page.locator("h1");
        const isFocused = await h1.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });

    test("focus moves to h1 on navigation", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Navigate to results page
        await page.goto("/results?q=manchester");
        await page.waitForLoadState("networkidle");

        // Focus should be on h1
        const h1 = page.locator("h1");
        const isFocused = await h1.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });

    test("focus moves to h1 on court details page", async ({ page }) => {
        await page.goto("/courts/manchester-crown-court");
        await page.waitForLoadState("networkidle");

        // Focus should be on h1
        const h1 = page.locator("h1");
        const isFocused = await h1.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });

    test("breadcrumbs have proper aria-current", async ({ page }) => {
        await page.goto("/courts/manchester-crown-court");
        await page.waitForLoadState("networkidle");

        const breadcrumbs = page.locator(".govuk-breadcrumbs");
        await expect(breadcrumbs).toBeVisible();

        // Last breadcrumb item should have aria-current="page"
        const lastItem = breadcrumbs.locator(
            ".govuk-breadcrumbs__list-item:last-child span"
        );
        await expect(lastItem).toHaveAttribute("aria-current", "page");
    });

    test("live region announces dynamic updates", async ({ page }) => {
        await page.goto("/results?q=manchester");
        await page.waitForLoadState("networkidle");

        // Check for live region with results count
        const liveRegion = page.locator("#live-region");
        await expect(liveRegion).toBeVisible();

        // Should contain results count announcement
        const liveRegionText = await liveRegion.textContent();
        expect(liveRegionText).toMatch(/\d+ results found for "manchester"/);

        // Live region should be visually hidden
        await expect(liveRegion).toHaveClass(/govuk-visually-hidden/);
    });

    test("error summary receives focus on form submission with errors", async ({
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

    test("error summary link moves focus to field", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Submit form without filling it
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Wait for error summary to appear
        await page.waitForTimeout(300);

        const errorSummary = page.locator(".govuk-error-summary");
        await expect(errorSummary).toBeVisible();

        // Click on error summary link
        const errorLink = errorSummary.locator('a[href*="#"]');
        await expect(errorLink).toBeVisible();
        await errorLink.click();

        // Focus should move to the input field
        const inputField = page.locator('input[name="query"]');
        const isFocused = await inputField.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });
});
