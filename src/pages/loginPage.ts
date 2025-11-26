/**
 * Login Page Object
 * Represents the login page and its interactions.
 * Extends the BasePage class.
 */

import { Page } from '@playwright/test';
import BasePage from './basePage';

/**
 * Page Object for the Login page.
 */
export class LoginPage extends BasePage {
    // Page URL
    private readonly PAGE_URL = '/';

    // Locators
    private readonly selectors = {
        usernameInput: '[data-testid="login-username"]',
        passwordInput: '[data-testid="login-password"]',
        loginButton: '[data-testid="login-button"]',
        errorMessage: '[data-testid="error-message"]',
       // forgotPasswordLink: '[data-testid="forgot-password-link"]',
        registerTab: '[data-testid="tab-register"]',
        loginTab: '[data-testid="tab-login"]',
        pageTitle: 'h1',
        loadingSpinner: '[data-testid="loading-spinner"]',
    };

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the login page.
     */
    public async navigateToLoginPage(): Promise<void> {
        await this.navigateTo(this.PAGE_URL);
        await this.waitForPageLoad();
    }

    /**
     * Check if the login page is loaded correctly.
     */
    public async isPageLoaded(): Promise<boolean> {
        try {
            await this.waitForElementVisible(this.selectors.loginTab, 'tab-login');
            await this.waitForElementVisible(this.selectors.usernameInput, 'Username Input');
            await this.waitForElementVisible(this.selectors.passwordInput, 'Password Input');
            await this.waitForElementVisible(this.selectors.loginButton, 'Login Button');
            return true;
        } catch (error) {
            this.logger.error('Login page is not loaded correctly', error);
            return false;
        }
    }

    /**
     * Enter username in the username field.
     * @param username - The username to enter.
     */
    public async enterUsername(username: string): Promise<void> {
        await this.fillText(this.selectors.usernameInput, username, 'Username Input');
    }

    /**
     * Enter password in the password field.
     * @param password - The password to enter.
     */
    public async enterPassword(password: string): Promise<void> {
        await this.fillText(this.selectors.passwordInput, password, 'Password Input');
    }

