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
import { DataLoader } from '@/data/dataLoader';
import { generateLoginFeature } from "../data/generators/scenarioGenerator";
// Global setup before all scenarios

let loginData: any[] = [];
BeforeAll(async function () {
    console.log("Generating login DDT feature file...");
  generateLoginFeature();
    loginData = DataLoader.loadLoginData();
  console.log("Loaded login test data:", loginData);
  (global as any).LOGIN_DATA = loginData;
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
