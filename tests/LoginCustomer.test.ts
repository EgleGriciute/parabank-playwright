import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

test.describe("Customer Login", () => {

    test.beforeEach(async ({ page }) => {
        await registerEndUser(page);
        await logOut(page);
    });

    test("should login with correct credentials: username and password", async ({ page }) => {
        await loginEndUser(page);
    });

    test("should return 'Error! Please enter a username and password.' after leaving input fields empty", async ({ page }) => {
        await page.locator("input[value='Log In']").click();

        // Debug: Check if the error message exists
        const errorMessages = await page.locator("text=Error! Please enter a username and password.").count();
        console.log("Error message count:", errorMessages);

        // Fixed: Use getByText and ensure visibility
        await expect(page.getByText(/Please enter a username and password/i)).toBeVisible();
    });

    test("should return 'Error! Please enter a username and password.' if username is filled but password is empty", async ({ page }) => {
        await page.locator("input[name='username']").fill("test");
        await page.locator("input[value='Log In']").click();

        // Fixed: Wait for message and match text case-insensitively
        await expect(page.getByText(/Please enter a username and password/i)).toBeVisible();
    });

    test("should return 'Error! Please enter a username and password.' if password is filled but username is empty", async ({ page }) => {
        await page.locator("input[name='password']").fill("test");
        await page.locator("input[value='Log In']").click();

        // Fixed: More reliable error message check
        await expect(page.getByText(/Please enter a username and password/i)).toBeVisible();
    });

});
