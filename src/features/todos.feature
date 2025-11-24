Feature: Todo Management
  As a logged-in user
  I want to manage my todo items
  So that I can organize my tasks effectively

  Background:
    Given I am logged in as "admin" with password "password"
    And I am on the todos page

  @smoke @todos
  Scenario: Add a new todo item
    When I add a new todo with title "Buy groceries"
    Then I should see the todo "Buy groceries" in the list
    And the todo counter should show "1 item left"

  @todos @crud
  Scenario: Add a todo with description and priority
    When I add a new todo with the following details:
      | title       | description                    | priority |
      | Learn TypeScript | Complete the TypeScript course | high     |
    Then I should see the todo "Learn TypeScript" in the list
    And the todo should have description "Complete the TypeScript course"
    And the todo should have priority "high"

  @todos @crud
  Scenario: Mark a todo as completed
    Given I have a todo "Complete project documentation"
    When I mark the todo "Complete project documentation" as completed
    Then the todo "Complete project documentation" should be marked as completed
    And the todo counter should show "0 items left"

  @todos @crud
  Scenario: Edit an existing todo
    Given I have a todo "Review code"
    When I edit the todo "Review code" to have title "Review and refactor code"
    Then I should see the todo "Review and refactor code" in the list
    And I should not see the todo "Review code" in the list

  @todos @crud
  Scenario: Delete a todo item
    Given I have a todo "Delete this task"
    When I delete the todo "Delete this task"
    Then I should not see the todo "Delete this task" in the list

  @todos @filtering
  Scenario: Filter todos by status - All
    Given I have the following todos:
      | title           | completed |
      | Active task 1   | false     |
      | Completed task  | true      |
      | Active task 2   | false     |
    When I filter todos by "all"
    Then I should see 3 todos in the list

  @todos @filtering
  Scenario: Filter todos by status - Active
    Given I have the following todos:
      | title           | completed |
      | Active task 1   | false     |
      | Completed task  | true      |
      | Active task 2   | false     |
    When I filter todos by "active"
    Then I should see 2 todos in the list
    And I should see the todo "Active task 1"
    And I should see the todo "Active task 2"
    And I should not see the todo "Completed task"

  @todos @filtering
  Scenario: Filter todos by status - Completed
    Given I have the following todos:
      | title           | completed |
      | Active task 1   | false     |
      | Completed task  | true      |
      | Active task 2   | false     |
    When I filter todos by "completed"
    Then I should see 1 todo in the list
    And I should see the todo "Completed task"
    And I should not see the todo "Active task 1"
    And I should not see the todo "Active task 2"

  @todos @search
  Scenario: Search for todos
    Given I have the following todos:
      | title                    |
      | Buy groceries           |
      | Buy birthday gift       |
      | Complete project        |
    When I search for "buy"
    Then I should see 2 todos in the list
    And I should see the todo "Buy groceries"
    And I should see the todo "Buy birthday gift"
    And I should not see the todo "Complete project"

  @todos @bulk-operations
  Scenario: Clear all completed todos
    Given I have the following todos:
      | title           | completed |
      | Active task     | false     |
      | Completed task 1| true      |
      | Completed task 2| true      |
    When I clear all completed todos
    Then I should see 1 todo in the list
    And I should see the todo "Active task"
    And I should not see the todo "Completed task 1"
    And I should not see the todo "Completed task 2"

  @todos @validation
  Scenario: Cannot add todo with empty title
    When I try to add a todo with empty title
    Then I should see an error message "Title is required"
    And the todo should not be added to the list

  @todos @priority
  Scenario: Add todos with different priorities
    When I add a new todo with title "Urgent task" and priority "urgent"
    And I add a new todo with title "Low priority task" and priority "low"
    Then I should see the todo "Urgent task" with priority "urgent"
    And I should see the todo "Low priority task" with priority "low"

  @todos @counter
  Scenario: Todo counter updates correctly
    Given I have no todos
    When I add a new todo with title "First task"
    Then the todo counter should show "1 item left"
    When I add a new todo with title "Second task"
    Then the todo counter should show "2 items left"
    When I mark the todo "First task" as completed
    Then the todo counter should show "1 item left"

  @todos @empty-state
  Scenario: Empty state is displayed when no todos exist
    Given I have no todos
    Then I should see the empty state message
    And the message should say "No todos yet. Add one above!"

  @todos @persistence
  Scenario: Todos persist after page refresh
    Given I have a todo "Persistent task"
    When I refresh the page
    Then I should still see the todo "Persistent task" in the list

  @todos @logout
  Scenario: Logout from todos page
    When I logout from the application
    Then I should be redirected to the login page
    And I should not be able to access the todos page without logging in
