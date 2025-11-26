# TypeScript Test Automation Framework

A modern, reusable, and maintainable test automation framework built with TypeScript, Cucumber.js, Playwright, and Allure reporting. This framework follows the Page Object Model (POM) and Service-Oriented Architecture (SOA) patterns to ensure scalability and maintainability.

## 🚀 Features

- **TypeScript**: Full TypeScript support for type safety and better IDE experience
- **BDD with Cucumber.js**: Behavior-Driven Development using Gherkin syntax
- **Playwright**: Cross-browser automation (Chromium, Firefox, WebKit)
- **Allure Reporting**: Rich test reports with screenshots, logs, and metrics
- **Page Object Model**: Maintainable and reusable page objects
- **Service-Oriented Architecture**: Modular and scalable framework design
- **Multi-Environment Support**: Easy configuration for different environments
- **Parallel Execution**: Run tests in parallel for faster execution
- **CI/CD Ready**: GitHub Actions and other CI/CD pipeline support

## 📁 Project Structure

```
ts-test-framework/
├── src/
│   ├── config/
│   │   └── config.ts              # Environment configuration
│   ├── features/
│   │   ├── login.feature          # Login BDD scenarios
│   │   └── todos.feature          # Todo management BDD scenarios
│   ├── pages/
│   │   ├── basePage.ts            # Base page class with common methods
│   │   ├── loginPage.ts           # Login page object
│   │   ├── todoPage.ts            # Todo page object
│   │   └── index.ts               # Page objects exports
│   ├── steps/
│   │   ├── loginSteps.ts          # Login step definitions
│   │   ├── todoSteps.ts           # Todo step definitions
│   │   └── index.ts               # Step definitions exports
│   ├── support/
│   │   ├── world.ts               # Cucumber World context
│   │   └── hooks.ts               # Before/After hooks
│   └── utils/
│       ├── logger.ts              # Logging utility
│       └── browserManager.ts     # Browser management utility
├── allure-results/                # Allure test results
├── allure-report/                 # Generated Allure reports
├── cucumber.js                    # Cucumber configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
├── .env.example                   # Environment variables example
└── README.md                      # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js (version 18 or higher)
- PNPM (recommended) or npm

### Setup

1. **Clone or download the framework**
   ```bash
   git clone <repository-url>
   cd ts-test-framework
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   pnpx playwright install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

## 🎯 Quick Start

### Running Tests

```bash
# Run all tests
pnpm test

# Run smoke tests only
pnpm run test:smoke

# Run authentication tests
pnpm run test:login

# Run todo management tests
pnpm run test:todos

# Run tests in headless mode
pnpm run test:headless

# Run tests in headed mode (visible browser)
pnpm run test:headed

# Run tests in parallel
pnpm run test:parallel
```

### Browser-Specific Tests

```bash
# Run tests in Chrome/Chromium
pnpm run test:chrome

# Run tests in Firefox
pnpm run test:firefox

# Run tests in Safari/WebKit
pnpm run test:webkit
```

### Allure Reports

```bash
# Generate Allure report
pnpm run allure:generate

# Open generated report
pnpm run allure:open

# Generate and serve report in one command
pnpm run allure:serve
```

## 📝 Writing Tests

### 1. Feature Files

Create feature files in `src/features/` using Gherkin syntax:

```gherkin
Feature: User Authentication
  As a user
  I want to be able to login to the application
  So that I can access my personal dashboard

  @smoke @authentication
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "admin" and password "password"
    And I click the login button
    Then I should be redirected to the todos page
```

### 2. Page Objects

Create page objects in `src/pages/` extending the `BasePage` class:

```typescript
import { Page } from '@playwright/test';
import BasePage from './basePage';

export class LoginPage extends BasePage {
    private readonly selectors = {
        usernameInput: '[data-testid="username-input"]',
        passwordInput: '[data-testid="password-input"]',
        loginButton: '[data-testid="login-button"]',
    };

    constructor(page: Page) {
        super(page);
    }

    public async login(username: string, password: string): Promise<void> {
        await this.fillText(this.selectors.usernameInput, username);
        await this.fillText(this.selectors.passwordInput, password);
        await this.clickElement(this.selectors.loginButton);
    }
}
```

### 3. Step Definitions

Create step definitions in `src/steps/` using the page objects:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages';

Given('I am on the login page', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigateToLoginPage();
});

