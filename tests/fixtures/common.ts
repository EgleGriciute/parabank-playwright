import { Page, expect } from '@playwright/test';

import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import path from 'path';

export async function loadHomePageSuccessfully(page: Page) {

    const consoleErrors: string[] = [];

    page.on("console", message => {
        if (message.type() === "error") {
            consoleErrors.push(message.text());
        }
    });

    const response = await page.goto('parabank/index.htm');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("ParaBank | Welcome | Online Banking");
    expect(consoleErrors.length).toBe(0);

    return { consoleErrors, response };
}


export async function registerEndUser(page: Page) {
    await page.goto("/parabank/register.htm");

    // Generate user data
    const userData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        phoneNumber: faker.phone.number({ style: 'international' }),
        ssn: faker.number.int(1000000000).toString(),
        username: faker.internet.username(),
        password: faker.internet.password(),
    };

    // Save session data
    const sessionData = {
        sessionId: 'abc123',
        userData
    };
    const filePath = path.join(__dirname, '../fixtures/sessionInfo.json');
    fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));

    // Fill registration form
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
    await page.locator("input[value='Register']").click();

    // Wait for navigation after submission
    await page.waitForURL("**/register.htm", { waitUntil: "load" });

    return userData;
}

export async function logOut(page: Page) {
    await page.goto("parabank/overview.htm");
    await page.click("a[href='logout.htm']");
    await expect(page).toHaveURL(/\/index\.htm/);
}

export async function loginEndUser(page: Page) {

    const sessionFilePath = path.resolve(__dirname, 'sessionInfo.json');
    const fileContent = fs.readFileSync(sessionFilePath, 'utf-8').trim();

    let sessionData;
    sessionData = JSON.parse(fileContent);

    const { username, password } = sessionData.userData;

    // Perform login actions
    await page.goto("/");

    await page.fill("input[name='username']", username);
    await page.fill("input[name='password']", password);
    await page.click("input[value='Log In']");

    return { username, password };
}

export async function openNewAccount(page: Page, accountType: string) {
    await page.goto("/parabank/openaccount.htm");

    // Load credentials from fixture
    const sessionFilePath = path.resolve(__dirname, 'sessionInfo.json');
    const fileContent = fs.readFileSync(sessionFilePath, 'utf-8').trim();
    let sessionData;
    sessionData = JSON.parse(fileContent);

    // Open account form validation
    await expect(page.locator("#openAccountForm h1.title")).toContainText("Open New Account");

    // Select account type
    await page.selectOption("#type", accountType);

    // Select the first available account
    const firstOptionText = await page.locator("#fromAccountId option").first().textContent();
    await page.selectOption("#fromAccountId", firstOptionText);

    // Click "Open New Account"
    await page.click("input[value='Open New Account']");
    await page.click("a#newAccountId");
}

export function getTodaysDateMonth(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return month;
}

export function getTodaysDateDashFormat(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}-${day}-${year}`;
}

export function getTodaysDateSlashFormat(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
}

export async function transferToAccount(page: Page) {
    await page.goto("parabank/transfer.htm");

    const amountInput = page.locator("input#amount");
    await amountInput.waitFor({ state: 'visible' });
    await amountInput.fill("100");

    const fromAccountSelect = page.locator("select#fromAccountId");
    await fromAccountSelect.waitFor({ state: 'visible' });
    await fromAccountSelect.selectOption({ index: 0 });

    const toAccountSelect = page.locator("select#toAccountId");
    await toAccountSelect.waitFor({ state: 'visible' });
    await toAccountSelect.selectOption({ index: 1 });

    // Verify selected accounts are different
    const fromAccountId = await fromAccountSelect.inputValue();
    const toAccountId = await toAccountSelect.inputValue();
    expect(fromAccountId).not.toEqual(toAccountId);

    await page.locator("input[value='Transfer']").click();

    // await expect(page.locator("text='Transfer Complete'")).toBeVisible();

    await page.goto("parabank/overview.htm");
}

