import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

test.describe("User Is Logged In - Footer Section", () => {

    test.beforeEach(async ({ page }) => {

        await registerEndUser(page);
        await logOut(page);

        await loginEndUser(page);
    });

    test("should navigate 'Home', 'About US', 'Services' to corresponding pages", async ({ page }) => {

        const baseURL = 'https://parabank.parasoft.com/parabank';

        const pageNavigation = [

            { listIndex: 0, urlText: "Home", url: "index.htm" },
            { listIndex: 1, urlText: "About Us", url: "about.htm" },
            { listIndex: 2, urlText: "Services", url: "services.htm" }

        ];

        for (const item of pageNavigation) {

            const link = page.locator(`div#footerPanel > ul > li`).nth(item.listIndex).locator("a");
            await expect(link).toContainText(item.urlText);
            await link.click();
            await expect(page.url()).toBe(`${baseURL}/${item.url}`);

        }
    })

    test("should navigate 'Products' to https://www.parasoft.com/products/", async ({ page }) => {

        const link = page.locator("div#footerPanel > ul > li").nth(3).locator("a");
        await expect(link).toContainText("Products");
        await expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");

        if (targetUrl === null) {
            throw new Error("Failed to retrieve target URL.");
        }

        await page.goto(targetUrl);
        await expect(page.url()).toBe("https://www.parasoft.com/products/");
    })

    test("should navigate 'Locations' to 'https://www.parasoft.com/solutions/'", async ({ page }) => {

        const link = page.locator("div#footerPanel > ul > li").nth(4).locator("a");
        await expect(link).toContainText("Locations");
        await expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl === null) {
            throw new Error("Failed to retrieve target URL.");
        }
        await page.goto(targetUrl);
        await expect(page.url()).toBe("https://www.parasoft.com/solutions/");

    })

    test("should navigate 'Forum' to 'https://forums.parasoft.com/'", async ({ page }) => {

        const link = page.locator("div#footerPanel > ul > li").nth(5).locator("a");
        await expect(link).toContainText("Forum");
        await expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl === null) {
            throw new Error("Failed to retrieve target URL.");
        }
        await page.goto(targetUrl);
        await expect(page.url()).toBe("https://forums.parasoft.com/");
    })

    test("should navigate 'Contact Us' to '/contact.htm'", async ({ page }) => {

        const baseURL = 'https://parabank.parasoft.com/parabank';
        const link = page.locator("div#footerPanel > ul > li").nth(7).locator("a");
        await expect(link).toContainText("Contact Us");
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/contact.htm`);

    })

    test("should launch copyright hyperlink to https://www.parasoft.com/", async ({ page }) => {

        const link = page.locator("#footerPanel > ul").nth(1).locator("a");
        const targetUrl = await link.getAttribute("href");
        if (targetUrl === null) {
            throw new Error("Failed to retrieve target URL.");
        }
        await page.goto(targetUrl);
        await expect(page.url()).toBe("https://www.parasoft.com/");
    })
});
