/**
 * Todo Page Object
 * Represents the todo management page and its interactions.
 * Extends the BasePage class.
 */

import { Page } from '@playwright/test';
import BasePage from './basePage';

/**
 * Interface for todo item data.
 */
export interface TodoItem {
    id?: string;
    title: string;
    description?: string;
    completed: boolean;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Page Object for the Todo page.
 */
export class TodoPage extends BasePage {
    // Page URL
    private readonly PAGE_URL = '/todos';

    // Locators
    private readonly selectors = {
        // Header and navigation
        pageTitle: '[data-testid="page-title"]',
        userMenu: '[data-testid="user-menu"]',
        logoutButton: '[data-testid="logout-button"]',

        // Todo creation form
        addTodoForm: '[data-testid="add-todo-form"]',
        todoTitleInput: '[data-testid="todo-title-input"]',
        todoDescriptionInput: '[data-testid="todo-description-input"]',
        todoPrioritySelect: '[data-testid="todo-priority-select"]',
        addTodoButton: '[data-testid="add-todo-button"]',

        // Todo list
        todoList: '[data-testid="todo-list"]',
        todoItem: '[data-testid="todo-item"]',
        todoItemTitle: '[data-testid="todo-item-title"]',
        todoItemDescription: '[data-testid="todo-item-description"]',
        todoItemPriority: '[data-testid="todo-item-priority"]',
        todoItemCheckbox: '[data-testid="todo-item-checkbox"]',
        todoItemEditButton: '[data-testid="todo-item-edit"]',
        todoItemDeleteButton: '[data-testid="todo-item-delete"]',

        // Edit todo modal/form
        editTodoModal: '[data-testid="edit-todo-modal"]',
        editTodoTitleInput: '[data-testid="edit-todo-title-input"]',
        editTodoDescriptionInput: '[data-testid="edit-todo-description-input"]',
        editTodoPrioritySelect: '[data-testid="edit-todo-priority-select"]',
        saveEditButton: '[data-testid="save-edit-button"]',
        cancelEditButton: '[data-testid="cancel-edit-button"]',

        // Filters and search
        searchInput: '[data-testid="search-input"]',
        filterAllButton: '[data-testid="filter-all"]',
        filterActiveButton: '[data-testid="filter-active"]',
        filterCompletedButton: '[data-testid="filter-completed"]',
        clearCompletedButton: '[data-testid="clear-completed"]',

        // Status and counters
        todoCounter: '[data-testid="todo-counter"]',
        emptyState: '[data-testid="empty-state"]',
        loadingSpinner: '[data-testid="loading-spinner"]',

        // Notifications
        successMessage: '[data-testid="success-message"]',
        errorMessage: '[data-testid="error-message"]',
    };

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the todo page.
     */
    public async navigateToTodoPage(): Promise<void> {
        await this.navigateTo(this.PAGE_URL);
        await this.waitForPageLoad();
    }

    /**
     * Check if the todo page is loaded correctly.
     */
    public async isPageLoaded(): Promise<boolean> {
        try {
            await this.waitForElementVisible(this.selectors.pageTitle, 'Page Title');
            await this.waitForElementVisible(this.selectors.addTodoForm, 'Add Todo Form');
            await this.waitForElementVisible(this.selectors.todoList, 'Todo List');
            return true;
        } catch (error) {
            this.logger.error('Todo page is not loaded correctly', error);
            return false;
        }
    }

    /**
     * Add a new todo item.
     * @param todo - The todo item data.
     */
    public async addTodo(todo: TodoItem): Promise<void> {
        this.logger.info(`Adding new todo: ${todo.title}`);
        
        await this.fillText(this.selectors.todoTitleInput, todo.title, 'Todo Title Input');
        
        if (todo.description) {
            await this.fillText(this.selectors.todoDescriptionInput, todo.description, 'Todo Description Input');
        }
        
        if (todo.priority) {
            await this.selectOption(this.selectors.todoPrioritySelect, todo.priority, 'Todo Priority Select');
        }
        
        await this.clickElement(this.selectors.addTodoButton, 'Add Todo Button');
        await this.waitForTodoToBeAdded();
    }

