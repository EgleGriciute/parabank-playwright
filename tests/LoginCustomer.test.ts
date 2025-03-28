import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

test.describe("Customer Login", () => {

    test.beforeEach(async ({ page }) => {
        await registerEndUser(page);
        await logOut(page);
    });

    test("should login with correct credentials: username and password", async ({ page }) => {
        await loginEndUser(page);
    })

    test("should return 'Error! Please enter a username and password.' after leaving input fields empty", async ({ page }) => {

        // Click the 'Log In' button without filling in the fields:
        await page.locator("input[value='Log In']").click();

        // Expect the error message to be visible:
        expect(page.locator("text=Error! Please enter a username and password.")).toBeVisible();
    });

    test("should return 'Error! Please enter a username and password.' if username is filled but password is empty", async ({ page }) => {

        await page.locator("input[name='username']").fill("test");
        await page.locator("input[value='Log In']").click();

        // Expect the error message to be visible:
        expect(page.locator("text=Please enter a username and password.")).toBeVisible();

    });

    test("should return 'Error! Please enter a username and password.' if password is filled but username is empty", async ({ page }) => {

        await page.locator("input[name='password']").fill("test");
        await page.locator("input[value='Log In']").click();

        // Expect the error message to be visible:
        expect(page.locator("text=Please enter a username and password.")).toBeVisible();

    })

});


