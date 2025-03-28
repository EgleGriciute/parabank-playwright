import { test, expect } from "@playwright/test";

test.describe("Top Panel Navigation", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("should launch ${baseUrl}/admin.htm after square logo click", async ({ page }) => {

        const adminLogo = page.locator("img.admin");
        await adminLogo.waitFor({ state: "visible", timeout: 3000 });
        await adminLogo.click();

        await expect(page).toHaveURL(/\/parabank\/admin\.htm$/);
    });

    test("should navigate to baseUrl after 'PARA BANK' logo click", async ({ page }) => {

        const paraBankLogo = page.locator(".logo");
        await paraBankLogo.waitFor({ state: "visible", timeout: 3000 });
        await paraBankLogo.click();

        await expect(page).toHaveURL(/\/parabank\/index\.htm$/);
    });
});