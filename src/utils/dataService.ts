/**
 * Data Service
 * Handles reading and caching data from a multi-sheet Excel file.
 * Uses the 'xlsx' library to parse the file.
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import Logger from './logger';

// Define the structure for the cached data
interface DataCache {
    [sheetName: string]: any[];
}

// Define the path to the Excel file (assuming it's in the root of the project)
const EXCEL_FILE_PATH = path.join(process.cwd(), 'test_data.xlsx');

class DataService {
    private cache: DataCache = {};
    private logger = Logger;

    /**
     * Loads the data from the Excel file into the cache.
     * @param filePath - Optional path to the Excel file.
     */
    public loadData(filePath: string = EXCEL_FILE_PATH): void {
        this.logger.info(`Attempting to load data from: ${filePath}`);
        
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(process.cwd(), filePath);
        }

        try {
            // 1. Read the Excel file
            const workbook = XLSX.readFile(filePath);
            
            // 2. Iterate over all sheets
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                
                // 3. Convert the worksheet to a JSON array
                const data = XLSX.utils.sheet_to_json(worksheet);
                
                // 4. Store in cache
                this.cache[sheetName] = data;
                this.logger.info(`Successfully loaded ${data.length} rows from sheet: ${sheetName}`);
            });
            
            this.logger.info('All data sheets loaded successfully.');
        } catch (error) {
            this.logger.error(`Failed to load Excel data from ${filePath}. Error:`, error);
            // Throwing the error to stop test execution if data is critical
            throw new Error(`DataService failed to load data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Retrieves all data rows from a specific sheet.
     * @param sheetName - The name of the sheet (e.g., 'Login', 'Todo').
     * @returns An array of objects representing the data rows.
     */
    public getData(sheetName: string): any[] {
        if (Object.keys(this.cache).length === 0) {
            this.logger.warn('Data cache is empty. Attempting to load data now.');
            this.loadData();
        }
        
        const data = this.cache[sheetName];
        
        if (!data) {
            this.logger.error(`Sheet '${sheetName}' not found in Excel file.`);
            return [];
        }
        
        return data;
    }

    /**
     * Retrieves a single data row based on a key/value pair.
     * @param sheetName - The name of the sheet.
     * @param key - The column name to search in (e.g., 'test_case_id').
     * @param value - The value to match (e.g., 'TC-LOGIN-001').
     * @returns The matching data object or undefined.
     */
    public getSingleData(sheetName: string, key: string, value: any): any | undefined {
        const data = this.getData(sheetName);
        return data.find(row => row[key] === value);
    }
}

// Export a singleton instance
export const dataService = new DataService();

// Optional: Load data immediately on import (can be moved to a hook if preferred)
// dataService.loadData();
