import { test, expect } from "@playwright/test";

test.describe("Left menu", () => {

    test.beforeEach(async ({ page }) => {

        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("should show 'Solutions' as set to a default page: baseUrl (not clickable)", async ({ page }) => {

        const solutionsElement = page.locator(".Solutions");

        const cursorElement = await solutionsElement.evaluate(element => {
            return window.getComputedStyle(element).getPropertyValue("cursor");
        });

        expect(cursorElement).not.toBe("pointer");
        expect(page.url()).toContain("/index.htm");

    });

    test("should navigate 'About Us' to: ${baseUrl}/about.htm", async ({ page }) => {

        await page.locator(".leftmenu > li > a[href='about.htm']").click();
        expect(page.url()).toContain("/about.htm");

        const heading = page.locator("#rightPanel > h1");
        expect(heading).toHaveText("ParaSoft Demo Website");

        const parasoftLink = page.locator("#rightPanel > p > a[href='http://www.parasoft.com/']");

        expect(parasoftLink).toBeVisible();
        expect(parasoftLink).toBeEnabled();

    });

    test("should navigate 'Services' to: ${baseUrl}/services.htm", async ({ page }) => {

        await page.locator(".leftmenu > li > a[href='services.htm']").click();
        expect(page.url()).toContain("/services.htm");

        const headings = page.locator("span.heading");

        const headingElements = await headings.all();

        headingElements.forEach(async (heading) => {

            expect(heading).toBeVisible();

            const text = await heading.textContent();
            expect(text?.trim().length).toBeGreaterThan(0);

        });

    });

    test("should navigate 'Products' to: ${parasoftExternalUrl}/products/", async ({ page, context }) => {

        const productLink = page.locator(".leftmenu > li > a[href='http://www.parasoft.com/jsp/products.jsp']");
        expect(productLink).toBeVisible();

        const href = await productLink.getAttribute("href");

        // Open a new page to navigate to the external URL:
        const externalPage = await context.newPage();
        await externalPage.goto(href || " ");

        expect(externalPage.url()).toBe("https://www.parasoft.com/products/");
        await externalPage.close();

    });

    test("should navigate 'Locations' to: ${parasoftExternalUrl}/solutions/", async ({ page, context }) => {

        const locationsLink = page.locator(".leftmenu > li > a[href='http://www.parasoft.com/jsp/pr/contacts.jsp']");
        expect(locationsLink).toBeVisible();

        const href = await locationsLink.getAttribute("href");

        // Open a new page to navigate to the external URL:
        const externalPage = await context.newPage();
        await externalPage.goto(href || "");

        expect(externalPage.url()).toBe("https://www.parasoft.com/solutions/");
        await externalPage.close();

    });

    test("should navigate 'Admin Page' to ${baseUrl}/admin.htm", async ({ page }) => {

        await page.locator(".leftmenu > li > a[href='admin.htm']").click();
        expect(page.url()).toContain("/admin.htm");

    });

});