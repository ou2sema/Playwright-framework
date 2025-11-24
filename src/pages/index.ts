/**
 * Page Objects Index
 * Exports all page objects for easy importing.
 */

export { default as BasePage } from './basePage';
export { default as LoginPage } from './loginPage';
export { default as TodoPage, type TodoItem } from './todoPage';

// Re-export types for convenience
export type { TodoItem as ITodoItem } from './todoPage';
