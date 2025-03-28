import { test, expect } from '@playwright/test';

const baseURL = 'https://parabank.parasoft.com/parabank';

test.describe("User Is Not Logged In Site Map - Footer Section", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/index.htm`);
    });

    test("should navigate 'Home', 'About US', 'Services' to corresponding pages", async ({ page }) => {
        const pageNavigation = [
            { listIndex: 0, urlText: "Home", url: "index.htm" },
            { listIndex: 1, urlText: "About Us", url: "about.htm" },
            { listIndex: 2, urlText: "Services", url: "services.htm" }
        ];

        for (const item of pageNavigation) {
            const link = page.locator(`div#footerPanel > ul > li`).nth(item.listIndex).locator("a");
            expect(link).toContainText(item.urlText);
            await link.click();
            await expect(page.url()).toContain(`${baseURL}/${item.url}`);
        }
    })

    test("should navigate 'Products' to https://www.parasoft.com/products/", async ({ page }) => {
        const link = page.locator("div#footerPanel > ul > li").nth(3).locator("a");
        await expect(link).toContainText("Products");
        await expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            expect(page.url()).toBe("https://www.parasoft.com/products/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })

    test("should navigate 'Locations' to 'https://www.parasoft.com/solutions/'", async ({ page }) => {
        const link = page.locator("div#footerPanel > ul > li").nth(4).locator("a");
        await expect(link).toContainText("Locations");
        await expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            await expect(page.url()).toBe("https://www.parasoft.com/solutions/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })

    test("should navigate 'Forum' to 'https://forums.parasoft.com/'", async ({ page }) => {
        const link = page.locator("div#footerPanel > ul > li").nth(5).locator("a");
        await expect(link).toContainText("Forum");
        await expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            await expect(page.url()).toBe("https://forums.parasoft.com/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })

    test("should navigate 'Contact Us' to '/contact.htm'", async ({ page }) => {
        const link = page.locator("div#footerPanel > ul > li").nth(7).locator("a");
        await expect(link).toContainText("Contact Us");
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain(`${baseURL}/contact.htm`);
    })

    test("should launch copyright hyperlink to https://www.parasoft.com/", async ({ page }) => {
        const link = page.locator("#footerPanel > ul").nth(1).locator("a");
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            await expect(page.url()).toBe("https://www.parasoft.com/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })
});
