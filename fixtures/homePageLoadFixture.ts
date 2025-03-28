import { test, Response } from "@playwright/test";

export const homePageFixture = test.extend<{

    consoleErrors: string[];
    response: Response | null;

}>({

    consoleErrors: async ({ page }, use) => {

        const consoleErrors: string[] = [];

        page.on("console", message => {
            if (message.type() === "error") {
                consoleErrors.push(message.text());
            }
        });

        await use(consoleErrors);
    },

    response: async ({ page }, use) => {

        const response = await page.goto('parabank/index.htm');
        await use(response);
    }
});



