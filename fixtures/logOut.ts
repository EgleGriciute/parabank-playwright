import { test as base, expect } from '@playwright/test';

interface MyFixtures {
    logOut: () => Promise<void>;
}

const logOut = base.extend<MyFixtures>({
    logOut: async ({ page }, use) => {

        const performLogout = async () => {
            await page.goto("/overview.htm");
            await page.click("a[href='logout.htm']");
            await expect(page).toHaveURL(/\/index\.htm/);
        };

        // Provide the function to the test
        await use(performLogout);
    },
});

export { logOut, expect };
