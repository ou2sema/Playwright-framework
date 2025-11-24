/**
 * Logger Utility
 * Provides a centralized logging mechanism for the framework.
 */

import { config } from '../config/config';

// Define log levels
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    SILENT = 4,
}

// Map environment variable to LogLevel enum
const getLogLevel = (): LogLevel => {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    switch (level) {
        case 'DEBUG':
            return LogLevel.DEBUG;
        case 'INFO':
            return LogLevel.INFO;
        case 'WARN':
            return LogLevel.WARN;
        case 'ERROR':
            return LogLevel.ERROR;
        case 'SILENT':
            return LogLevel.SILENT;
        default:
            return LogLevel.INFO; // Default to INFO
    }
};

const CURRENT_LOG_LEVEL = getLogLevel();

/**
 * Logger class for structured logging.
 */
export class Logger {
    private static log(level: LogLevel, message: string, ...args: any[]): void {
        if (level >= CURRENT_LOG_LEVEL) {
            const timestamp = new Date().toISOString();
            const levelStr = LogLevel[level];
            const logMessage = `[${timestamp}] [${levelStr}] ${message}`;

            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(logMessage, ...args);
                    break;
                case LogLevel.INFO:
                    console.info(logMessage, ...args);
                    break;
                case LogLevel.WARN:
                    console.warn(logMessage, ...args);
                    break;
                case LogLevel.ERROR:
                    console.error(logMessage, ...args);
                    break;
            }
        }
    }

    public static debug(message: string, ...args: any[]): void {
        Logger.log(LogLevel.DEBUG, message, ...args);
    }

    public static info(message: string, ...args: any[]): void {
        Logger.log(LogLevel.INFO, message, ...args);
    }

    public static warn(message: string, ...args: any[]): void {
        Logger.log(LogLevel.WARN, message, ...args);
    }

    public static error(message: string, ...args: any[]): void {
        Logger.log(LogLevel.ERROR, message, ...args);
    }

    public static logConfig(): void {
        Logger.info('--- Framework Configuration ---');
        Logger.info(`Environment: ${config.ENV}`);
        Logger.info(`Base URL: ${config.BASE_URL}`);
        Logger.info(`Browser: ${config.BROWSER}`);
        Logger.info(`Headless: ${config.HEADLESS}`);
        Logger.info(`Slow Mo: ${config.SLOW_MO}ms`);
        Logger.info(`Timeout: ${config.TIMEOUT}ms`);
        Logger.info(`Allure Dir: ${config.ALLURE_RESULTS_DIR}`);
        Logger.info(`Screenshot on Fail: ${config.SCREENSHOT_ON_FAIL}`);
        Logger.info('-------------------------------');
    }
}

export default Logger;
