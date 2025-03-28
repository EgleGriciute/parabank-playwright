import { test, expect } from '@playwright/test';

test.describe("Contact Page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("parabank/contact.htm");
    })

    test("should return success message after filling in contact form fields", async ({ page }) => {

        await page.locator("input[value='Send to Customer Care']").click();

        const customerCareErrors = ["name", "email", "phone", "message"];

        for (const customerCareError of customerCareErrors) {

            const errorLocator = page.locator(`#${customerCareError}`);
            await expect(errorLocator).toBeVisible();

        }

        await page.locator("table.form2 > tbody> tr > td >input#name").fill("test");
        await page.locator("table.form2 > tbody> tr > td >input#email").fill("test");
        await page.locator("table.form2 > tbody> tr > td >input#phone").fill("test");
        await page.locator("textarea").fill("test");

        await page.locator("input[value='Send to Customer Care']").click();

        await expect(page.locator("#rightPanel p").nth(1)).toContainText("A Customer Care Representative will be contacting you.");

    })

    test("should validate by showing error text messages after 'SEND TO CUSTOMER CARE' click", async ({ page }) => {

        await page.locator("input[value='Send to Customer Care']").click();

        const customerCareErrors = [

            { selector: "name", error: "Name is required." },
            { selector: "email", error: "Email is required." },
            { selector: "phone", error: "hone is required." },
            { selector: "message", error: "Message is required." }
        ]

        for (const customerCareError of customerCareErrors) {

            const errorLocator = page.locator(`span#${customerCareError.selector}\\.errors`);
            await expect(errorLocator).toBeVisible();

        }

    });
})
