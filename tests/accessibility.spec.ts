import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("has skip link that moves focus to main content", async ({ page }) => {
        // Check skip link is present
        const skipLink = page.locator(".govuk-skip-link");
        await expect(skipLink).toBeVisible();
        await expect(skipLink).toHaveAttribute("href", "#main-content");

        // Click skip link and verify focus moves
        await skipLink.click();

        // Wait for focus to be set
        await page.waitForTimeout(100);

        const mainContent = page.locator("#main-content");
        const isFocused = await mainContent.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });

    test("has proper page title", async ({ page }) => {
        await expect(page).toHaveTitle(/HMCTS Courts Prototype/);
    });

    test("has proper heading structure", async ({ page }) => {
        const h1 = page.locator("h1");
        await expect(h1).toBeVisible();
        await expect(h1).toHaveClass(/govuk-heading-xl/);
    });

    test("has proper landmarks", async ({ page }) => {
        // Check main landmark
        const main = page.locator('main, [role="main"]');
        await expect(main).toBeVisible();
        await expect(main).toHaveAttribute("id", "main-content");

        // Check header landmark
        const header = page.locator('header, [role="banner"]');
        await expect(header).toBeVisible();
    });

    test("court details page has proper breadcrumbs", async ({ page }) => {
        await page.goto("/courts/manchester-crown-court");
        await page.waitForLoadState("networkidle");

        const breadcrumbs = page.locator(".govuk-breadcrumbs");
        await expect(breadcrumbs).toBeVisible();

        // Check breadcrumb structure
        const breadcrumbList = breadcrumbs.locator(".govuk-breadcrumbs__list");
        await expect(breadcrumbList).toBeVisible();

        // Check last item has aria-current="page"
        const lastItem = breadcrumbs.locator(
            ".govuk-breadcrumbs__list-item:last-child span"
        );
        await expect(lastItem).toHaveAttribute("aria-current", "page");
    });

    test("court details page keyboard navigation", async ({ page }) => {
        await page.goto("/courts/manchester-crown-court");
        await page.waitForLoadState("networkidle");

        // Tab through interactive elements
        await page.keyboard.press("Tab");

        // Should focus on skip link first
        const skipLink = page.locator(".govuk-skip-link");
        const skipLinkFocused = await skipLink.evaluate(
            (el) => el === document.activeElement
        );
        expect(skipLinkFocused).toBe(true);

        // Continue tabbing to find phone/email links
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");

        // Check if we can find phone/email links
        const phoneLink = page.locator('a[href^="tel:"]');
        const emailLink = page.locator('a[href^="mailto:"]');

        if ((await phoneLink.count()) > 0) {
            const phoneFocused = await phoneLink
                .first()
                .evaluate((el) => el === document.activeElement);
            expect(phoneFocused).toBe(true);
        }

        if ((await emailLink.count()) > 0) {
            const emailFocused = await emailLink
                .first()
                .evaluate((el) => el === document.activeElement);
            expect(emailFocused).toBe(true);
        }
    });

    test("results page announces results count", async ({ page }) => {
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
});
