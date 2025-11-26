/**
 * Cucumber Hooks
 * Provides setup and teardown functionality for test scenarios,
 * focusing on Playwright browser management.
 * Allure reporting is now handled via the new 'allure-cucumberjs/reporter' format.
 */

import { Before, After, BeforeAll, AfterAll,Status  } from '@cucumber/cucumber';
import { ICustomWorld } from './world';
import Logger from '../utils/logger';
import { ScreenshotManager } from '../utils/ScreenshotManager';
import { dataService } from '../utils/dataService'; // Import the data service
import * as path from 'path';
// Global setup before all scenarios

const EXCEL_FILE_NAME = '/test-data/test_data.xlsx';
const EXCEL_FILE_PATH = path.join(process.cwd(), EXCEL_FILE_NAME);
BeforeAll(async function () {
    // Load data from the multi-sheet Excel file
    try {
        dataService.loadData(EXCEL_FILE_PATH);
    } catch (error) {
        Logger.error(`FATAL: Could not load test data from ${EXCEL_FILE_NAME}. Test execution aborted.`);
        // In a real scenario, you might want to exit the process here
        // process.exit(1);
    }
  
    Logger.info('🚀 Starting test execution...');
    // Add any global setup here (e.g., API server start)
    Logger.info('✅ Test environment initialized');
});

// Setup before each scenario
Before(async function (this: ICustomWorld, scenario) {
    this.logger.info(`🎬 Starting scenario: ${scenario.pickle.name}`);
    
    // Initialize browser for the scenario
    await this.initBrowser();
    
    this.logger.info(`🌐 Browser initialized: ${this.config.BROWSER}`);
});

// Cleanup after each scenario
After(async function (this: ICustomWorld, scenario) {

     if (scenario.result?.status === Status.FAILED) {
    await ScreenshotManager.capture(this, `FAILED-${scenario.pickle.name.replace(/\s+/g, '_')}`);}
    const scenarioName = scenario.pickle.name;
    const scenarioStatus = scenario.result?.status;
    
    this.logger.info(`🏁 Scenario completed: ${scenarioName} - Status: ${scenarioStatus}`);
    
    // Close browser
    await this.closeBrowser();
    this.logger.info('🔒 Browser closed');
    
});

// Global cleanup after all scenarios
AfterAll(async function () {
    Logger.info('🏆 Test execution completed');
    // Add any global cleanup here (e.g., API server stop)
});
