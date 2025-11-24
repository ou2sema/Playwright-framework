/**
 * Base Page Class
 * Provides common functionality for all page objects.
 * Follows the Page Object Model (POM) pattern.
 */

import { Page, Locator, expect } from '@playwright/test';
import Logger from '../utils/logger';
import { config } from '../config/config';

/**
 * Abstract base class for all page objects.
 * Contains common methods and properties that all pages should have.
 */
export abstract class BasePage {
    protected page: Page;
    protected logger: typeof Logger;
    protected config: typeof config;

    constructor(page: Page) {
        this.page = page;
        this.logger = Logger;
        this.config = config;
    }

    /**
     * Navigate to a specific URL.
     * @param url - The URL to navigate to (can be relative or absolute).
     */
    public async navigateTo(url: string): Promise<void> {
        const fullUrl = url.startsWith('http') ? url : `${this.config.BASE_URL}${url}`;
        this.logger.info(`Navigating to: ${fullUrl}`);
        await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Wait for the page to load completely.
     */
    public async waitForPageLoad(): Promise<void> {
        this.logger.debug('Waiting for page to load...');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get the current page title.
     */
    public async getPageTitle(): Promise<string> {
        const title = await this.page.title();
        this.logger.debug(`Page title: ${title}`);
        return title;
    }

    /**
     * Get the current page URL.
     */
    public async getCurrentUrl(): Promise<string> {
        const url = this.page.url();
        this.logger.debug(`Current URL: ${url}`);
        return url;
    }

    /**
     * Click an element by selector.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async clickElement(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Clicking element: ${name}`);
        const locator = this.page.locator(selector);
        await locator.click();
    }

    /**
     * Fill text into an input field.
     * @param selector - The CSS selector of the input field.
     * @param text - The text to fill.
     * @param elementName - A friendly name for logging.
     */
    public async fillText(selector: string, text: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Filling text "${text}" into: ${name}`);
        const locator = this.page.locator(selector);
        await locator.fill(text);
    }

    /**
     * Clear and fill text into an input field.
     * @param selector - The CSS selector of the input field.
     * @param text - The text to fill.
     * @param elementName - A friendly name for logging.
     */
    public async clearAndFillText(selector: string, text: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Clearing and filling text "${text}" into: ${name}`);
        const locator = this.page.locator(selector);
        await locator.clear();
        await locator.fill(text);
    }

    /**
     * Get text content of an element.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async getElementText(selector: string, elementName?: string): Promise<string | null> {
        const name = elementName || selector;
        this.logger.debug(`Getting text from element: ${name}`);
        const locator = this.page.locator(selector);
        return await locator.textContent();
    }

    /**
     * Check if an element is visible.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async isElementVisible(selector: string, elementName?: string): Promise<boolean> {
        const name = elementName || selector;
        this.logger.debug(`Checking if element is visible: ${name}`);
        const locator = this.page.locator(selector);
        return await locator.isVisible();
    }

   public async waitForElementVisible(
    element: string | Locator,
    elementName?: string,
    timeout?: number
): Promise<void> {
    const name = elementName || (typeof element === 'string' ? element : 'Locator');
    const locator = typeof element === 'string' ? this.page.locator(element) : element;

    this.logger.info(`Waiting for element to be visible: ${name}`);
    await expect(locator).toBeVisible({ timeout });
}
   public async waitForElementHidden(
    element: string | Locator,
    elementName?: string,
    timeout?: number
): Promise<void> {
    const name = elementName || (typeof element === 'string' ? element : 'Locator');
    const locator = typeof element === 'string' ? this.page.locator(element) : element;

    this.logger.info(`Waiting for element to be hidden: ${name}`);
    await expect(locator).toBeHidden({ timeout });
}

    /**
     * Assert that an element contains specific text.
     * @param selector - The CSS selector of the element.
     * @param expectedText - The expected text.
     * @param elementName - A friendly name for logging.
     */
    public async assertElementText(selector: string, expectedText: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Asserting element ${name} contains text: "${expectedText}"`);
        const locator = this.page.locator(selector);
        await expect(locator).toContainText(expectedText);
    }

    /**
     * Assert that an element has exact text.
     * @param selector - The CSS selector of the element.
     * @param expectedText - The expected exact text.
     * @param elementName - A friendly name for logging.
     */
    public async assertElementExactText(selector: string, expectedText: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Asserting element ${name} has exact text: "${expectedText}"`);
        const locator = this.page.locator(selector);
        await expect(locator).toHaveText(expectedText);
    }

