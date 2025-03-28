import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser, openNewAccount } from './fixtures/common';

test.describe("Transfer Funds Page", () => {

    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);
        await loginEndUser(page);

        await openNewAccount(page, "CHECKING");
        await page.goto("parabank/transfer.htm");

    });

    test("should transfer money successfully if different 'From account' and 'To account' options are selected", async ({ page }) => {

        // Amount field:
        const amountInput = page.locator("input#amount");
        await amountInput.waitFor({ state: 'visible' });
        await amountInput.fill("100");

        // From account field:
        const fromAccountSelect = page.locator("select#fromAccountId");
        await fromAccountSelect.waitFor({ state: 'visible' });
        await fromAccountSelect.selectOption({ index: 0 });

        // To account field:
        const toAccountSelect = page.locator("select#toAccountId");
        await toAccountSelect.waitFor({ state: 'visible' });
        await toAccountSelect.selectOption({ index: 1 });

        // Click Transfer button:
        await page.locator("input[value='Transfer']").click();

        // Verify transfer complete message:
        await expect(page.locator("h1:has-text('Transfer Complete')")).toBeVisible();

    });

    test("should return 'Error! An internal error has occurred and has been logged.' after filling in a space character as amount", async ({ page }) => {

        // Amount field:
        const amountInput = page.locator("input#amount");
        await amountInput.waitFor({ state: 'visible' });
        await amountInput.fill(" ");

        // From account field:
        const fromAccountSelect = page.locator("select#fromAccountId");
        await fromAccountSelect.waitFor({ state: 'visible' });
        await fromAccountSelect.selectOption({ index: 0 });

        // To account field:
        const toAccountSelect = page.locator("select#toAccountId");
        await toAccountSelect.waitFor({ state: 'visible' });
        await toAccountSelect.selectOption({ index: 0 });

        // Click Transfer button:
        await page.locator("input[value='Transfer']").click();

        // Verify error message:
        await expect(page.locator("div#showError")).toBeVisible();
        await expect(page.locator("div#showError > h1.title")).toContainText("Error!");
        await expect(page.locator("div#showError > p.error")).toContainText("An internal error has occurred and has been logged.");

    });

    test("should return 'Error! An internal error has occurred and has been logged.' after filling in a string as amount", async ({ page }) => {

        // Amount field:
        const amountInput = page.locator("input#amount");
        await amountInput.waitFor({ state: 'visible' });
        await amountInput.fill("test");

        // From account field:
        const fromAccountSelect = page.locator("select#fromAccountId");
        await fromAccountSelect.waitFor({ state: 'visible' });
        await fromAccountSelect.selectOption({ index: 0 });

        // To account field:
        const toAccountSelect = page.locator("select#toAccountId");
        await toAccountSelect.waitFor({ state: 'visible' });
        await toAccountSelect.selectOption({ index: 0 });

        // Click Transfer button:
        await page.locator("input[value='Transfer']").click();

        // Verify error message:
        await expect(page.locator("div#showError")).toBeVisible();
        await expect(page.locator("div#showError > h1.title")).toContainText("Error!");
        await expect(page.locator("div#showError > p.error")).toContainText("An internal error has occurred and has been logged.");

    });

});
