import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser, openNewAccount, getTodaysDateMonth, getTodaysDateDashFormat } from './fixtures/common';

test.describe("Open New Account", () => {
    test.beforeEach(async ({ page }) => {
        await registerEndUser(page);
        await logOut(page);
        await loginEndUser(page);
        await page.goto("/parabank/openaccount.htm");
    });

    test("should open a new 'CHECKING' account after 'OPEN NEW ACCOUNT' click and route to ${baseUrl}/activity.htm?id=${bankAccountNumber}", async ({ page }) => {
        await openNewAccount(page, "CHECKING");
    });

    test("should open a new 'SAVINGS' account after 'OPEN NEW ACCOUNT' click and route to ${baseUrl}/activity.htm?id=${bankAccountNumber}", async ({ page }) => {
        await openNewAccount(page, "SAVINGS");
    });

    test("should render in 'Account Details' selected type as 'Account Type': 'CHECKING'", async ({ page }) => {
        await openNewAccount(page, "CHECKING");
        await expect(page.locator("#accountType")).toContainText("CHECKING");
    })

    test("should render in 'Account Details' selected type as 'Account Type': 'SAVINGS'", async ({ page }) => {
        await openNewAccount(page, "SAVINGS");
        await expect(page.locator("#accountType")).toContainText("SAVINGS");
    })

    test("should filter by month according to initial account creation. Type should be 'Credit', and amount should be between 0 and 150", async ({ page }) => {
        await openNewAccount(page, "SAVINGS");
        await page.waitForLoadState("domcontentloaded"); // Ensure page loads before proceeding

        const currentMonth = await getTodaysDateMonth();

        const allMonthSelections = [
            { selector: "January", date: "01" },
            { selector: "February", date: "02" },
            { selector: "March", date: "03" },
            { selector: "April", date: "04" },
            { selector: "May", date: "05" },
            { selector: "June", date: "06" },
            { selector: "July", date: "07" },
            { selector: "August", date: "08" },
            { selector: "September", date: "09" },
            { selector: "October", date: "10" },
            { selector: "November", date: "11" },
            { selector: "December", date: "12" },
        ];

        // Find the corresponding month
        const selectedMonth = allMonthSelections.find(month => month.date === currentMonth);
        if (!selectedMonth) {
            throw new Error(`Month with value ${currentMonth} not found in selection list.`);
        }

        await page.selectOption("select#month", selectedMonth.selector);
        await page.waitForTimeout(500); // Small delay to allow filtering to take effect

        await page.selectOption("#transactionType", "Credit");
        await page.waitForTimeout(500); // Ensure filtering updates before assertion

        // Extract and verify the transaction amount
        const amountText = await page.locator("#transactionTable > tbody > tr > td").nth(3).textContent();

        await expect(amountText).not.toBeNull(); // Ensure the amount is not null
        const amountNumber = parseFloat(amountText!.replace(/[^0-9.]/g, "")); // Convert to number

        await expect(amountNumber).toBeGreaterThanOrEqual(0);
        await expect(amountNumber).toBeLessThanOrEqual(150);
    });


    test("should return 'No transactions found.' after filtered by 'Activity Period' set to 'All' and 'type' set to 'Debit' due to inital 'SAVINGS 'account creation", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
        await page.locator("#transactionType").selectOption("Debit");
        await page.locator("input[value='Go']").click();

        await expect(page.locator("#noTransactions b")).toContainText("No transactions found.");
    });

    test("should return 'No transactions found.' after filtered by 'Activity Period' set to 'All' and 'type' set to 'Debit' due to inital 'CHECKING 'account creation", async ({ page }) => {

        await openNewAccount(page, "CHECKING");
        await page.locator("#transactionType").selectOption("Debit");
        await page.locator("input[value='Go']").click();

        await expect(page.locator("#noTransactions b")).toContainText("No transactions found.");
    });


    test("should have a correctly rendered 'Date' after account creation", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
        const currentTodaysDate = getTodaysDateDashFormat();

        await expect(page.locator("#transactionTable > tbody > tr > td").first()).toContainText(currentTodaysDate);

    })

    test("should launch 'Funds Transfer Received' hyperlink and navigate to: ${baseUrl}transaction.htm?id=${transcationId}", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
        await page.locator("a:has-text('Funds Transfer Received')").click();

        const baseUrl = 'https://parabank.parasoft.com/parabank';

        const locatorText = await page.locator("#rightPanel > table > tbody > tr > td").nth(1).textContent();
        const expectedUrl = `${baseUrl}/transaction.htm?id=${locatorText}`;

        // Use toHaveURL to assert the page URL:
        await expect(page).toHaveURL(expectedUrl);

    });

});


