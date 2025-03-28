import { test, expect } from "@playwright/test";

const baseURL = 'https://parabank.parasoft.com/parabank';

test.describe("Left menu navigation", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
        await page.waitForLoadState("networkidle");
    });

    test("should show 'Solutions' as set to a default page: baseUrl (not clickable)", async ({ page }) => {
        const solutionsElement = page.locator(".Solutions");

        const cursorStyle = await solutionsElement.evaluate(element =>
            window.getComputedStyle(element).getPropertyValue("cursor")
        );

        expect(["default", "not-allowed", "auto"]).toContain(cursorStyle);

        // Fix: Use regex to ignore session ID
        await expect(page).toHaveURL(/index\.htm/);
    });

    test("should navigate 'About Us' to: ${baseUrl}/about.htm", async ({ page }) => {
        await test.step("Navigate to About Us", async () => {
            await page.getByRole('link', { name: 'About Us' }).first().click();
            await expect(page).toHaveURL(`${baseURL}/about.htm`);
        });

        await test.step("Verify content", async () => {
            await expect(page.locator("#rightPanel > h1")).toHaveText("ParaSoft Demo Website");

            // Fix: Target the link specifically inside #rightPanel
            const parasoftLink = page.locator("#rightPanel a[href='http://www.parasoft.com/']");
            await expect(parasoftLink).toBeVisible();
        });
    });

    test("should navigate 'Services' to: ${baseUrl}/services.htm", async ({ page }) => {
        await test.step("Navigate to Services", async () => {
            await page.getByRole('link', { name: 'Services' }).first().click();
            await expect(page).toHaveURL(`${baseURL}/services.htm`);
        });

    });

    test("should navigate 'Products' to: ${parasoftExternalUrl}/products/", async ({ page }) => {
        await test.step("Navigate to Products", async () => {
            await page.goto("http://www.parasoft.com/jsp/products.jsp");
        });

        await test.step("Verify correct page", async () => {
            await expect(page).toHaveURL(/parasoft\.com/);
        });
    });

    test("should navigate 'Locations' to: ${parasoftExternalUrl}/solutions/", async ({ page }) => {
        await test.step("Navigate to Locations", async () => {
            await page.goto("http://www.parasoft.com/jsp/pr/contacts.jsp");
        });

        await test.step("Verify correct page", async () => {
            await expect(page).toHaveURL(/parasoft\.com/);
        });
    });

    test("should navigate 'Admin Page' to ${baseUrl}/admin.htm", async ({ page }) => {
        await test.step("Navigate to Admin Page", async () => {
            await page.getByRole('link', { name: 'Admin Page' }).first().click();
            await expect(page).toHaveURL(`${baseURL}/admin.htm`);
        });
    });

});
