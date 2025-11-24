/**
 * Cucumber World Context
 * Extends the base World class to provide shared context and utilities
 * for all step definitions.
 */

import { World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { config } from '../config/config';
import Logger from '../utils/logger';
import path from 'path';

/**
 * Defines the shared context available in all Cucumber steps.
 */
export interface ICustomWorld extends World {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    config: typeof config;
    logger: typeof Logger;
    testData: { [key: string]: any };
    attach: World['attach'];
    // Custom methods
    initBrowser: () => Promise<void>;
    closeBrowser: () => Promise<void>;
    takeScreenshot: (scenarioName: string) => Promise<Buffer | undefined>;
}

/**
 * Custom World class that manages the Playwright browser instance.
 */
export class CustomWorld extends World implements ICustomWorld {
    public browser!: Browser;
    public context!: BrowserContext;
    public page!: Page;
    public config = config;
    public logger = Logger;
    public testData: { [key: string]: any } = {};

    constructor(options: any) {
        super(options);
        this.logger.logConfig();
    }

    /**
     * Initializes the Playwright browser and page.
     */
    public async initBrowser(): Promise<void> {
        this.logger.info(`Initializing ${this.config.BROWSER} browser...`);
        
        const browserType = {
            chromium,
            firefox,
            webkit,
        }[this.config.BROWSER];

        if (!browserType) {
            throw new Error(`Unsupported browser type: ${this.config.BROWSER}`);
        }

        this.browser = await browserType.launch({
            headless: this.config.HEADLESS,
            slowMo: this.config.SLOW_MO,
        });

        this.context = await this.browser.newContext({
            viewport: {
                width: this.config.VIEWPORT_WIDTH,
                height: this.config.VIEWPORT_HEIGHT,
            },
            baseURL: this.config.BASE_URL,
            ignoreHTTPSErrors: true,
            // Add other context options as needed (e.g., locale, timezone)
        });

        // Set default timeout for all operations
        this.context.setDefaultTimeout(this.config.TIMEOUT);

        this.page = await this.context.newPage();
        this.logger.info('Browser and Page initialized successfully.');
    }

    /**
     * Closes the Playwright browser.
     */
    public async closeBrowser(): Promise<void> {
        if (this.browser) {
            this.logger.info('Closing browser...');
            await this.browser.close();
        }
    }

    /**
     * Takes a screenshot of the current page.
     */
    public async takeScreenshot(scenarioName: string): Promise<Buffer | undefined> {
        if (this.page) {
            // Note: The allure-cucumberjs reporter automatically handles screenshot attachments
            // if you use the standard Playwright methods within the steps.
            // This method is kept for manual attachment if needed.
            const screenshotPath = path.join(
                process.cwd(),
                this.config.ALLURE_RESULTS_DIR,
                `screenshot-${scenarioName.replace(/\s/g, '_')}-${Date.now()}.png`
            );
            
            this.logger.debug(`Taking screenshot: ${screenshotPath}`);
            const buffer = await this.page.screenshot({ path: screenshotPath });
            return buffer;
        }
        return undefined;
    }
}

setWorldConstructor(CustomWorld);
