import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser, openNewAccount } from './fixtures/common';

test.describe.configure({ mode: "parallel" });

test.describe("Pay Bill", () => {

    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);
        await loginEndUser(page);

        await openNewAccount(page, "CHECKING");
        await page.goto("parabank/billpay.htm");

    });

    test("should navigate to ${baseUrl}/billpay.htm after 'Bill Pay' click", async ({ page }) => {

        const baseUrl = 'https://parabank.parasoft.com/parabank';
        await page.goto(`${baseUrl}/overview.htm`);

        await page.locator("a[href='billpay.htm']").click();
        await expect(page).toHaveURL(`${baseUrl}/billpay.htm`);

        await expect(page.locator("div#billpayForm h1")).toContainText("Bill Payment Service");

    });

    test("should transfer payment to payee after filling in payment information and render 'Bill Payment Complete'", async ({ page }) => {

        const payeeInformation = [
            { selector: 'payee.name', info: "Receiver" },
            { selector: 'payee.address.street', info: "Receiver Address" },
            { selector: 'payee.address.city', info: "Receiver City" },
            { selector: 'payee.address.state', info: "Receiver State" },
            { selector: 'payee.address.zipCode', info: "Receiver zipCode" },
            { selector: 'payee.phoneNumber', info: "Receiver phone" },
            { selector: 'payee.accountNumber', info: "99999" },
            { selector: 'verifyAccount', info: "99999" },
            { selector: 'amount', info: "1" }
        ];

        for (const input of payeeInformation) {
            await page.locator(`input[name='${input.selector}']`).waitFor({ state: 'visible' });
            await page.locator(`input[name='${input.selector}']`).fill(input.info);
        }

        await page.locator("input[value='Send Payment']").click();
        await expect(page.locator("#billpayResult h1")).toContainText("Bill Payment Complete");
    });

    test("should validate each form table field after 'SEND PAYMENT' click", async ({ page }) => {
        await page.locator("input[value='Send Payment']").click();

        const payeeInformationValidationErrors = [
            { selector: "name", message: "Payee name is required." },
            { selector: "address", message: "Address is required." },
            { selector: "city", message: "City is required." },
            { selector: "state", message: "State is required." },
            { selector: "zipCode", message: "Zip Code is required." },
            { selector: "phoneNumber", message: "Phone number is required." },
            { selector: "account-empty", message: "Account number is required." },
            { selector: "verifyAccount-empty", message: "Account number is required." },
            { selector: "amount-empty", message: "The amount cannot be empty. " },
        ];

        for (const error of payeeInformationValidationErrors) {
            await page.locator(`span#validationModel-${error.selector}`).waitFor({ state: 'visible' });
            await expect(page.locator(`span#validationModel-${error.selector}`)).toContainText(error.message);
        }
    });

    test("should validate fields 'Account #', 'Verify Account #', 'Amount: $' and only numeric values may pass", async ({ page }) => {

        const payeeInformation = [

            { selector: 'payee.name', info: "Receiver" },
            { selector: 'payee.address.street', info: "Receiver Address" },
            { selector: 'payee.address.city', info: "Receiver City" },
            { selector: 'payee.address.state', info: "Receiver State" },
            { selector: 'payee.address.zipCode', info: "Receiver zipCode" },
            { selector: 'payee.phoneNumber', info: "Receiver phone" },

        ];

        for (const input of payeeInformation) {
            await page.locator(`input[name='${input.selector}']`).waitFor({ state: 'visible' });
            await page.locator(`input[name='${input.selector}']`).fill(input.info);
        }

        const invalidInputs = ["test", "😀", "@#$%"];

        for (const invalidValue of invalidInputs) {
            await page.locator("input[name='payee.accountNumber']").waitFor({ state: 'visible' });
            await page.locator("input[name='payee.accountNumber']").fill(invalidValue);

            await page.locator("input[name='verifyAccount']").waitFor({ state: 'visible' });
            await page.locator("input[name='verifyAccount']").fill(invalidValue);

            await page.locator("input[name='amount']").waitFor({ state: 'visible' });
            await page.locator("input[name='amount']").fill(invalidValue);

            await page.locator("input[value='Send Payment']").click();

            await page.locator("span#validationModel-account-invalid").waitFor({ state: 'visible' });
            await expect(page.locator("span#validationModel-account-invalid")).toContainText("Please enter a valid number.");

            await page.locator("span#validationModel-verifyAccount-invalid").waitFor({ state: 'visible' });
            await expect(page.locator("span#validationModel-verifyAccount-invalid")).toContainText("Please enter a valid number.");

            await page.locator("span#validationModel-amount-invalid").waitFor({ state: 'visible' });
            await expect(page.locator("span#validationModel-amount-invalid")).toContainText("Please enter a valid amount.");
        }
    });

});