    /**
     * Click the login button.
     */
    public async clickLoginButton(): Promise<void> {
        await this.clickElement(this.selectors.loginButton, 'Login Button');
    }
public async clickRegisterTab(): Promise<void> {
        await this.clickElement(this.selectors.registerTab, 'Register Tab');
    }
public async clickLoginTab(): Promise<void> {
        await this.clickElement(this.selectors.loginTab, 'Login Tab');
    }
    /**
     * Perform a complete login action.
     * @param username - The username to use for login.
     * @param password - The password to use for login.
     */
    public async login(username: string, password: string): Promise<void> {
        this.logger.info(`Attempting to login with username: ${username}`);
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    /**
     * Get the error message text.
     */
    public async getErrorMessage(): Promise<string | null> {
        try {
            await this.waitForElementVisible(this.selectors.errorMessage, 'Error Message', 5000);
            return await this.getElementText(this.selectors.errorMessage, 'Error Message');
        } catch (error) {
            this.logger.debug('No error message found');
            return null;
        }
    }

    /**
     * Check if an error message is displayed.
     */
    public async isErrorMessageDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.selectors.errorMessage, 'Error Message');
    }

    /**
     * Assert that an error message is displayed.
     */
    public async assertErrorMessageDisplayed(): Promise<void> {
        await this.assertElementVisible(this.selectors.errorMessage, 'Error Message');
    }

    /**
     * Assert that a specific error message is displayed.
     * @param expectedMessage - The expected error message.
     */
    public async assertErrorMessage(expectedMessage: string): Promise<void> {
        await this.assertElementText(this.selectors.errorMessage, expectedMessage, 'Error Message');
    }

    /**
     * Click the forgot password link.
     */
   /* public async clickForgotPasswordLink(): Promise<void> {
        await this.clickElement(this.selectors.forgotPasswordLink, 'Forgot Password Link');
    }*/

    /**
     * Click the sign up link.
     */
    /**
     * Clear the username field.
     */
    public async clearUsername(): Promise<void> {
        await this.clearAndFillText(this.selectors.usernameInput, '', 'login-username');
    }

    /**
     * Clear the password field.
     */
    public async clearPassword(): Promise<void> {
        await this.clearAndFillText(this.selectors.passwordInput, '', 'login-password');
    }

    /**
     * Clear both username and password fields.
     */
    public async clearLoginForm(): Promise<void> {
        await this.clearUsername();
        await this.clearPassword();
    }

    /**
     * Get the page title.
     */
    public async getLoginPageTitle(): Promise<string | null> {
        return await this.getElementText(this.selectors.pageTitle, 'Page Title');
    }

    /**
     * Check if the login button is enabled.
     */
    public async isLoginButtonEnabled(): Promise<boolean> {
        const locator = this.getLocator(this.selectors.loginButton);
        return await locator.isEnabled();
    }

    /**
     * Wait for login to complete (loading spinner to disappear).
     */
    public async waitForLoginToComplete(): Promise<void> {
        try {
            // Wait for loading spinner to appear (optional)
            await this.waitForElementVisible(this.selectors.loadingSpinner, 'Loading Spinner', 2000);
            // Wait for loading spinner to disappear
            await this.waitForElementHidden(this.selectors.loadingSpinner, 'Loading Spinner', 10000);
        } catch (error) {
            // Loading spinner might not appear for fast responses
            this.logger.debug('Loading spinner not found or disappeared quickly');
        }
    }

    /**
     * Perform login and wait for completion.
     * @param username - The username to use for login.
     * @param password - The password to use for login.
     */
    public async loginAndWait(username: string, password: string): Promise<void> {
        await this.login(username, password);
        await this.waitForLoginToComplete();
    }

    /**
     * Assert that the user is redirected after successful login.
     * @param expectedUrl - The expected URL after login (partial match).
     */
    public async assertSuccessfulLoginRedirect(expectedUrl: string): Promise<void> {
        this.logger.info(`Asserting redirect to: ${expectedUrl}`);
        await this.page.waitForURL(new RegExp(expectedUrl), { timeout: 10000 });
        const currentUrl = await this.getCurrentUrl();
        if (!currentUrl.includes(expectedUrl)) {
            throw new Error(`Expected URL to contain "${expectedUrl}", but got "${currentUrl}"`);
        }
    }

    /**
     * Get the current values in the form fields.
     */
    public async getFormValues(): Promise<{ username: string; password: string }> {
        const usernameLocator = this.getLocator(this.selectors.usernameInput);
        const passwordLocator = this.getLocator(this.selectors.passwordInput);
        
        const username = await usernameLocator.inputValue();
        const password = await passwordLocator.inputValue();
        
        return { username, password };
    }

    async isRegisterTabVisible(): Promise<boolean> {
    return this.page.isVisible('[data-testid="tab-register"]');
  }
async isLoginTabVisible(): Promise<boolean> {
    return this.page.isVisible('[data-testid="tab-login"]');
  }


// src/pages/loginPage.ts (Updated disableNativeValidation method)

    /**
     * Disables native HTML5 form validation for the login form.
     * This is necessary to test application-level validation messages.
     */
    public async disableNativeValidation(): Promise<void> {
        this.logger.info('Disabling native HTML5 form validation.');
        await this.page.evaluate(() => {
            // Target the first form element on the page, which is likely the login form
            const form = document.querySelector('form'); 
            if (form) {
                // Set the novalidate attribute on the form to bypass HTML5 validation
                form.setAttribute('novalidate', 'true');
            }
            
            // As a fallback, remove 'required' attribute from all inputs within the form
            const requiredInputs = document.querySelectorAll('form input[required]');
            requiredInputs.forEach(input => {
                input.removeAttribute('required');
            });
        });
    }

  

    /**
     * Check if the forgot password link is visible.
     
    public async isForgotPasswordLinkVisible(): Promise<boolean> {
        return await this.isElementVisible(this.selectors.forgotPasswordLink, 'Forgot Password Link');
    }*/

    /**
     * Check if the sign up link is visible.
     */
}

export default LoginPage;
