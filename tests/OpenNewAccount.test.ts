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
        expect(page.locator("#accountType")).toContainText("CHECKING");
    })

    test("should render in 'Account Details' selected type as 'Account Type': 'SAVINGS'", async ({ page }) => {
        await openNewAccount(page, "SAVINGS");
        expect(page.locator("#accountType")).toContainText("SAVINGS");
    })

    test("should filter by month according to initial account creation. As well, type should be set to 'Credit', as amount gets populated with $100.00 as per default", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
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

        // Find the month name that matches the current date's month number:
        const selectedMonth = allMonthSelections.find(month => month.date === currentMonth);

        if (selectedMonth) {
            await page.selectOption("select#month", selectedMonth.selector);
        } else {
            throw new Error(`Month with value ${currentMonth} not found in selection list.`);
        }

        await page.locator("#transactionType").selectOption("Credit");
        expect(page.locator("#transactionTable > tbody > tr > td").nth(3)).toContainText("$100.00");
    });

    test("should return 'No transactions found.' after filtered by 'Activity Period' set to 'All' and 'type' set to 'Debit' due to inital 'SAVINGS 'account creation", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
        await page.locator("#transactionType").selectOption("Debit");
        await page.locator("input[value='Go']").click();

        expect(page.locator("#noTransactions b")).toContainText("No transactions found.");
    });

    test("should return 'No transactions found.' after filtered by 'Activity Period' set to 'All' and 'type' set to 'Debit' due to inital 'CHECKING 'account creation", async ({ page }) => {

        await openNewAccount(page, "CHECKING");
        await page.locator("#transactionType").selectOption("Debit");
        await page.locator("input[value='Go']").click();

        expect(page.locator("#noTransactions b")).toContainText("No transactions found.");
    });


    test("should have a correctly rendered 'Date' after account creation", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
        const currentTodaysDate = getTodaysDateDashFormat();

        expect(page.locator("#transactionTable > tbody > tr > td").first()).toContainText(currentTodaysDate);

    })

    test("should launch 'Funds Transfer Received' hyperlink and navigate to: ${baseUrl}transaction.htm?id=${transcationId}", async ({ page }) => {

        await openNewAccount(page, "SAVINGS");
        await page.locator("a:has-text('Funds Transfer Received')").click();

        const baseUrl = 'https://parabank.parasoft.com/parabank';

        const locatorText = await page.locator("#rightPanel > table > tbody > tr > td").nth(1).textContent();
        const expectedUrl = `${baseUrl}/transaction.htm?id=${locatorText}`;

        // Use toHaveURL to assert the page URL:
        expect(page).toHaveURL(expectedUrl);

    });

    test("should have a newly opened 'SAVINGS' account value set to Credit(+) of $100.00", async ({ page }) => {
        await openNewAccount(page, "SAVINGS");
        expect(page.locator("#transactionTable > tbody > tr > td").nth(3)).toContainText("$100.00");
    })

    test("should have a newly opened 'CHECKING' account value set to Credit(+) of $100.00", async ({ page }) => {
        await openNewAccount(page, "CHECKING");
        expect(page.locator("#transactionTable > tbody > tr > td").nth(3)).toContainText("$100.00");
    })

});


