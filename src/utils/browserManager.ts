/**
 * Browser Manager Utility
 * Provides utility functions for common Playwright operations,
 * abstracting them from the step definitions.
 */

import { Page, Locator, expect } from '@playwright/test';
import Logger from './logger';
import { ICustomWorld } from '../support/world';

/**
 * Helper class to manage common browser interactions.
 */
export class BrowserManager {
    private page: Page;
    private logger: typeof Logger;

    constructor(world: ICustomWorld) {
        this.page = world.page;
        this.logger = world.logger;
    }

    /**
     * Navigates to a specific URL.
     * @param url - The URL to navigate to.
     */
    public async navigateTo(url: string): Promise<void> {
        this.logger.info(`Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Clicks an element identified by a selector.
     * @param selector - The CSS selector of the element.
     * @param name - A friendly name for logging.
     */
    public async clickElement(selector: string, name: string): Promise<void> {
        this.logger.info(`Clicking element: ${name} (${selector})`);
        const locator = this.page.locator(selector);
        await locator.click();
    }

    /**
     * Fills a text input field.
     * @param selector - The CSS selector of the input field.
     * @param value - The text value to fill.
     * @param name - A friendly name for logging.
     */
    public async fillText(selector: string, value: string, name: string): Promise<void> {
        this.logger.info(`Filling input: ${name} with value: "${value}" (${selector})`);
        const locator = this.page.locator(selector);
        await locator.fill(value);
    }

    /**
     * Waits for an element to be visible.
     * @param selector - The CSS selector of the element.
     * @param name - A friendly name for logging.
     */
    public async waitForElementVisible(selector: string, name: string): Promise<void> {
        this.logger.info(`Waiting for element to be visible: ${name} (${selector})`);
        const locator = this.page.locator(selector);
        await expect(locator).toBeVisible();
    }

    /**
     * Asserts that the current page URL matches the expected URL.
     * @param expectedUrl - The expected URL (can be partial).
     */
    public async assertUrl(expectedUrl: string): Promise<void> {
        this.logger.info(`Asserting URL contains: ${expectedUrl}`);
        await expect(this.page).toHaveURL(new RegExp(expectedUrl));
    }

    /**
     * Asserts that an element contains the expected text.
     * @param selector - The CSS selector of the element.
     * @param expectedText - The text expected to be in the element.
     * @param name - A friendly name for logging.
     */
    public async assertElementText(selector: string, expectedText: string, name: string): Promise<void> {
        this.logger.info(`Asserting element ${name} text is: "${expectedText}" (${selector})`);
        const locator = this.page.locator(selector);
        await expect(locator).toHaveText(expectedText);
    }

    /**
     * Asserts that an element is present in the DOM.
     * @param selector - The CSS selector of the element.
     * @param name - A friendly name for logging.
     */
    public async assertElementPresent(selector: string, name: string): Promise<void> {
        this.logger.info(`Asserting element ${name} is present: (${selector})`);
        const locator = this.page.locator(selector);
        await expect(locator).toBeAttached();
    }

    /**
     * Asserts that an element is NOT present in the DOM.
     * @param selector - The CSS selector of the element.
     * @param name - A friendly name for logging.
     */
    public async assertElementNotPresent(selector: string, name: string): Promise<void> {
        this.logger.info(`Asserting element ${name} is NOT present: (${selector})`);
        const locator = this.page.locator(selector);
        await expect(locator).not.toBeAttached();
    }

    /**
     * Scrolls the page to a specific element.
     * @param selector - The CSS selector of the element.
     */
    public async scrollToElement(selector: string): Promise<void> {
        this.logger.info(`Scrolling to element: ${selector}`);
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }

    /**
     * Gets the text content of an element.
     * @param selector - The CSS selector of the element.
     * @returns The text content.
     */
    public async getElementText(selector: string): Promise<string | null> {
        const text = await this.page.locator(selector).textContent();
        this.logger.debug(`Retrieved text from ${selector}: ${text}`);
        return text;
    }

    /**
     * Selects an option from a dropdown.
     * @param selector - The CSS selector of the select element.
     * @param value - The value or label of the option to select.
     * @param name - A friendly name for logging.
     */
    public async selectOption(selector: string, value: string, name: string): Promise<void> {
        this.logger.info(`Selecting option "${value}" from dropdown: ${name} (${selector})`);
        await this.page.selectOption(selector, { label: value });
    }

    /**
     * Waits for a network response with a specific status code or URL.
     * @param urlOrPredicate - The URL string or a predicate function.
     * @param status - The expected status code.
     */
    public async waitForResponse(urlOrPredicate: string | ((url: string) => boolean), status?: number): Promise<void> {
        this.logger.info(`Waiting for network response: ${urlOrPredicate} with status ${status || 'any'}`);
        await this.page.waitForResponse(response => {
            const urlMatch = typeof urlOrPredicate === 'string' 
                ? response.url().includes(urlOrPredicate) 
                : urlOrPredicate(response.url());
            
            const statusMatch = status ? response.status() === status : true;
            
            return urlMatch && statusMatch;
        });
    }
}

export default BrowserManager;
