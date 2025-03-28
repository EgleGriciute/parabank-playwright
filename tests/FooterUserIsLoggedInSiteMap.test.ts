import { test, expect } from '@playwright/test';
import { registerEndUser, logOut, loginEndUser } from './fixtures/common';

const baseURL = 'https://parabank.parasoft.com/parabank';

test.describe("User Is Logged In Site Map - Footer Section", () => {

    test.beforeEach(async ({ page }) => {
        // Increase timeout for the entire hook
        test.setTimeout(60000);

        // Navigate to the base page first
        await page.goto(baseURL);

        // Implement more robust user registration and login
        await page.waitForLoadState('networkidle');
        await registerEndUser(page);

        // Add explicit waits and error handling for logout
        try {
            await page.waitForSelector("a[href='logout.htm']", { state: 'visible', timeout: 10000 });
            await logOut(page);
        } catch (error) {
            console.log('Logout failed, force refreshing page');
            await page.reload({ waitUntil: 'networkidle' });
        }

        // Ensure login is successful
        await loginEndUser(page);
        await page.waitForLoadState('networkidle');

        // Navigate to sitemap
        await page.goto(`${baseURL}/sitemap.htm`);
    });

    test("should navigate 'Site Map' to '/sitemap.htm'", async ({ page }) => {
        await test.step('Locate and click Site Map link', async () => {
            const link = page.locator("div#footerPanel > ul > li").nth(6).locator("a");
            await expect(link).toContainText("Site Map");
            await expect(link).toBeVisible();

            // Add multiple attempts to click
            await test.step('Click with retry', async () => {
                await expect(async () => {
                    await link.click({ timeout: 5000 });
                    await expect(page.url()).toBe(`${baseURL}/sitemap.htm`);
                }).toPass({
                    intervals: [1_000, 2_000],
                    timeout: 10_000
                });
            });
        });
    });

    test("should navigate 'About' to '/about.htm'", async ({ page }) => {
        const link = page.locator("ul.leftmenu > li").nth(1);
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/about.htm`);
    })

    test("should navigate 'Services' to '/services.htm'", async ({ page }) => {
        const link = page.locator("ul.leftmenu > li").nth(2);
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/services.htm`);
    })

    test("should navigate 'Products' to https://www.parasoft.com/products/", async ({ page }) => {
        await test.step('Locate and navigate to Products', async () => {
            const link = page.locator("#rightPanel > ul.leftmenu > li").nth(3).locator("a");
            await expect(link).toContainText("Products");
            await expect(link).toBeVisible();

            const targetUrl = await link.getAttribute("href");
            if (!targetUrl) {
                throw new Error("Failed to retrieve target URL.");
            }

            // Use page.evaluate for external navigation to handle potential issues
            await page.evaluate((url) => window.location.href = url, targetUrl);

            // Wait for navigation with increased timeout
            await page.waitForURL("https://www.parasoft.com/products/", { timeout: 10000 });

            expect(page.url()).toBe("https://www.parasoft.com/products/");
        });
    });

    test("should navigate 'Locations' to https://www.parasoft.com/solutions/", async ({ page }) => {
        const link = page.locator("#rightPanel > ul.leftmenu > li").nth(4).locator("a");
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

    test("should navigate 'Admin Page' to /admin.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul.leftmenu > li").nth(5).locator("a");
        await expect(link).toContainText("Admin Page");
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/admin.htm`);
    })

    test("should navigate 'Open New Account' to /openaccount.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(0).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/openaccount.htm`);
    })

    test("should navigate 'Accounts Overview' to /overview.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(1).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/overview.htm`);
    })

    test("should navigate 'Transfer Funds' to /transfer.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(2).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/transfer.htm`);
    })

    test("should navigate 'Bill Pay' to /billpay.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(3).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/billpay.htm`);
    })

    test("should navigate 'Find Transactions' to /findtrans.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(4).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/findtrans.htm`);
    })

    test("should navigate 'Update Contact Info' to /updateprofile.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(5).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/updateprofile.htm`);
    })

    test("should navigate 'Request Loan' to /requestloan.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(6).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/requestloan.htm`);
    })

    test("should navigate 'Log Out' to /index.htm", async ({ page }) => {
        const link = page.locator("#rightPanel > ul").nth(1).locator("li").nth(7).locator("a");
        await link.click();
        await expect(page.url()).toBe(`${baseURL}/index.htm?ConnType=JDBC`);
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