When('I enter username {string} and password {string}', 
    async function (this: ICustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
});
```

## 🏷️ Allure Tags and Labels

The framework supports Allure labels and links through Cucumber tags:

### Epic and Feature Tags
```gherkin
@epic:UserManagement
@severity:critical
Feature: User Authentication
```

### Issue and Test Management Links
```gherkin
@issue:AUTH-123
@tms:TC-456
Scenario: Login with invalid credentials
```

### Custom Categories

The framework automatically categorizes failures:
- **Product Bug**: Expected vs actual value mismatches
- **Test Infrastructure Issue**: Timeouts, network issues, browser problems

## ⚙️ Configuration

### Environment Variables

Configure the framework using environment variables or the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Test environment | `local` |
| `BROWSER` | Browser to use | `chromium` |
| `HEADLESS` | Run in headless mode | `true` |
| `BASE_URL` | Application base URL | `http://localhost:5173` |
| `TIMEOUT` | Default timeout (ms) | `30000` |
| `ALLURE_RESULTS_DIR` | Allure results directory | `allure-results` |

### Cucumber Configuration

Modify `cucumber.js` to customize:
- Feature file locations
- Step definition paths
- Allure reporter options
- Tag expressions
- Parallel execution settings

## 🔧 Customization

### Adding New Page Objects

1. Create a new page class in `src/pages/`
2. Extend the `BasePage` class
3. Define selectors and methods
4. Export from `src/pages/index.ts`

### Adding New Step Definitions

1. Create a new step file in `src/steps/`
2. Import required dependencies
3. Implement step definitions using page objects
4. Import in `src/steps/index.ts`

### Adding New Features

1. Create feature files in `src/features/`
2. Use appropriate tags for categorization
3. Follow Gherkin best practices

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Automation

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-results
          path: allure-results/
