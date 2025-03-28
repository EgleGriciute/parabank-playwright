import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

test.describe("Accounts Overview", () => {
    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);
        await loginEndUser(page);
        await page.goto("/parabank/openaccount.htm");

    });

    test("should launch 'Accounts Overview' after login and left menu click and render: 'Account', 'Balance', 'Available Amount' values", async ({ page }) => {
        await page.goto("/parabank/openaccount.htm");

        // Wait for the link to be visible:
        await page.locator("a[href='overview.htm']").waitFor({ state: 'visible', timeout: 60000 });

        // Click the 'Overview' link:
        await page.locator("a[href='overview.htm']").click();

        // Wait for the URL to contain 'overview.htm':
        await expect(page.url()).toContain("overview.htm");

        // Get account number and validate the activity link visibility:
        const accountNumber = await page.locator("table#accountTable tbody>tr>td").first().textContent();
        await expect(page.locator(`a[href='activity.htm?id=${accountNumber}']`)).toBeVisible();

        // Check that 'Account Balance' and 'Available Amount' are visible:
        const accountBalance = page.locator("table#accountTable tbody>tr>td").nth(2);
        const availableAmount = page.locator("table#accountTable tbody>tr>td").nth(3);

        await expect(accountBalance).toBeVisible();
        await expect(availableAmount).toBeVisible();
    });

});
