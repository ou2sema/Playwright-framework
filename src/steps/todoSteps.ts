/**
 * Todo Step Definitions
 * Implements the step definitions for todo management scenarios.
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { TodoPage, TodoItem } from '../pages';

// Step definitions for todo scenarios

Given('I am on the todos page', async function (this: ICustomWorld) {
    const todoPage = new TodoPage(this.page);
    await todoPage.navigateToTodoPage();
    await todoPage.isPageLoaded();
    this.logger.info('User is on the todos page');
});

When('I add a new todo with title {string}', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    const todo: TodoItem = {
        title,
        completed: false,
    };
    await todoPage.addTodo(todo);
    this.logger.info(`Added new todo: ${title}`);
});

When('I add a new todo with the following details:', async function (this: ICustomWorld, dataTable: DataTable) {
    const todoPage = new TodoPage(this.page);
    const todoData = dataTable.hashes()[0];
    
    const todo: TodoItem = {
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority as TodoItem['priority'],
        completed: false,
    };
    
    await todoPage.addTodo(todo);
    this.logger.info(`Added new todo with details: ${JSON.stringify(todo)}`);
});

When('I add a new todo with title {string} and priority {string}', async function (this: ICustomWorld, title: string, priority: string) {
    const todoPage = new TodoPage(this.page);
    const todo: TodoItem = {
        title,
        priority: priority as TodoItem['priority'],
        completed: false,
    };
    await todoPage.addTodo(todo);
    this.logger.info(`Added new todo: ${title} with priority: ${priority}`);
});

Then('I should see the todo {string} in the list', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.assertTodoExists(title);
    this.logger.info(`Verified todo exists: ${title}`);
});

Then('I should not see the todo {string} in the list', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.assertTodoNotExists(title);
    this.logger.info(`Verified todo does not exist: ${title}`);
});

Then('the todo counter should show {string}', async function (this: ICustomWorld, expectedText: string) {
    const todoPage = new TodoPage(this.page);
    const counterText = await todoPage.getTodoCounter();
    expect(counterText).toContain(expectedText);
    this.logger.info(`Verified todo counter shows: ${expectedText}`);
});

Then('the todo should have description {string}', async function (this: ICustomWorld, expectedDescription: string) {
    // This would require getting the specific todo and checking its description
    // For now, we'll check if the description is visible in the todo item
    const descriptionLocator = this.page.locator('[data-testid="todo-item-description"]').filter({ hasText: expectedDescription });
    await expect(descriptionLocator).toBeVisible();
    this.logger.info(`Verified todo has description: ${expectedDescription}`);
});

Then('the todo should have priority {string}', async function (this: ICustomWorld, expectedPriority: string) {
    // Check if the priority is visible in the todo item
    const priorityLocator = this.page.locator('[data-testid="todo-item-priority"]').filter({ hasText: expectedPriority });
    await expect(priorityLocator).toBeVisible();
    this.logger.info(`Verified todo has priority: ${expectedPriority}`);
});

Given('I have a todo {string}', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    const todo: TodoItem = {
        title,
        completed: false,
    };
    await todoPage.addTodo(todo);
    await todoPage.assertTodoExists(title);
    this.logger.info(`Created todo for test: ${title}`);
});

When('I mark the todo {string} as completed', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.toggleTodoCompletion(title);
    this.logger.info(`Marked todo as completed: ${title}`);
});

Then('the todo {string} should be marked as completed', async function (this: ICustomWorld, title: string) {
    // Check if the todo checkbox is checked
    const todoElement = this.page.locator('[data-testid="todo-item"]').filter({ hasText: title });
    const checkbox = todoElement.locator('[data-testid="todo-item-checkbox"]');
    await expect(checkbox).toBeChecked();
    this.logger.info(`Verified todo is completed: ${title}`);
});

When('I edit the todo {string} to have title {string}', async function (this: ICustomWorld, currentTitle: string, newTitle: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.editTodo(currentTitle, { title: newTitle });
    this.logger.info(`Edited todo from "${currentTitle}" to "${newTitle}"`);
});

When('I delete the todo {string}', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.deleteTodo(title);
    this.logger.info(`Deleted todo: ${title}`);
});

Given('I have the following todos:', async function (this: ICustomWorld, dataTable: DataTable) {
    const todoPage = new TodoPage(this.page);
    const todos = dataTable.hashes();
    
    for (const todoData of todos) {
        const todo: TodoItem = {
            title: todoData.title,
            completed: todoData.completed === 'true',
            description: todoData.description,
            priority: todoData.priority as TodoItem['priority'],
        };
        
        await todoPage.addTodo(todo);
        
        // If the todo should be completed, mark it as completed
        if (todo.completed) {
            await todoPage.toggleTodoCompletion(todo.title);
        }
    }
    
    this.logger.info(`Created ${todos.length} todos for test`);
});

When('I filter todos by {string}', async function (this: ICustomWorld, filter: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.filterTodos(filter as 'all' | 'active' | 'completed');
    this.logger.info(`Filtered todos by: ${filter}`);
});

Then('I should see {int} todo(s) in the list', async function (this: ICustomWorld, expectedCount: number) {
    const todoPage = new TodoPage(this.page);
    await todoPage.assertTodoCount(expectedCount);
    this.logger.info(`Verified todo count: ${expectedCount}`);
});

When('I search for {string}', async function (this: ICustomWorld, searchTerm: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.searchTodos(searchTerm);
    this.logger.info(`Searched for: ${searchTerm}`);
});

When('I clear all completed todos', async function (this: ICustomWorld) {
    const todoPage = new TodoPage(this.page);
    await todoPage.clearCompletedTodos();
    this.logger.info('Cleared all completed todos');
});

When('I try to add a todo with empty title', async function (this: ICustomWorld) {
    const todoPage = new TodoPage(this.page);
    try {
        const todo: TodoItem = {
            title: '',
            completed: false,
        };
        await todoPage.addTodo(todo);
    } catch (error) {
        // Expected to fail
        this.logger.info('Attempted to add todo with empty title (expected to fail)');
    }
});

Then('I should see an error message {string}', async function (this: ICustomWorld, expectedMessage: string) {
    const todoPage = new TodoPage(this.page);
    const errorMessage = await todoPage.getErrorMessage();
    expect(errorMessage).toContain(expectedMessage);
    this.logger.info(`Verified error message: ${expectedMessage}`);
});

Then('the todo should not be added to the list', async function (this: ICustomWorld) {
    // Check that no todo with empty title was added
    const todoPage = new TodoPage(this.page);
    const todos = await todoPage.getAllTodos();
    const emptyTitleTodos = todos.filter(todo => todo.title === '');
    expect(emptyTitleTodos).toHaveLength(0);
    this.logger.info('Verified no empty title todo was added');
});

Then('I should see the todo {string} with priority {string}', async function (this: ICustomWorld, title: string, priority: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.assertTodoExists(title);
    
    // Check priority
    const todoElement = this.page.locator('[data-testid="todo-item"]').filter({ hasText: title });
    const priorityElement = todoElement.locator('[data-testid="todo-item-priority"]');
    await expect(priorityElement).toContainText(priority);
    
    this.logger.info(`Verified todo "${title}" has priority "${priority}"`);
});

Given('I have no todos', async function (this: ICustomWorld) {
    // Clear all existing todos if any
    const todoPage = new TodoPage(this.page);
    const todos = await todoPage.getAllTodos();
    
    for (const todo of todos) {
        await todoPage.deleteTodo(todo.title);
    }
    
    // Verify no todos exist
    await todoPage.assertTodoCount(0);
    this.logger.info('Cleared all todos for test');
});

Then('I should see the empty state message', async function (this: ICustomWorld) {
    const todoPage = new TodoPage(this.page);
    const isEmpty = await todoPage.isEmptyStateDisplayed();
    expect(isEmpty).toBe(true);
    this.logger.info('Verified empty state is displayed');
});

Then('the message should say {string}', async function (this: ICustomWorld, expectedMessage: string) {
    const emptyStateElement = this.page.locator('[data-testid="empty-state"]');
    await expect(emptyStateElement).toContainText(expectedMessage);
    this.logger.info(`Verified empty state message: ${expectedMessage}`);
});

When('I refresh the page', async function (this: ICustomWorld) {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    this.logger.info('Refreshed the page');
});

Then('I should still see the todo {string} in the list', async function (this: ICustomWorld, title: string) {
    const todoPage = new TodoPage(this.page);
    await todoPage.assertTodoExists(title);
    this.logger.info(`Verified todo persists after refresh: ${title}`);
});

When('I logout from the application', async function (this: ICustomWorld) {
    const todoPage = new TodoPage(this.page);
    await todoPage.logout();
    this.logger.info('Logged out from the application');
});

Then('I should be redirected to the login page', async function (this: ICustomWorld) {
    const expectedUrl = '/login';
    await this.page.waitForURL(new RegExp(expectedUrl), { timeout: 10000 });
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain(expectedUrl);
    this.logger.info(`Successfully redirected to login page: ${currentUrl}`);
});

Then('I should not be able to access the todos page without logging in', async function (this: ICustomWorld) {
    // Try to navigate to todos page
    await this.page.goto('/todos');
    
    // Should be redirected to login page
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain('/login');
    this.logger.info('Verified todos page is protected and redirects to login');
});
