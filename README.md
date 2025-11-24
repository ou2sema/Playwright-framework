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

**Happy Testing! 🎉**