    /**
     * Wait for a todo to be added (success message or list update).
     */
    private async waitForTodoToBeAdded(): Promise<void> {
        try {
            // Wait for success message or list update
            await Promise.race([
                this.waitForElementVisible(this.selectors.successMessage, 'Success Message', 5000),
                this.waitForResponse('/api/todos', 201),
            ]);
        } catch (error) {
            this.logger.debug('Todo addition confirmation not detected');
        }
    }

    /**
     * Get all todo items from the list.
     */
    public async getAllTodos(): Promise<TodoItem[]> {
        const todoElements = await this.page.locator(this.selectors.todoItem).all();
        const todos: TodoItem[] = [];

        for (const element of todoElements) {
            const title = await element.locator(this.selectors.todoItemTitle).textContent() || '';
            const description = await element.locator(this.selectors.todoItemDescription).textContent() || '';
            const priority = await element.locator(this.selectors.todoItemPriority).textContent() || 'medium';
            const checkbox = element.locator(this.selectors.todoItemCheckbox);
            const completed = await checkbox.isChecked();

            todos.push({
                title: title.trim(),
                description: description.trim(),
                completed,
                priority: priority.toLowerCase() as TodoItem['priority'],
            });
        }

        return todos;
    }

    /**
     * Get a specific todo item by title.
     * @param title - The title of the todo to find.
     */
    public async getTodoByTitle(title: string): Promise<TodoItem | null> {
        const todos = await this.getAllTodos();
        return todos.find(todo => todo.title === title) || null;
    }

    /**
     * Toggle the completion status of a todo item.
     * @param title - The title of the todo to toggle.
     */
    public async toggleTodoCompletion(title: string): Promise<void> {
        this.logger.info(`Toggling completion for todo: ${title}`);
        const todoElement = this.page.locator(this.selectors.todoItem).filter({ hasText: title });
        const checkbox = todoElement.locator(this.selectors.todoItemCheckbox);
        await checkbox.click();
    }

    /**
     * Edit a todo item.
     * @param currentTitle - The current title of the todo to edit.
     * @param updatedTodo - The updated todo data.
     */
    public async editTodo(currentTitle: string, updatedTodo: Partial<TodoItem>): Promise<void> {
        this.logger.info(`Editing todo: ${currentTitle}`);
        
        // Click edit button for the specific todo
        const todoElement = this.page.locator(this.selectors.todoItem).filter({ hasText: currentTitle });
        const editButton = todoElement.locator(this.selectors.todoItemEditButton);
        await editButton.click();

        // Wait for edit modal to appear
        await this.waitForElementVisible(this.selectors.editTodoModal, 'Edit Todo Modal');

        // Update fields if provided
        if (updatedTodo.title) {
            await this.clearAndFillText(this.selectors.editTodoTitleInput, updatedTodo.title, 'Edit Todo Title Input');
        }

        if (updatedTodo.description !== undefined) {
            await this.clearAndFillText(this.selectors.editTodoDescriptionInput, updatedTodo.description, 'Edit Todo Description Input');
        }

        if (updatedTodo.priority) {
            await this.selectOption(this.selectors.editTodoPrioritySelect, updatedTodo.priority, 'Edit Todo Priority Select');
        }

        // Save changes
        await this.clickElement(this.selectors.saveEditButton, 'Save Edit Button');
        await this.waitForElementHidden(this.selectors.editTodoModal, 'Edit Todo Modal');
    }

    /**
     * Delete a todo item.
     * @param title - The title of the todo to delete.
     */
    public async deleteTodo(title: string): Promise<void> {
        this.logger.info(`Deleting todo: ${title}`);
        
        const todoElement = this.page.locator(this.selectors.todoItem).filter({ hasText: title });
        const deleteButton = todoElement.locator(this.selectors.todoItemDeleteButton);
        await deleteButton.click();

        // Wait for the todo to be removed from the list
        await this.waitForTodoToBeDeleted(title);
    }

