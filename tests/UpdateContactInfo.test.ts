import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

const baseUrl = 'https://parabank.parasoft.com/parabank';

test.describe("Update Contact Info", () => {

    test.beforeEach(async ({ page }) => {
        await registerEndUser(page);
        await logOut(page);
        await loginEndUser(page);
        await page.goto(`${baseUrl}/updateprofile.htm`);
    });

    test("should navigate to /updateprofile.htm after click", async ({ page }) => {
        await page.goto(`${baseUrl}/overview.htm`);
        await page.locator("a[href='updateprofile.htm']").click();
        await expect(page).toHaveURL(`${baseUrl}/updateprofile.htm`);
    });

    test('should check if fields are not empty initially', async ({ page }) => {
        const fieldIds = [
            "customer\\.firstName",
            "customer\\.lastName",
            "customer\\.address\\.street",
            "customer\\.address\\.city",
            "customer\\.address\\.state",
            "customer\\.address\\.zipCode",
            "customer\\.phoneNumber",
        ];

        for (const id of fieldIds) {
            const inputElement = page.locator(`#${id}`);
            await expect(inputElement).not.toBeEmpty();
        }
    });



    test("should render error messages for required fields if not filled in", async ({ page }) => {
        const profileInformationDetails = [
            { info: "First Name", input: "customer.firstName", error: "First name is required." },
            { info: "Last Name", input: "customer.lastName", error: "Last name is required." },
            { info: "Address", input: "customer.address.street", error: "Address is required." },
            { info: "City", input: "customer.address.city", error: "City is required." },
            { info: "State", input: "customer.address.state", error: "State is required." },
            { info: "Zip Code", input: "customer.address.zipCode", error: "Zip Code is required." },
            { info: "Phone #", input: "customer.phoneNumber", hasError: false }  // No error for phone number
        ];

        // Wait for the form to fully load:
        await page.waitForTimeout(1000);

        // Clear all fields:
        for (const item of profileInformationDetails) {
            const inputLocator = page.locator(`input#${item.input.replace(/\./g, '\\.')}`);
            await inputLocator.waitFor({ state: 'visible' });
            await inputLocator.fill("");
            await inputLocator.blur();
        }

        const updateProfileButton = page.locator("input[value='Update Profile']");
        await updateProfileButton.waitFor({ state: 'visible' });
        await updateProfileButton.click();

        const formLocator = page.locator("table.form2");
        await formLocator.waitFor({ state: 'visible' });

        for (const item of profileInformationDetails) {
            if (item.hasError === false) {
                // Ensure that phone number does NOT show error
                await expect(formLocator).not.toContainText(`${item.error}`);
            } else {
                // For others, ensure the error message appears
                await expect(formLocator).toContainText(item.error ?? '');
            }
        }
    });
});
