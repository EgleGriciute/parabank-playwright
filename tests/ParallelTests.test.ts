import { test, expect } from '@playwright/test';

const baseURL = 'https://parabank.parasoft.com/parabank';

// Enable parallel execution:
test.describe.configure({ mode: "parallel" });

test.describe("User Is Not Logged In Site Map - Footer Section", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/sitemap.htm`);
    });

    test("should navigate 'Site Map' to '/sitemap.htm'", async ({ page }) => {
        const link = page.locator("div#footerPanel > ul > li").nth(6).locator("a");
        expect(link).toContainText("Site Map");
        expect(link).toBeVisible();
        await link.click();
        expect(page.url()).toContain(`${baseURL}/sitemap.htm`);
    });

    test("should navigate 'About Us' to '/about.htm'", async ({ page }) => {
        const link = page.locator("ul.leftmenu > li").nth(1);
        await link.click();
        expect(page.url()).toContain(`${baseURL}/about.htm`);
    });
});