    /**
     * Wait for a todo to be deleted from the list.
     * @param title - The title of the todo that should be deleted.
     */
    private async waitForTodoToBeDeleted(title: string): Promise<void> {
        const todoElement = this.page.locator(this.selectors.todoItem).filter({ hasText: title });
        await this.waitForElementHidden(todoElement.first(), `Todo item: ${title}`);
    }

    /**
     * Search for todos.
     * @param searchTerm - The search term to use.
     */
    public async searchTodos(searchTerm: string): Promise<void> {
        this.logger.info(`Searching for todos with term: ${searchTerm}`);
        await this.fillText(this.selectors.searchInput, searchTerm, 'Search Input');
        // Wait a moment for search results to update
        await this.page.waitForTimeout(500);
    }

    /**
     * Clear the search input.
     */
    public async clearSearch(): Promise<void> {
        await this.clearAndFillText(this.selectors.searchInput, '', 'Search Input');
        await this.page.waitForTimeout(500);
    }

    /**
     * Filter todos by status.
     * @param filter - The filter to apply ('all', 'active', 'completed').
     */
    public async filterTodos(filter: 'all' | 'active' | 'completed'): Promise<void> {
        this.logger.info(`Filtering todos by: ${filter}`);
        
        const filterSelector = {
            all: this.selectors.filterAllButton,
            active: this.selectors.filterActiveButton,
            completed: this.selectors.filterCompletedButton,
        }[filter];

        await this.clickElement(filterSelector, `Filter ${filter} Button`);
        await this.page.waitForTimeout(500);
    }

    /**
     * Clear all completed todos.
     */
    public async clearCompletedTodos(): Promise<void> {
        this.logger.info('Clearing all completed todos');
        await this.clickElement(this.selectors.clearCompletedButton, 'Clear Completed Button');
    }

    /**
     * Get the todo counter text.
     */
    public async getTodoCounter(): Promise<string | null> {
        return await this.getElementText(this.selectors.todoCounter, 'Todo Counter');
    }

    /**
     * Check if the empty state is displayed.
     */
    public async isEmptyStateDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.selectors.emptyState, 'Empty State');
    }

    /**
     * Assert that a specific number of todos are displayed.
     * @param expectedCount - The expected number of todos.
     */
    public async assertTodoCount(expectedCount: number): Promise<void> {
        const todos = await this.getAllTodos();
        if (todos.length !== expectedCount) {
            throw new Error(`Expected ${expectedCount} todos, but found ${todos.length}`);
        }
        this.logger.info(`Verified todo count: ${expectedCount}`);
    }

    /**
     * Assert that a todo with specific title exists.
     * @param title - The title of the todo to check.
     */
    public async assertTodoExists(title: string): Promise<void> {
        const todo = await this.getTodoByTitle(title);
        if (!todo) {
            throw new Error(`Todo with title "${title}" not found`);
        }
        this.logger.info(`Verified todo exists: ${title}`);
    }

    /**
     * Assert that a todo with specific title does not exist.
     * @param title - The title of the todo to check.
     */
    public async assertTodoNotExists(title: string): Promise<void> {
        const todo = await this.getTodoByTitle(title);
        if (todo) {
            throw new Error(`Todo with title "${title}" should not exist but was found`);
        }
        this.logger.info(`Verified todo does not exist: ${title}`);
    }

    /**
     * Logout from the application.
     */
    public async logout(): Promise<void> {
        this.logger.info('Logging out from the application');
        await this.clickElement(this.selectors.userMenu, 'User Menu');
        await this.clickElement(this.selectors.logoutButton, 'Logout Button');
    }

    /**
     * Get success message text.
     */
    public async getSuccessMessage(): Promise<string | null> {
        try {
            await this.waitForElementVisible(this.selectors.successMessage, 'Success Message', 5000);
            return await this.getElementText(this.selectors.successMessage, 'Success Message');
        } catch (error) {
            this.logger.debug('No success message found');
            return null;
        }
    }

    /**
     * Get error message text.
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
}

export default TodoPage;
