import { test, expect } from '@playwright/test';

test.describe("Admin Page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("parabank/admin.htm");
    });

    test("should return 'Settings saved successfully.' after 'SUBMIT' button click", async ({ page }) => {
        await page.locator("input[value='Submit']").click();
        const successMessage = page.locator("#rightPanel > p");
        expect(successMessage).toBeVisible();
        expect(successMessage).toContainText("Settings saved successfully");
    });

    test("should return a message 'Database Initialized' and change URL link to: ${baseUrl}/db.htm after 'INITIALIZE' button click", async ({ page }) => {
        await page.locator("button[value='INIT']").click();
        expect(page.url()).toContain("db.htm");
    });

    test("should return a message 'Database cleaned' and change URL link to: ${baseUrl}/db.htm after 'CLEAN' button click", async ({ page }) => {
        await page.locator("button[value='CLEAN']").click();
        expect(page.url()).toContain("db.htm");
    });

    // Database/ JMS Service:

    test.describe("JMS Service Tests", () => {

        test.beforeEach(async ({ page }) => {

            const statusRow = page.locator("table.form2 > tbody > tr").nth(1);
            const statusText = await statusRow.textContent();

            if (statusText && statusText.includes("Running")) {
                await page.locator("input[value='Shutdown']").click();
                expect(statusRow).toContainText("Stopped");
            }
        });

        test("should indicate JMS Service Status as set to default: 'Stopped'", async ({ page }) => {
            const statusRow = page.locator("table.form2 > tbody > tr").nth(1);
            expect(statusRow).toContainText("Stopped");
            expect(statusRow).toHaveCount(1);
            expect(statusRow).toBeVisible();
        });

        test("should switch status to: 'Running', and URL will contain 'shutdown.success' after a 'STARTUP' button click", async ({ page }) => {

            await page.locator("input[value='Startup']").click();
            const statusRow = page.locator("table.form2 > tbody > tr").nth(1);
            expect(statusRow).toContainText("Running");
            expect(statusRow).toHaveCount(1);
            expect(statusRow).toBeVisible();

            expect(page.url()).toContain("startup.success");
        });

        test("should switch status to: 'Stopped' after a 'SHUTDOWN' button click", async ({ page }) => {

            const statusRow = page.locator("table.form2 > tbody > tr").nth(1);
            const statusText = await statusRow.textContent();

            if (statusText && !statusText.includes("Running")) {
                await page.locator("input[value='Startup']").click();
                expect(statusRow).toContainText("Running");
            }

            await page.locator("input[value='Shutdown']").click();
            expect(statusRow).toContainText("Stopped");

            expect(page.url()).toContain("shutdown.success");

        });
    });

    // Data Access Mode:

    test.describe("Data Access Mode Tests", () => {

        test("should check input type radio to be checked/set by default as 'JDBC'", async ({ page }) => {
            expect(page.locator("input#accessMode4[value='jdbc']")).toHaveAttribute("checked");
        })


        test("should check if all radio buttons are selectable", async ({ page }) => {

            const radioButtons = [

                { selector: "input#accessMode1", value: 'soap' },
                { selector: "input#accessMode2", value: 'restxml' },
                { selector: "input#accessMode3", value: 'restjson' },
                { selector: "input#accessMode4", value: 'jdbc' }
            ];

            for (const radioButton of radioButtons) {

                await page.locator(`${radioButton.selector}[value='${radioButton.value}']`).click();
                expect(page.locator(`${radioButton.selector}[value='${radioButton.value}']`)).toBeChecked();
            }


        })

    });

    // Web Service:

    test.describe("Web Service Tests", () => {

        test("should link to ${baseUrl}/services/ParaBank?wsdl after 'WSDL' click", async ({ page }) => {

            const baseUrl = "https://parabank.parasoft.com/parabank";
            await page.getByRole('link', { name: 'WSDL' }).first().click();

            const expectedUrlPart = `${baseUrl}/services/ParaBank`;
            const successMessage = await page.url();

            expect(successMessage).toContain(expectedUrlPart);
            expect(successMessage).toContain('jsessionid=');
            expect(successMessage).toContain('wsdl');

        });

        test("should navigate to bank services after 'WADL' click", async ({ page }) => {

            const baseUrl = "https://parabank.parasoft.com/parabank";
            await page.getByRole('link', { name: 'WADL' }).first().click();

            const expectedUrlPart = `${baseUrl}/services/bank`;
            const currentUrl = await page.url();

            expect(currentUrl).toContain(expectedUrlPart);

        });

        test("should link to ${baseUrl}/api-docs/index.html after 'OpenAPI' click", async ({ page }) => {

            const baseUrl = "https://parabank.parasoft.com/parabank";
            await page.getByRole('link', { name: 'OpenAPI' }).first().click();

            const expectedUrlPart = `${baseUrl}/api-docs/index.html`;
            const currentUrl = await page.url();

            expect(currentUrl).toContain(expectedUrlPart);
            expect(currentUrl).toContain('jsessionid=');

        })

        test("should link to ${baseUrl}/services/LoanProcessor?wsdl after 'LoadProcessor Service WSDL' clic", async ({ page }) => {
            const baseUrl = "https://parabank.parasoft.com/parabank";
            await page.locator("tbody > tr > td a[href*='LoanProcessor']").filter({ hasText: 'WSDL' }).click();

            const currentUrl = await page.url();

            expect(currentUrl).toContain(`${baseUrl}/services/LoanProcessor`);
            expect(currentUrl).toContain('wsdl');
            expect(currentUrl).toContain('jsessionid=');
        });

    });

    // Application Settings:

    test.describe("Application Settings Tests", () => {

        test("should show error text messages if 'Application Settings' fields are not filled in", async ({ page }) => {

            await page.locator("#initialBalance").clear();
            await page.locator("#minimumBalance").clear();
            await page.locator("#loanProcessorThreshold").clear();

            await page.locator("input[value='Submit']").click();

            const applicationSettingErrors = [

                { selector: "initialBalance", error: "Initial balance is required." },
                { selector: "minimumBalance", error: "Minimum balance is required." },
                { selector: "loanProcessorThreshold", error: "Threshold is required." }

            ];

            for (const settingError of applicationSettingErrors) {

                const errorMessage = await page.locator(`span#${settingError.selector}\\.errors`);

                expect(errorMessage).toHaveCount(1);
                expect(errorMessage).toBeVisible;
                expect(errorMessage).toContainText(settingError.error);

            }

        });

        test("should validate 'Init. Balance: $' and reject non-numeric values", async ({ page }) => {

            const invalidInputs = ["abc", "test123", "12.34.56", "🧩"];

            for (const input of invalidInputs) {

                await page.locator("#initialBalance").clear();
                await page.locator("#initialBalance").fill(input);

                await page.locator("#minimumBalance").clear();
                await page.locator("#minimumBalance").fill(input);

                await page.locator("#loanProcessorThreshold").clear();
                await page.locator("#loanProcessorThreshold").fill(input);

                // Submit the form:
                await page.locator("input[value='Submit']").click();

                const expectedErrors = [

                    { selector: "initialBalance", error: "Please enter a valid amount." },
                    { selector: "minimumBalance", error: "Please enter a valid amount." },
                    { selector: "loanProcessorThreshold", error: "Please enter a valid number." }

                ];

                for (const settingError of expectedErrors) {

                    const errorMessage = await page.locator(`span#${settingError.selector}\\.errors`);

                    expect(errorMessage).toHaveCount(1);
                    expect(errorMessage).toBeVisible;
                    expect(errorMessage).toContainText(settingError.error)
                }
            }
        });

        test("should be set to 'Web Service' by default of 'Loan Provider'", async ({ page }) => {

            const optionElement = page.locator("select#loanProvider > option[value='ws']");

            expect(optionElement).toHaveText("Web Service");
            expect(optionElement).toHaveAttribute("selected");

        });

        test("should have a select element of'Loan Provider' and contain option values of: 'JMS', 'Web Service', 'Local'", async ({ page }) => {

            const loanProvider = page.locator("#loanProvider");

            const childrenCount = await loanProvider.locator("option").count();
            expect(childrenCount).toBeGreaterThan(0);

            const optionValues = [

                { option: "jms", text: "JMS" },
                { option: "ws", text: "Web Service" },
                { option: "local", text: "Local" }

            ];

            for (const optionValue of optionValues) {

                const option = page.locator(`#loanProvider option[value="${optionValue.option}"]`);
                expect(option).toContainText(`${optionValue.text}`);

            }

        });

        test("should be set to 'Available Funds' by default of 'Loan Processor'", async ({ page }) => {

            expect(page.locator("#loanProcessor option[value='funds']")).toHaveAttribute("selected");

        });

        test("should have a select element of'Loan Processor' and contain option values of: 'Available Funds', 'Down Payment', 'Combined'", async ({ page }) => {

            const loanProcessorChildren = page.locator("#loanProcessor");
            const childrenCount = await loanProcessorChildren.locator("option").count();

            expect(childrenCount).toBeGreaterThan(0);

            const optionValues = [

                { option: "funds", text: "Available Funds" },
                { option: "down", text: "Down Payment" },
                { option: "combined", text: "Combined" }
            ];

            for (const loanProcessorOption of optionValues) {
                expect(page.locator(`#loanProcessor option[value="${loanProcessorOption.option}"]`)).toContainText(`${loanProcessorOption.text}`)
            }

        });

        test("should not exceed 10 digit value of: 2 147 483 647 % threshold input", async ({ page }) => {

            const loanProcessorThreshold = page.locator("input#loanProcessorThreshold");

            await loanProcessorThreshold.clear();
            await loanProcessorThreshold.fill("2147483647");

            page.locator("input[value='Submit']").click();

            expect(page.locator("#rightPanel p > b")).toContainText("Settings saved successfully.");

        });

        test("should return 'Please enter a valid number.' after increasing 2147483647 % threshold value", async ({ page }) => {

            const loanProcessorThreshold = page.locator("input#loanProcessorThreshold");

            await loanProcessorThreshold.clear();
            await loanProcessorThreshold.fill("2147483647.1");

            page.locator("input[value='Submit']").click();

            expect(page.locator("span#loanProcessorThreshold\\.errors")).toContainText("Please enter a valid number.");

        });

    });
});