```

## 📊 Best Practices

### Page Objects
- Use data-testid attributes for reliable element selection
- Keep page objects focused on a single page or component
- Use meaningful method names that describe user actions
- Implement proper waiting strategies

### Step Definitions
- Keep steps simple and focused
- Use the World context for sharing data between steps
- Implement proper error handling and logging
- Use descriptive step names

### Feature Files
- Write scenarios from the user's perspective
- Use appropriate tags for test organization
- Keep scenarios independent and atomic
- Use Background for common setup steps

## 🐛 Troubleshooting

### Common Issues

1. **Browser not found**: Run `npx playwright install`
2. **TypeScript errors**: Check `tsconfig.json` configuration
3. **Step definitions not found**: Verify imports in `src/steps/index.ts`
4. **Allure report not generated**: Check `allure-results` directory exists

### Debug Mode

Run tests with debug information:
```bash
DEBUG=pw:api npm test
```

## 📚 Resources

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---


Data-Driven Testing (DDT) Implementation Guide: Multi-Sheet Excel

This guide details the implementation of a robust Data-Driven Testing (DDT) layer within the TypeScript framework, allowing test data to be managed centrally in a multi-sheet Excel file. This approach adheres to the best practice of separating test logic from test data, significantly improving maintainability and test coverage.

1. Affected Files and Dependencies

To implement multi-sheet Excel reading, the following files and dependencies were created or modified:

File/Dependency
Status
Purpose
xlsx
New Dependency
Core library for reading and parsing Excel files (.xlsx).
@types/xlsx
New Dependency
TypeScript definitions for the xlsx library.
src/utils/dataService.ts
New File
Contains the logic to load and cache data from all sheets in the Excel file.
src/support/hooks.ts
Modified
Added a BeforeAll hook to ensure the Excel data is loaded once before any test runs.
src/steps/loginSteps.ts
Modified
Updated to use the dataService to retrieve credentials and expected results based on a test_case_id.
src/features/login.feature
Modified
Updated the Gherkin scenario to use a Scenario Outline driven by the test_case_id from the Excel file.
test_data.xlsx
New File
The central Excel file containing sheets like 'Login' and 'Todo'.


2. Implementation Details

2.1. The Data Service (src/utils/dataService.ts)

This new utility is the core of the DDT layer. It uses the xlsx library to read the entire Excel workbook and cache the data from each sheet under its respective sheet name.

Key Features of dataService.ts:

•
loadData(filePath): Reads the Excel file, iterates through all sheets, converts each sheet to a JSON array, and stores it in an internal cache.

•
getData(sheetName): Retrieves all data rows for a given sheet name.

•
getSingleData(sheetName, key, value): Retrieves a single data row by matching a key (e.g., test_case_id) with a specific value.

TypeScript


// src/utils/dataService.ts (Code Snippet)
import * as XLSX from 'xlsx';
// ... other imports

class DataService {
    private cache: DataCache = {};
    // ... constructor and logger

    public loadData(filePath: string = EXCEL_FILE_PATH): void {
        // ... error handling and path resolution
        const workbook = XLSX.readFile(filePath);
        
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            this.cache[sheetName] = data;
            this.logger.info(`Successfully loaded ${data.length} rows from sheet: ${sheetName}`);
        });
    }

    public getSingleData(sheetName: string, key: string, value: any): any | undefined {
        const data = this.getData(sheetName);
        return data.find(row => row[key] === value);
    }
}

export const dataService = new DataService();


2.2. Data Loading Hook (src/support/hooks.ts)

To ensure the data is loaded only once before the entire test suite begins, the dataService.loadData() call is placed within the BeforeAll hook.

TypeScript


// src/support/hooks.ts (Code Snippet)
import { BeforeAll } from '@cucumber/cucumber';
import { dataService } from '../utils/dataService'; 
// ... other imports

// Define the path to the Excel file
const EXCEL_FILE_NAME = 'test_data.xlsx';
const EXCEL_FILE_PATH = path.join(process.cwd(), EXCEL_FILE_NAME);

BeforeAll(async function () {
    // ... logger initialization
    try {
        dataService.loadData(EXCEL_FILE_PATH);
    } catch (error) {
        // Handle fatal error if data loading fails
    }
    // ...
});


2.3. Updated Step Definitions (src/steps/loginSteps.ts)

The login step definitions are refactored to retrieve the data from the service instead of relying on hardcoded values or Gherkin tables.

New Step: When I login with data from test case ID {string}

This step encapsulates the data retrieval and the action:

TypeScript


// src/steps/loginSteps.ts (Code Snippet)
import { dataService } from '../utils/dataService'; 
// ... other imports

When('I login with data from test case ID {string}', async function (this: ICustomWorld, testCaseId: string) {
    // 1. Get data from the 'Login' sheet
    const loginData = dataService.getSingleData('Login', 'test_case_id', testCaseId);
    
    if (!loginData) {
        throw new Error(`Test data not found for test case ID: ${testCaseId} in 'Login' sheet.`);
    }
    
    const username = loginData.username || '';
    const password = loginData.password || '';
    
    // Store expected result for later assertion
    this.testData.expectedResult = loginData.expected_result;
    
    const loginPage = new LoginPage(this.page);
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
});


New Step: Then the login result should match the expected outcome

This step uses the stored expectedResult to perform the correct assertion (Success or Error), making the assertion logic data-driven as well.

TypeScript


// src/steps/loginSteps.ts (Code Snippet)
Then('the login result should match the expected outcome', async function (this: ICustomWorld) {
    const expectedResult = this.testData.expectedResult;
    
    if (expectedResult.startsWith('Success')) {
        // Expected Success: Check for redirection to /todos
        // ... assertion logic
    } else if (expectedResult.startsWith('Error:')) {
        // Expected Error: Check for error message and remaining on login page
        // ... assertion logic
    }
});


2.4. Updated Feature File (src/features/login.feature)

The feature file now uses a Scenario Outline to iterate over the test_case_id column, which is the only data point needed in the Gherkin file.

Plain Text


# src/features/login.feature (Code Snippet)
Scenario Outline: Data-Driven Login Test
  When I login with data from test case ID "<test_case_id>"
  And I click the login button
  Then the login result should match the expected outcome
  
  Examples:
    | test_case_id |
    | TC-LOGIN-001 | # Valid Login
    | TC-LOGIN-002 | # Invalid Password
    | TC-LOGIN-003 | # Invalid Username
    | TC-LOGIN-004 | # Empty Credentials
    | TC-LOGIN-005 | # Locked Account
    | TC-LOGIN-006 | # Admin Login
    | TC-LOGIN-007 | # Guest Login


3. Next Steps for the User

To fully utilize this DDT implementation, you must perform the following:

1.
Create the Excel File: Create a file named test_data.xlsx in the root of your framework directory (ts-test-framework/).

2.
Populate the Sheets:

•
Sheet 1 (Login): Must contain the columns: test_case_id, scenario, username, password, expected_result, expected_status_code.

•
Sheet 2 (Todo): Must contain the columns: test_case_id, scenario, title, description, priority, expected_result (for future Todo DDT).



3.
Run Tests: Execute your tests using npm test. The framework will automatically load the data and execute the login scenarios based on the test_case_id values provided in the Gherkin file.

This new DDT layer provides a powerful, centralized, and highly maintainable way to manage your test data for all future features.



**Happy Testing! 🎉**
