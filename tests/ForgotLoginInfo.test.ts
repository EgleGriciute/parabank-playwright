import { test, expect } from '@playwright/test';
import { registerEndUser, logOut } from './fixtures/common';
import path = require('path');
import fs = require('fs');

test.describe("Forgot login info", () => {

    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);

        await expect(page.url()).toContain("index.htm");
        await page.locator("#loginPanel p > a[href='lookup.htm']").click();

    });

    test("should return ${baseUrl}/lookup.htm after 'Find my login info' click", async ({ page }) => {
        await expect(page.url()).toContain("lookup.htm");
    });

    test("should result in 'Your login information was located successfully. You are now logged in.' and render 'Username' and 'Password' after a successful form submission", async ({ page }) => {
        // Ensure the file path is correct and handle potential file reading errors
        const sessionFilePath = path.resolve(__dirname, './fixtures/sessionInfo.json');

        let sessionData;
        try {
            const fileContent = fs.readFileSync(sessionFilePath, 'utf-8').trim();
            sessionData = JSON.parse(fileContent);
        } catch (error) {
            throw new Error(`Error reading session file`);
        }

        const { firstName, lastName, address, city, state, zipCode, ssn, username, password } = sessionData.userData;

        // Navigate to lookup page
        await page.goto('parabank/lookup.htm');

        // Fill out lookup form
        await page.locator("input#firstName").fill(firstName);
        await page.locator("input#lastName").fill(lastName);
        await page.locator("input#address\\.street").fill(address);
        await page.locator("input#address\\.city").fill(city);
        await page.locator("input#address\\.state").fill(state);
        await page.locator("input#address\\.zipCode").fill(zipCode);
        await page.locator("input#ssn").fill(ssn);

        // Submit the form
        await page.locator("input[value='Find My Login Info']").click();

        // Verify success message
        await expect(page.locator("#rightPanel > p").first()).toContainText("Your login information was located successfully. You are now logged in.");

        // Verify username and password are displayed
        await expect(page.getByText(`Username: ${username}`)).toBeVisible();
        await expect(page.getByText(`Password: ${password}`)).toBeVisible();
    });

    test("should return form validation error messages after clicking on 'Find my login info'", async ({ page }) => {

        await page.locator("input[value='Find My Login Info']").click();

        const errorMessages = [

            { id: "firstName", message: "First name is required." },
            { id: "lastName", message: "Last name is required." },
            { id: "address\\.street", message: "Address is required." },
            { id: "address\\.city", message: "City is required." },
            { id: "address\\.state", message: "State is required." },
            { id: "address\\.zipCode", message: "Zip Code is required." },
            { id: "ssn", message: "Social Security Number is required." }
        ];

        for (const { id, message } of errorMessages) {
            const errorLocator = page.locator(`span#${id}\\.errors`);

            await expect(errorLocator).toBeVisible();
            await expect(errorLocator).toContainText(message);
        }

    });

    test("should return 'Error! The customer information provided could not be found.' after filling in invalid data", async ({ page }) => {

        await page.locator("input#firstName").fill("test");
        await page.locator("input#lastName").fill("test");
        await page.locator("input#address\\.street").fill("test");
        await page.locator("input#address\\.city").fill("test");
        await page.locator("input#address\\.state").fill("test");
        await page.locator("input#address\\.zipCode").fill("test");
        await page.locator("input#ssn").fill("test");

        await page.locator("input[value='Find My Login Info']").click();
        await expect(page.locator("#rightPanel p.error")).toContainText("The customer information provided could not be found.");

    });

});

