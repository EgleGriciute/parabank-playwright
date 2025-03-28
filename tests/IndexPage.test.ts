import { test, expect } from '@playwright/test';
import { getTodaysDateSlashFormat } from './fixtures/common';

test.describe("Index Page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should navigate to the correct WSDL URL after clicking on 'ATM Services' list items", async ({ page }) => {

        const services = ["Withdraw Funds", "Transfer Funds", "Check Balances", "Make Deposits"];

        for (const service of services) {

            const serviceLocator = page.locator(`text=${service}`).first();
            await serviceLocator.click();

            const baseUrl = 'https://parabank.parasoft.com/parabank';
            const expectedUrl = `${baseUrl}/services/ParaBank?wsdl`;

            // Assert that the current page URL matches the expected URL:
            expect(page.url()).toContain(expectedUrl);
            await page.goto("/");
        }
    });

    test("should navigate to ${baseUrl}/services/bank?_wadl&_type=xml after clicking on 'Online Services' list items", async ({ page }) => {

        const services = ["Bill Pay", "Account History", "Transfer Funds"];

        for (const service of services) {

            await page.locator('ul.servicestwo > li > a').filter({ hasText: service }).click();

            const baseUrl = 'https://parabank.parasoft.com/parabank';
            const expectedUrl = `${baseUrl}/services/bank?_wadl&_type=xml`;

            // Assert that the current page URL matches the expected URL:
            expect(page.url()).toContain(expectedUrl);
            await page.goto("/");
        }
    });

    test("should navigate to ${baseUrl}/services.htm after 'READ MORE' click", async ({ page }) => {

        await page.locator("p.more a[href='services.htm']").click();
        expect(page.url()).toContain("services.htm");

    })

    test("should show the correct caption date", async ({ page }) => {

        const testing = getTodaysDateSlashFormat();
        expect(page.locator("ul.events li.captionthree")).toContainText(testing);

    });


    test("should navigate to ${baseUrl}/news.htm#${number} after clicking on 'Latest News' list items", async ({ page }) => {

        const newsListItems = [

            { title: "ParaBank Is Now Re-Opened", id: 6 },
            { title: "New! Online Bill Pay", id: 5 },
            { title: "New! Online Account Transfers", id: 4 }

        ];

        for (const { title, id } of newsListItems) {

            const baseUrl = 'https://parabank.parasoft.com/parabank';
            await page.goto(baseUrl);

            const expectedUrl = `${baseUrl}/news.htm#${id}`;

            // First find the element that contains the text, then click it:
            await page.locator("ul.events").getByText(title).click();

            // Verify the URL:
            expect(page).toHaveURL(expectedUrl);
        }
    });

    test("should launch ${baseUrl}/news.htm after 'RED MORE' click", async ({ page }) => {
        await page.locator("p.more a[href='news.htm']").click();
        expect(page.url()).toContain("news.htm");
    });

});


