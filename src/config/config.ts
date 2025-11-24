/**
 * Configuration Manager
 * Handles environment-specific settings for the test framework.
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Defines the structure for the environment configuration.
 */
export interface IConfig {
    // Environment settings
    ENV: 'development' | 'staging' | 'production' | 'local';
    BASE_URL: string;
    HEADLESS: boolean;
    SLOW_MO: number;
    TIMEOUT: number;

    // Browser settings
    BROWSER: 'chromium' | 'firefox' | 'webkit';
    VIEWPORT_WIDTH: number;
    VIEWPORT_HEIGHT: number;

    // Reporting settings
    ALLURE_RESULTS_DIR: string;
    SCREENSHOT_ON_FAIL: boolean;
}

/**
 * Retrieves the current environment configuration.
 * @returns {IConfig} The configuration object.
 */
export const getConfig = (): IConfig => {
    const env = (process.env.NODE_ENV as IConfig['ENV']) || 'local';

    // Base configuration
    const baseConfig: Partial<IConfig> = {
        ENV: env,
        HEADLESS: process.env.HEADLESS === 'false' ? false : true,
        SLOW_MO: parseInt(process.env.SLOW_MO || '0', 10),
        TIMEOUT: parseInt(process.env.TIMEOUT || '30000', 10),
        BROWSER: (process.env.BROWSER as IConfig['BROWSER']) || 'chromium',
        VIEWPORT_WIDTH: parseInt(process.env.VIEWPORT_WIDTH || '1920', 10),
        VIEWPORT_HEIGHT: parseInt(process.env.VIEWPORT_HEIGHT || '1080', 10),
        ALLURE_RESULTS_DIR: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        SCREENSHOT_ON_FAIL: process.env.SCREENSHOT_ON_FAIL === 'true' ? true : false,
    };

    // Environment-specific overrides
    switch (env) {
        case 'production':
            return {
                ...baseConfig,
                BASE_URL: process.env.PROD_BASE_URL || 'https://prod.example.com',
                HEADLESS: true,
                SCREENSHOT_ON_FAIL: false, // Typically disabled in production CI runs for speed
            } as IConfig;
        case 'staging':
            return {
                ...baseConfig,
                BASE_URL: process.env.STAGING_BASE_URL || 'https://staging.example.com',
                HEADLESS: true,
            } as IConfig;
        case 'development':
            return {
                ...baseConfig,
                BASE_URL: process.env.DEV_BASE_URL || 'http://localhost:5173',
                HEADLESS: false, // Easier for local development
            } as IConfig;
        case 'local':
        default:
            return {
                ...baseConfig,
                BASE_URL: process.env.LOCAL_BASE_URL || 'http://localhost:5173',
                HEADLESS: false,
                SLOW_MO: 50, // Slow down execution for visual debugging
            } as IConfig;
    }
};

export const config = getConfig();
export default config;
