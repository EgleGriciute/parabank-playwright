import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser, openNewAccount, transferToAccount } from './fixtures/common';

const baseUrl = 'https://parabank.parasoft.com/parabank';

test.describe("Find Transactions", () => {

    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);
        await loginEndUser(page);

        await openNewAccount(page, "CHECKING");
        await page.goto(`${baseUrl}/findtrans.htm`);

    });

    test("should navigate to Find Transactions page after 'Find Transactions' click", async ({ page }) => {

        await page.goto(`${baseUrl}/overview.htm`);
        await page.locator("a[href='findtrans.htm']").click();
        await expect(page).toHaveURL(`${baseUrl}/findtrans.htm`);
        await expect(page.locator("#formContainer h1")).toContainText("Find Transactions");

    });

    test("should 'Find by Transaction ID' after 'FIND TRANSACTIONS' click", async ({ page }) => {

        // Account needs to have at least 1 existing transfer:
        await transferToAccount(page);
        await page.goto(`${baseUrl}/overview.htm`);

        // Select first account and perform transaction validation check:
        const accountNumberLocator = page.locator('#accountTable > tbody > tr > td').first();
        await accountNumberLocator.waitFor({ state: 'visible' });
        const accountNumber = await accountNumberLocator.textContent();

        if (!accountNumber) {
            throw new Error("Account number not found.");
        }

        // Click on a first transaction:
        const transactionLink = page.locator(`a[href='activity.htm?id=${accountNumber}']`);
        await transactionLink.waitFor({ state: 'visible' });
        await transactionLink.click();

        // Perform transaction URL check:
        expect(page).toHaveURL(`${baseUrl}/activity.htm?id=${accountNumber}`);
        const accountIdLocator = page.locator("#accountId");
        await accountIdLocator.waitFor({ state: 'visible' });
        await expect(accountIdLocator).toContainText(accountNumber);

        const transactionTableCell = page.locator("#transactionTable > tbody > tr > td").nth(1);
        await transactionTableCell.waitFor({ state: 'visible' });
        await transactionTableCell.click();

        // Retrieve 'Transaction ID' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find By Transaction ID':
        const transactionIdLocator = page.locator("#rightPanel > table > tbody > tr").first().locator("td").nth(1);
        await transactionIdLocator.waitFor({ state: 'visible' });
        const transactionId = await transactionIdLocator.textContent();

        if (!transactionId) {
            throw new Error("Transaction ID not found.");
        }

        const findTransactionsLink = page.locator("a[href='findtrans.htm']");
        await findTransactionsLink.waitFor({ state: 'visible' });
        await findTransactionsLink.click();

        const transactionIdInput = page.locator("input#transactionId");
        await transactionIdInput.waitFor({ state: 'visible' });
        await transactionIdInput.fill(transactionId);

        const findByIdButton = page.locator("button#findById");
        await findByIdButton.waitFor({ state: 'visible' });
        await findByIdButton.click();

        // As it is a known bug, it does return 'An internal error has occurred and has been logged.':
        const errorContainer = page.locator("#errorContainer p.error");
        await errorContainer.waitFor({ state: 'visible' });
        await expect(errorContainer).toContainText("An internal error has occurred and has been logged.");
    });

    test("should 'Find by Date' after 'FIND TRANSACTIONS' click", async ({ page }) => {

        // Account needs to have at least 1 existing transfer:
        await transferToAccount(page);
        await page.goto("parabank/overview.htm");

        // Select first account and perform transaction validation check:
        const accountNumberLocator = page.locator('#accountTable > tbody > tr > td').first();
        await accountNumberLocator.waitFor({ state: 'visible' });
        const accountNumber = await accountNumberLocator.textContent();

        if (!accountNumber) {
            throw new Error("Account number not found.");
        }

        // Click on a first transaction:
        const transactionLink = page.locator(`a[href='activity.htm?id=${accountNumber}']`);
        await transactionLink.waitFor({ state: 'visible' });
        await transactionLink.click();

        // Perform transaction URL check:
        await expect(page).toHaveURL(`${baseUrl}/activity.htm?id=${accountNumber}`);
        const accountIdLocator = page.locator("#accountId");
        await accountIdLocator.waitFor({ state: 'visible' });
        await expect(accountIdLocator).toContainText(accountNumber);

        const transactionTableCell = page.locator("#transactionTable > tbody > tr > td").nth(1);
        await transactionTableCell.waitFor({ state: 'visible' });
        await transactionTableCell.click();

        // Retrieve 'Transaction Date' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find by Date':
        const dateLocator = page.locator("#rightPanel > table > tbody > tr").nth(1).locator("td").nth(1);
        await dateLocator.waitFor({ state: 'visible' });
        const date = await dateLocator.textContent();

        if (!date) {
            throw new Error("Transaction date not found.");
        }

        const findTransactionsLink = page.locator("a[href='findtrans.htm']");
        await findTransactionsLink.waitFor({ state: 'visible' });
        await findTransactionsLink.click();

        const transactionDateInput = page.locator("#transactionDate");
        await transactionDateInput.waitFor({ state: 'visible' });
        await transactionDateInput.fill(date);

        const findByDateButton = page.locator("button#findByDate");
        await findByDateButton.waitFor({ state: 'visible' });
        await findByDateButton.click();

        const transactionBody = page.locator("#transactionBody");
        await transactionBody.waitFor({ state: 'visible' });
        await expect(transactionBody).toContainText(date);
    });

    test("should 'Find by Date Range' after 'FIND TRANSACTIONS' click", async ({ page }) => {

        // Account needs to have at least 1 existing transfer:
        await transferToAccount(page);
        await page.goto("parabank/overview.htm");

        // Select first account and perform transaction validation check:
        const accountNumberLocator = page.locator('#accountTable > tbody > tr > td').first();
        await accountNumberLocator.waitFor({ state: 'visible' });
        const accountNumber = await accountNumberLocator.textContent();

        if (!accountNumber) {
            throw new Error("Account number not found.");
        }

        // Click on a first transaction:
        const transactionLink = page.locator(`a[href='activity.htm?id=${accountNumber}']`);
        await transactionLink.waitFor({ state: 'visible' });
        await transactionLink.click();

        // Perform transaction URL check:
        await expect(page).toHaveURL(`${baseUrl}/activity.htm?id=${accountNumber}`);
        const accountIdLocator = page.locator("#accountId");
        await accountIdLocator.waitFor({ state: 'visible' });
        await expect(accountIdLocator).toContainText(accountNumber);

        const transactionTableCell = page.locator("#transactionTable > tbody > tr > td").nth(1);
        await transactionTableCell.waitFor({ state: 'visible' });
        await transactionTableCell.click();

        // Retrieve 'Transaction Date' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find by Date Range':

        const dateLocator = page.locator("#rightPanel > table > tbody > tr").nth(1).locator("td").nth(1);
        await dateLocator.waitFor({ state: 'visible' });
        const date = await dateLocator.textContent();

        if (!date) {
            throw new Error("Transaction date not found.");
        }

        const findTransactionsLink = page.locator("a[href='findtrans.htm']");
        await findTransactionsLink.waitFor({ state: 'visible' });
        await findTransactionsLink.click();

        const fromDateInput = page.locator("input#fromDate");
        await fromDateInput.waitFor({ state: 'visible' });
        await fromDateInput.fill(date);

        const toDateInput = page.locator("input#toDate");
        await toDateInput.waitFor({ state: 'visible' });
        await toDateInput.fill(date);

        const findByDateRangeButton = page.locator("button#findByDateRange");
        await findByDateRangeButton.waitFor({ state: 'visible' });
        await findByDateRangeButton.click();

        const transactionBody = page.locator("#transactionBody");
        await transactionBody.waitFor({ state: 'visible' });
        await expect(transactionBody).toContainText(date);
    });

    test("should 'Find by Amount' after 'FIND TRANSACTIONS' click", async ({ page }) => {

        // Account needs to have at least 1 existing transfer:
        await transferToAccount(page);
        await page.goto("parabank/overview.htm");

        // Select first account and perform transaction validation check:
        const accountNumberLocator = page.locator('#accountTable > tbody > tr > td').first();
        await accountNumberLocator.waitFor({ state: 'visible' });
        const accountNumber = await accountNumberLocator.textContent();

        if (!accountNumber) {
            throw new Error("Account number not found.");
        }

        // Click on a first transaction:
        const transactionLink = page.locator(`a[href='activity.htm?id=${accountNumber}']`);
        await transactionLink.waitFor({ state: 'visible' });
        await transactionLink.click();

        // Perform transaction URL check:
        await expect(page).toHaveURL(`${baseUrl}/activity.htm?id=${accountNumber}`);
        const accountIdLocator = page.locator("#accountId");
        await accountIdLocator.waitFor({ state: 'visible' });
        await expect(accountIdLocator).toContainText(accountNumber);

        const transactionTableCell = page.locator("#transactionTable > tbody > tr > td").nth(1);
        await transactionTableCell.waitFor({ state: 'visible' });
        await transactionTableCell.click();

        // Retrieve 'Transaction Amount' and navigate to 'findtrans.htm'. Select suitable account, then perform 'Find by Amount':
        const amountLocator = page.locator("#rightPanel > table > tbody > tr").nth(4).locator("td").nth(1);
        await amountLocator.waitFor({ state: 'visible' });
        const amount = await amountLocator.textContent();

        if (!amount) {
            throw new Error("Transaction amount not found.");
        }

        const modifiedAmount = amount.startsWith("$") ? amount.slice(1) : amount;

        const findTransactionsLink = page.locator("a[href='findtrans.htm']");
        await findTransactionsLink.waitFor({ state: 'visible' });
        await findTransactionsLink.click();

        const amountInput = page.locator("input#amount");
        await amountInput.waitFor({ state: 'visible' });
        await amountInput.fill(modifiedAmount);

        const findByAmountButton = page.locator("button#findByAmount");
        await findByAmountButton.waitFor({ state: 'visible' });
        await findByAmountButton.click();

        const transactionTable = page.locator("#transactionTable");
        await transactionTable.waitFor({ state: 'visible' });
        await expect(transactionTable).toContainText(modifiedAmount);
    });

});