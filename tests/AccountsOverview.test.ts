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

        await page.goto("/");

        await page.locator("a[href='overview.htm']").click();
        expect(page.url()).toContain("overview.htm");

        const accountNumber = await page.locator("table#accountTable tbody>tr>td").first().textContent();
        expect(page.locator(`a[href='activity.htm?id=${accountNumber}']`)).toBeVisible();

        const accountBalance = page.locator("table#accountTable tbody>tr>td").nth(2);
        const availableAmount = page.locator("table#accountTable tbody>tr>td").nth(3);

        expect(accountBalance).toBeVisible();
        expect(availableAmount).toBeVisible();

    });

});
