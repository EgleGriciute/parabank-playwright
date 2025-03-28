import { test, expect } from "@playwright/test";
import { loadHomePageSuccessfully } from "./fixtures/common";

test.describe("Right Menu", () => {

    test.beforeEach(async ({ page }) => {
        await loadHomePageSuccessfully(page);
    })

    test("should navigate Home button to baseUrl on a click", async ({ page }) => {
        await page.locator("ul.button > li.home").first().click();
        expect(page.url()).toContain("/index.htm");
    });

    test("should navigate About button to /about.htm on a click", async ({ page }) => {
        await page.locator("ul.button > li.aboutus").first().click();
        expect(page.url()).toContain("/about.htm");
    });

    test("should navigate Contact button to /contact.htm on a click", async ({ page }) => {
        await page.locator("ul.button > li.contact").first().click();
        expect(page.url()).toContain("/contact.htm");
    });
});