import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

const loginEndUser = base.extend<{
    userData: {
        username: string;
        password: string;
    };
}>({
    userData: async ({ page }, use) => {

        await page.goto("/");

        const sessionFilePath = path.resolve(__dirname, 'sessionInfo.json');
        const fileContent = fs.readFileSync(sessionFilePath, 'utf-8').trim();

        let sessionData;
        sessionData = JSON.parse(fileContent);

        const { username, password } = sessionData.userData;

        await use({ username, password });
    }
});

export { loginEndUser, expect };
