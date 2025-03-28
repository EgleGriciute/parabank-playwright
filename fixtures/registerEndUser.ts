import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import path from 'path';

const registerEndUser = base.extend<{

    userData: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
        ssn: string;
        username: string;
        password: string;
    };

}>({
    userData: async ({ page }, use) => {

        // Generate user data:
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const address = faker.location.streetAddress();
        const city = faker.location.city();
        const state = faker.location.state();
        const zipCode = faker.location.zipCode();
        const phoneNumber = faker.phone.number({ style: 'international' });
        const ssn = faker.number.int(1000000000).toString();
        const username = faker.internet.username();
        const password = faker.internet.password();

        const userData = {
            firstName,
            lastName,
            address,
            city,
            state,
            zipCode,
            phoneNumber,
            ssn,
            username,
            password
        };

        // Create session file data:
        const sessionData = {
            sessionId: 'abc123',
            userData
        };


        // Write JSON data to a file:
        const filePath = path.join(__dirname, '../fixtures/sessionInfo.json');
        fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));

        await page.goto("/parabank/register.htm");

        await page.locator('#customer\\.firstName').fill(userData.firstName);
        await page.locator("#customer\\.lastName").fill(userData.lastName);
        await page.locator("#customer\\.address\\.street").fill(userData.address);
        await page.locator("#customer\\.address\\.city").fill(userData.city);
        await page.locator("#customer\\.address\\.state").fill(userData.state);
        await page.locator("#customer\\.address\\.zipCode").fill(userData.zipCode);
        await page.locator("#customer\\.phoneNumber").fill(userData.phoneNumber);
        await page.locator("#customer\\.ssn").fill(userData.ssn);
        await page.locator("#customer\\.username").fill(userData.username);
        await page.locator("#customer\\.password").fill(userData.password);
        await page.locator("#repeatedPassword").fill(userData.password);

        // Submit form
        await page.click("input[value='Register']");
        await use(userData);

    },
});

// Export the extended test and expect
export { registerEndUser, expect };
