import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Path to the directory with test files
  testMatch: ['**/*.test.ts', '**/Register*.ts'], // Test file patterns
  fullyParallel: true, // Run tests in files in parallel

  // Fail the build if test.only is left in source code (especially useful in CI)
  forbidOnly: !!process.env.CI,

  // Retry tests on CI
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI to 1 (to avoid overloading CI environment), but use 4 locally
  workers: process.env.CI ? 1 : 4,

  // Reporter to use. Here you are generating an HTML report
  reporter: 'html',

  // Shared settings for all the projects
  use: {
    baseURL: 'https://parabank.parasoft.com/parabank', // Base URL for your tests
    trace: 'on-first-retry', // Collect trace data if the test fails and retries
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium', // Project for Chromium browser
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox', // Project for Firefox browser
      use: { browserName: 'firefox' },
    },
  ],

  // Uncomment this to run a local dev server before starting tests (if needed)
  // webServer: {
  //   command: 'npm run start', // Command to start the server
  //   url: 'http://127.0.0.1:3000', // URL to access the server
  //   reuseExistingServer: !process.env.CI, // Reuse server if not in CI
  // },
});
