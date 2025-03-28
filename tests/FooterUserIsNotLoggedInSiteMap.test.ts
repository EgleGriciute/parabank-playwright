import { test, expect } from '@playwright/test';

const baseURL = 'https://parabank.parasoft.com/parabank';

test.describe("User Is Not Logged In Site Map - Footer Section", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/sitemap.htm`);
    });

    test("should navigate 'Site Map' to '/sitemap.htm'", async ({ page }) => {
        const link = page.locator("div#footerPanel > ul > li").nth(6).locator("a");
        expect(link).toContainText("Site Map");
        expect(link).toBeVisible();
        await link.click();
        expect(page.url()).toContain(`${baseURL}/sitemap.htm`);
    })

    test("should navigate 'About Us' to '/about.htm'", async ({ page }) => {
        const link = page.locator("ul.leftmenu > li").nth(1);
        await link.click();
        expect(page.url()).toContain(`${baseURL}/about.htm`);
    })

    test("should navigate 'Services' to '/services.htm'", async ({ page }) => {
        const link = page.locator("ul.leftmenu > li").nth(2);
        await link.click();
        expect(page.url()).toContain(`${baseURL}/services.htm`);
    })

    test("should navigate 'Products' to https://www.parasoft.com/products/", async ({ page }) => {
        const link = page.locator("#rightPanel > ul.leftmenu > li").nth(3).locator("a");
        expect(link).toContainText("Products");
        expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            expect(page.url()).toBe("https://www.parasoft.com/products/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })

    test("should navigate 'Locations' to https://www.parasoft.com/solutions/", async ({ page }) => {
        const link = page.locator("#rightPanel > ul.leftmenu > li").nth(4).locator("a");
        expect(link).toContainText("Locations");
        expect(link).toBeVisible();
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            expect(page.url()).toBe("https://www.parasoft.com/solutions/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })

    test("should navigate 'Admin Page' to /admin.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul.leftmenu > li").nth(5).locator("a");
        expect(link).toContainText("Admin Page");
        expect(link).toBeVisible();
        await link.click();
        expect(page.url()).toContain(`${baseURL}/admin.htm`);
    })

    test("should navigate 'Open New Account' to /openaccount.htm and return 'An internal error has occurred and has been logged.'", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(0).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/openaccount.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should navigate 'Accounts Overview' to /overview.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(1).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/overview.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should navigate 'Transfer Funds' to /transfer.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(2).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/transfer.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should navigate 'Bill Pay' to /billpay.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(3).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/billpay.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should navigate 'Find Transactions' to /findtrans.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(4).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/findtrans.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should navigate 'Update Contact Info' to /updateprofile.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(5).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/updateprofile.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should navigate 'Request Loan' to /requestloan.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(6).locator("a");
        await link.click();
        expect(page.url()).toContain(`${baseURL}/requestloan.htm`);

        const errorText = await page.locator("#rightPanel p.error").textContent();
        expect(errorText).toBe("An internal error has occurred and has been logged.");
    })

    test("should launch copyright hyperlink to https://www.parasoft.com/", async ({ page }) => {
        const link = page.locator("#footerPanel > ul").nth(1).locator("a");
        const targetUrl = await link.getAttribute("href");
        if (targetUrl !== null) {
            await page.goto(targetUrl);
            expect(page.url()).toBe("https://www.parasoft.com/");
        } else {
            throw new Error("Failed to retrieve target URL.");
        }
    })
});
