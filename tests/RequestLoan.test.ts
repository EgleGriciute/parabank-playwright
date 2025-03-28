import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

test.describe("Request Loan", () => {

    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);

        await loginEndUser(page);
        await page.goto("/parabank/requestloan.htm");

    });

    test('should navigate to ${baseUrl}/requestloan.htm after click', async ({ page }) => {

        await page.goto('/');
        await page.click("a[href='requestloan.htm']");

        await expect(page.url()).toContain("/requestloan.htm");

    });

    test("should apply for a loan successfully after 'APPLY NOW' click", async ({ page }) => {

        // Navigate to 'Accounts Overview' and retrieve selected account's available balance:
        await page.goto("parabank/overview.htm");
        await page.click('#accountTable > tbody > tr > td a');

        await page.waitForTimeout(1000); // Wait for 1 second

        const url = await page.url();
        await expect(url).toContain("/activity.htm?id=");

        // Get available balance text and handle potential null value
        const availableBalanceElement = page.locator("#accountDetails > table > tbody > tr td#availableBalance");
        await expect(availableBalanceElement).toBeVisible({ timeout: 5000 });

        const availableBalanceText = await availableBalanceElement.textContent();

        // Validate that availableBalanceText is not null
        await expect(availableBalanceText).not.toBeNull();

        // Now TypeScript knows availableBalanceText is not null
        const refactoredAvailableBalance = parseFloat(availableBalanceText!.replace(/[$,]/g, ""));

        // Ensure the balance is retrieved correctly:
        await expect(typeof refactoredAvailableBalance).toBe("number");
        await expect(refactoredAvailableBalance).toBeGreaterThan(0);

        // Navigate to loan request page:
        await page.goto("parabank/requestloan.htm");

        // Enter loan details:
        await page.fill("input#amount", "1000");
        await page.fill("input#downPayment", "150");

        // Retrieve downPayment value and assert it's not greater than available balance:
        const downPaymentValue = await page.inputValue("input#downPayment");

        // Ensure downPaymentValue is correctly parsed:
        const parsedDownPayment = parseFloat(downPaymentValue);

        await expect(typeof parsedDownPayment).toBe("number");
        await expect(parsedDownPayment).toBeLessThanOrEqual(refactoredAvailableBalance);

        // Submit the loan application:
        await page.click("input[value='Apply Now']");
        await expect(page.locator("#loanRequestApproved")).toContainText("Congratulations, your loan has been approved.");
    });

    test("should return 'You do not have sufficient funds for the given down payment.' if there is not enough balance", async ({ page }) => {

        // Retrieve bank account value from select option and extract the account ID:
        await page.locator("select#fromAccountId option").allTextContents();

        // Navigate to 'Accounts Overview' and retrieve selected account's available balance:
        await page.goto("parabank/overview.htm");
        await page.click('#accountTable > tbody > tr > td a');

        await page.waitForTimeout(1000); // Wait for 1 second

        const url = await page.url();

        await expect(url).toContain("/activity.htm?id=");

        const availableBalanceText = await page.locator("#accountDetails > table > tbody > tr td#availableBalance").textContent();

        if (availableBalanceText !== null) {
            const refactoredAvailableBalance = parseFloat(availableBalanceText.replace(/[$,]/g, ""));

            // Ensure the balance is retrieved correctly:
            await expect(typeof refactoredAvailableBalance).toBe("number");
            await expect(refactoredAvailableBalance).toBeGreaterThan(0);

            // Navigate to loan request page:
            await page.goto("parabank/requestloan.htm");

            // Enter loan details - use a value higher than available balance:
            await page.fill("input#amount", "10000");

            const downPaymentAmount = refactoredAvailableBalance + 100;
            await page.fill("input#downPayment", downPaymentAmount.toString());

            // Retrieve downPayment value:
            const downPaymentValue = await page.inputValue("input#downPayment");

            // Ensure downPaymentValue is correctly parsed:
            const parsedDownPayment = parseFloat(downPaymentValue);

            await expect(typeof parsedDownPayment).toBe("number");

            // Verify the down payment is indeed greater than available balance:
            await expect(parsedDownPayment).toBeGreaterThan(refactoredAvailableBalance);

            // Submit the loan application:
            await page.click("input[value='Apply Now']");

            await expect(page.locator("#loanRequestDenied")).toContainText("You do not have sufficient funds for the given down payment.");
            await expect(page.locator("#loanStatus")).toHaveText("Denied");
        } else {
            throw new Error("Failed to retrieve available balance.");
        }
    });

    test("should return 'Error! An internal error has occurred and has been logged.' after passing numeric value 0", async ({ page }) => {

        // Type values into input fields:
        await page.fill("input#amount", "0");
        await page.fill("input#downPayment", "0");

        // Click the 'Apply Now' button:
        await page.click("input[value='Apply Now']");

        // Verify error messages:
        await expect(page.locator("#requestLoanError h1")).toContainText("Error!");
        await expect(page.locator("#requestLoanError p")).toContainText("An internal error has occurred and has been logged.");

    });

    test("should return 'Error! An internal error has occurred and has been logged.' after passing space character to $ fields", async ({ page }) => {

        // Type space characters into input fields:
        await page.fill("input#amount", " ");
        await page.fill("input#downPayment", " ");

        // Click the 'Apply Now' button:
        await page.click("input[value='Apply Now']");

        // Verify error messages:
        await expect(page.locator("#requestLoanError h1")).toContainText("Error!");
        await expect(page.locator("#requestLoanError p")).toContainText("An internal error has occurred and has been logged.");

    });

    test("should return 'Error! An internal error has occurred and has been logged.' if 'Loan Amount $' value is missing", async ({ page }) => {

        // Clear and type value into down payment field:
        await page.fill("input#downPayment", "100");

        // Ensure the loan amount field is empty:
        await page.fill("input#amount", "");

        // Click the 'Apply Now' button:
        await page.click("input[value='Apply Now']");

        // Verify error messages:
        await expect(page.locator("#requestLoanError h1")).toContainText("Error!");
        await expect(page.locator("#requestLoanError p")).toContainText("An internal error has occurred and has been logged.");

    });

    test("should return 'Error! An internal error has occurred and has been logged.' if 'Down Payment: $' value is missing", async ({ page }) => {

        // Type value into loan amount field:
        await page.fill("input#amount", "100");

        // Ensure the down payment field is empty:
        await page.fill("input#downPayment", "");

        // Click the 'Apply Now' button:
        await page.click("input[value='Apply Now']");

        // Verify error messages:
        await expect(page.locator("#requestLoanError h1")).toContainText("Error!");
        await expect(page.locator("#requestLoanError p")).toContainText("An internal error has occurred and has been logged.");

    });

});