    /**
     * Assert that an element is visible.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async assertElementVisible(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Asserting element is visible: ${name}`);
        const locator = this.page.locator(selector);
        await expect(locator).toBeVisible();
    }

    /**
     * Assert that an element is hidden.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async assertElementHidden(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Asserting element is hidden: ${name}`);
        const locator = this.page.locator(selector);
        await expect(locator).toBeHidden();
    }

    /**
     * Scroll to an element.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async scrollToElement(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Scrolling to element: ${name}`);
        const locator = this.page.locator(selector);
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Select an option from a dropdown.
     * @param selector - The CSS selector of the select element.
     * @param value - The value or label to select.
     * @param elementName - A friendly name for logging.
     */
    public async selectOption(selector: string, value: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Selecting option "${value}" from dropdown: ${name}`);
        await this.page.selectOption(selector, { label: value });
    }

    /**
     * Hover over an element.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async hoverElement(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Hovering over element: ${name}`);
        const locator = this.page.locator(selector);
        await locator.hover();
    }

    /**
     * Double-click an element.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async doubleClickElement(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Double-clicking element: ${name}`);
        const locator = this.page.locator(selector);
        await locator.dblclick();
    }

    /**
     * Right-click an element.
     * @param selector - The CSS selector of the element.
     * @param elementName - A friendly name for logging.
     */
    public async rightClickElement(selector: string, elementName?: string): Promise<void> {
        const name = elementName || selector;
        this.logger.info(`Right-clicking element: ${name}`);
        const locator = this.page.locator(selector);
        await locator.click({ button: 'right' });
    }

    /**
     * Press a key or key combination.
     * @param key - The key or key combination to press.
     */
    public async pressKey(key: string): Promise<void> {
        this.logger.info(`Pressing key: ${key}`);
        await this.page.keyboard.press(key);
    }

    /**
     * Take a screenshot of the current page.
     * @param name - Optional name for the screenshot file.
     */
    public async takeScreenshot(name?: string): Promise<Buffer> {
        const screenshotName = name || `screenshot-${Date.now()}`;
        this.logger.info(`Taking screenshot: ${screenshotName}`);
        return await this.page.screenshot({ fullPage: true });
    }

    /**
     * Wait for a network response.
     * @param urlPattern - The URL pattern to wait for.
     * @param status - Optional expected status code.
     */
    public async waitForResponse(urlPattern: string | RegExp, status?: number): Promise<void> {
        this.logger.info(`Waiting for response: ${urlPattern} ${status ? `with status ${status}` : ''}`);
        await this.page.waitForResponse(response => {
            const urlMatch = typeof urlPattern === 'string' 
                ? response.url().includes(urlPattern) 
                : urlPattern.test(response.url());
            
            const statusMatch = status ? response.status() === status : true;
            
            return urlMatch && statusMatch;
        });
    }

    /**
     * Reload the current page.
     */
    public async reloadPage(): Promise<void> {
        this.logger.info('Reloading page...');
        await this.page.reload({ waitUntil: 'domcontentloaded' });
    }

    /**
     * Go back in browser history.
     */
    public async goBack(): Promise<void> {
        this.logger.info('Going back in browser history...');
        await this.page.goBack({ waitUntil: 'domcontentloaded' });
    }

    /**
     * Go forward in browser history.
     */
    public async goForward(): Promise<void> {
        this.logger.info('Going forward in browser history...');
        await this.page.goForward({ waitUntil: 'domcontentloaded' });
    }

    /**
     * Get a locator for an element.
     * @param selector - The CSS selector of the element.
     */
    protected getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    /**
     * Abstract method that must be implemented by each page.
     * Should return true if the page is loaded correctly.
     */
    public abstract isPageLoaded(): Promise<boolean>;
}

export default BasePage;
