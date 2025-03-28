# ParaBank Website Testing Portfolio with Playwright 💰

## Overview
<<<<<<< HEAD
This repository contains a comprehensive test automation framework for the ParaBank (https://parabank.parasoft.com/parabank/index.htm) demonstration website using Playwright. The framework includes end-to-end tests, API tests, and various testing approaches to ensure thorough coverage of the ParaBank web application.
=======
This repository contains a comprehensive test automation framework for the ParaBank (https://parabank.parasoft.com/parabank/index.htm) demonstration website using Playwright. The framework includes end-to-end tests and various testing approaches to ensure thorough coverage of the ParaBank web application.
>>>>>>> c06cf1814b8557940042f83ea459ecef3556a290

## Features
- End-to-end testing using Playwright
- Faker.js integration for dynamic test data generation
- Parallel test execution
<<<<<<< HEAD
- API testing
=======
>>>>>>> c06cf1814b8557940042f83ea459ecef3556a290
- Visual testing capabilities
- Cross-browser testing support (Chromium, Firefox, WebKit)
- GitHub Actions CI/CD pipeline

## Installation

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/EgleGriciute/parabank_website_full_testing_portfolio-playwright.git
   cd parabank_website_full_testing_portfolio-playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

### Run Tests with UI Mode
For interactive testing with Playwright UI:
```bash
npm run test:ui
```

### Run All Tests Headlessly
Run all tests in headless mode:
```bash
npm run headless
```

### Generate Tests
Use Playwright's codegen to generate tests:
```bash
npm run codegen
```

### Run Parallel Tests
Execute spec tests in parallel:
```bash
npm run parallel:test
```

## Test Data
The framework uses @faker-js/faker for generating dynamic test data. This approach ensures tests are not reliant on static data and can be executed multiple times without data conflicts.

## CI/CD Integration
This project is integrated with GitHub Actions for continuous integration (dev branch). The workflow is defined in `.github/workflows/playwright.yml` and runs tests automatically on push and pull requests.

## Reports
After test execution, Playwright generates HTML reports that provide detailed information about test runs, including test status, duration, and screenshots/videos for failed tests. These reports are available in the `playwright-report` directory.
