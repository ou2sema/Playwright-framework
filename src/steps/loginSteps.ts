/**
 * Login Step Definitions
 * Implements the step definitions for login-related scenarios.
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages';

// Step definitions for login scenarios

Given('I am on the login page', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigateToLoginPage();
    await loginPage.isPageLoaded();
    this.logger.info('User is on the login page');
});

When('I enter username {string} and password {string}', async function (this: ICustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    this.logger.info(`Entered credentials: username="${username}", password="${password.replace(/./g, '*')}"`);
});

When('I click the login button', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.clickLoginButton();
    await loginPage.waitForLoginToComplete();
    this.logger.info('Clicked login button and waited for completion');
});

Then('I should see the todos page header', { timeout: 15_000 }, async function (this: ICustomWorld) {
  const todosHeader = this.page.locator('[data-testid="todos-header"]');
  await expect(todosHeader).toHaveText('My Tasks');
  this.logger.info('Verified todos page header: My Tasks');
});

Then('I should see the page title {string}', async function (this: ICustomWorld, expectedTitle: string) {
    const pageTitle = await this.page.title();
    expect(pageTitle).toContain(expectedTitle);
    this.logger.info(`Verified page title contains: ${expectedTitle}`);
});

Then('I should see an error message {string}', async function (this: ICustomWorld, expectedMessage: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertErrorMessageDisplayed();
    const actualMessage = await loginPage.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
    this.logger.info(`Verified error message: ${expectedMessage}`);
});

Then('I should remain on the login page', async function (this: ICustomWorld) {
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain('/login');
    
    const loginPage = new LoginPage(this.page);
    const isLoaded = await loginPage.isPageLoaded();
    expect(isLoaded).toBe(true);
    this.logger.info('Verified user remains on login page');
});

Then('I should see the username input field', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertElementVisible('[data-testid="login-username"]', 'Login Username');
    this.logger.info('Verified username input field is visible');
});

Then('I should see the password input field', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertElementVisible('[data-testid="login-password"]', 'Login Password');
    this.logger.info('Verified password input field is visible');
});

Then('I should see the login button', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertElementVisible('[data-testid="login-button"]', 'Login Button');
    this.logger.info('Verified login button is visible');
});

Then('I should see the {string} tab', async function (this: ICustomWorld, tabName: string) {
    const selector = tabName === 'Registertest' 
        ? '[data-testid="tab-registertest"]' 
        : '[data-testid="tab-logintest"]';
    
    const loginPage = new LoginPage(this.page);
    await loginPage.assertElementVisible(selector, tabName);
    this.logger.info(`Verified ${tabName} tab is visible`);
});

When('I click the {string} tab', async function (this: ICustomWorld, tabName: string) {
    const selector = tabName === 'Register' 
        ? '[data-testid="tab-register"]' 
        : '[data-testid="tab-login"]';

    const loginPage = new LoginPage(this.page);
    await loginPage.clickRegisterTab();
    this.logger.info(`Clicked ${tabName} tab`);
});



Then('I should see the registration tab', async function (this: ICustomWorld) {
    const loginPage = new LoginPage(this.page);
    const isVisible = await loginPage.isRegisterTabVisible();
    expect(isVisible).toBe(true);
    this.logger.info('Verified the registration tab is visible');
});



When('I enter password {string}', async function (this: ICustomWorld, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.enterPassword(password);
    this.logger.info(`Entered password: ${password.replace(/./g, '*')}`);
});

Then('the password field should mask the input', { timeout: 10_000 },  async function (this: ICustomWorld) {
    const passwordInput = this.page.locator('[data-testid="login-password"]');
    const inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
    this.logger.info('Verified password field masks input');
});

Then('the password should not be visible in plain text',  { timeout: 10_000 },async function (this: ICustomWorld) {
    const passwordInput = this.page.locator('[data-testid="login-password"]');
    const inputValue = await passwordInput.inputValue();
    const displayValue = await passwordInput.textContent();
    
    // The input value should exist but not be visible as plain text
    expect(inputValue).toBeTruthy();
    expect(displayValue).not.toContain(inputValue);
    this.logger.info('Verified password is not visible in plain text');
});

// Common step for logging in (used in other feature files)
Given('I am logged in as {string} with password {string}', async function (this: ICustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigateToLoginPage();
    await loginPage.isPageLoaded();
    await loginPage.loginAndWait(username, password);
    
    // Verify successful login by checking URL
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain('/todos');
    
    this.logger.info(`Successfully logged in as: ${username}`);
    
    // Store login state in test data
    this.testData.currentUser = { username, password };
});
