import { test as base } from '@playwright/test';

// Define the type for your custom fixtures
type CustomFixtures = {
    todaysDate: string;
};

// Extend the base test with your custom fixtures and give it a specific name
export const testWithDate = base.extend<CustomFixtures>({
    todaysDate: async ({ }, use) => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        await use(`${month}/${day}/${year}`);
    }
});