import { test, expect } from '@playwright/test';
import { registerEndUser, logOut } from './fixtures/common';
import { faker } from '@faker-js/faker';

test.describe("Register User", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    });

    test("should navigate to register page after clicking 'Register'", async ({ page }) => {
        await page.goto('/');
        await page.click("#loginPanel > p > a[href='register.htm']");
        await expect(page.url()).toContain('/register.htm');
    });

    test("should return welcome messages after successful registration", async ({ page }) => {

        const userData = await registerEndUser(page);

        await expect.poll(() => page.locator("#leftPanel > .smallText").textContent(), {
            timeout: 10000 // Increase timeout to 10 seconds or more
        }).toContain(`Welcome ${userData.firstName} ${userData.lastName}`);
    });

    test("should show register, even if all of the other fields belong to another user, except username field", async ({ page }) => {

        const userData = await registerEndUser(page);
        await logOut(page);

        await page.goto("/parabank/register.htm");

        await page.locator('#customer\\.firstName').fill(userData.firstName);
        await page.locator("#customer\\.lastName").fill(userData.lastName);
        await page.locator("#customer\\.address\\.street").fill(userData.address);
        await page.locator("#customer\\.address\\.city").fill(userData.city);
        await page.locator("#customer\\.address\\.state").fill(userData.state);
        await page.locator("#customer\\.address\\.zipCode").fill(userData.zipCode);
        await page.locator("#customer\\.phoneNumber").fill(userData.phoneNumber);
        await page.locator("#customer\\.ssn").fill(userData.ssn);
        await page.locator("#customer\\.username").fill("newUser");
        await page.locator("#customer\\.password").fill(userData.password);
        await page.locator("#repeatedPassword").fill(userData.password);

        // Submit form:
        await page.click("input[value='Register']");

    });

    test("should show 'This username already exists.', if an existing user will attempt to register", async ({ page }) => {

        const userData = await registerEndUser(page);
        await logOut(page);
        await page.goto("/parabank/register.htm");

        await page.locator('#customer\\.firstName').fill(userData.firstName);
        await page.locator("#customer\\.lastName").fill(userData.lastName);
        await page.locator("#customer\\.address\\.street").fill(userData.address);
        await page.locator("#customer\\.address\\.city").fill(userData.city);
        await page.locator("#customer\\.address\\.state").fill(userData.state);
        await page.locator("#customer\\.address\\.zipCode").fill(userData.zipCode);
        await page.locator("#customer\\.phoneNumber").fill(userData.phoneNumber);
        await page.locator("#customer\\.ssn").fill(userData.ssn);
        await page.locator("#customer\\.username").fill(userData.username);
        await page.locator("#customer\\.password").fill(userData.password);
        await page.locator("#repeatedPassword").fill(userData.password);

        // Submit form:
        await page.click("input[value='Register']");

        await expect(page.locator("#customer\\.username\\.errors")).toContainText("This username already exists.");
    });

    test("should return form validation error messages for all form fields after clicking on 'REGISTER' button", async ({ page }) => {

        await page.click("input[value='Register']");

        await expect(page.locator("span.error")).toHaveCount(10);
        await expect(page.locator("span.error")).toContainText([
            "First name is required.",
            "Last name is required.",
            "Address is required.",
            "City is required.",
            "State is required.",
            "Zip Code is required.",
            "Social Security Number is required.",
            "Username is required.",
            "Password is required.",
            "Password confirmation is required.",
        ]);

    })

    test('should verify error messages disappear when fields are filled', async ({ page }) => {

        const inputFields = [

            { locator: '#customer\\.firstName', errorMessage: 'First name is required.' },
            { locator: '#customer\\.lastName', errorMessage: "Last name is required." },
            { locator: '#customer\\.address\\.street', errorMessage: "Address is required." },
            { locator: '#customer\\.address\\.city', errorMessage: "City is required." },
            { locator: '#customer\\.address\\.state', errorMessage: "State is required." },
            { locator: '#customer\\.address\\.zipCode', errorMessage: "Zip Code is required." },
            { locator: '#customer\\.ssn', errorMessage: "Social Security Number is required." },
            { locator: '#customer\\.username', errorMessage: "Username is required." },
            { locator: '#customer\\.password', errorMessage: "Password is required." },
            { locator: '#repeatedPassword', errorMessage: "Password confirmation is required." },

        ];

        for (const { locator, errorMessage } of inputFields) {

            // Trigger initial validation messages:
            await page.locator("input[value='Register']").click();
            await expect(page.locator(`text="${errorMessage}"`)).toBeVisible();

            // Fill in text for each field and submit:
            await page.locator(locator).fill('test');
            await page.locator("input[value='Register']").click();

            await expect(page.locator(`text="${errorMessage}"`)).not.toBeVisible();
        }
    });

    test("should show repeated password does not match", async ({ page }) => {

        await page.locator("#customer\\.firstName").fill(faker.person.firstName());
        await page.locator("#customer\\.lastName").fill(faker.person.lastName());
        await page.locator("#customer\\.address\\.street").fill(faker.location.streetAddress());
        await page.locator("#customer\\.address\\.city").fill(faker.location.city());
        await page.locator("#customer\\.address\\.state").fill(faker.location.state());
        await page.locator("#customer\\.address\\.zipCode").fill(faker.location.zipCode())
        await page.locator("#customer\\.phoneNumber").fill(faker.phone.number({ style: 'international' }));
        await page.locator("#customer\\.ssn").fill(faker.number.int(1000000000).toString());
        await page.locator("#customer\\.username").fill(faker.internet.username());
        await page.locator("#customer\\.password").fill(faker.internet.password());
        await page.locator("#repeatedPassword").fill("test");
        await page.locator("input[value='Register']").click();

        await page.locator("#repeatedPassword\\.errors").isVisible();
    });

});
