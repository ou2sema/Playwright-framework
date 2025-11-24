Feature: User Authentication
  As a user
  I want to be able to login to the application
  So that I can access my personal dashboard and manage my todos

  Background:
    Given I am on the login page

  @smoke @authentication
  Scenario: Successful login with valid credentials
    When I enter username "admin" and password "password"
    And I click the login button
    Then I should be redirected to the todos page
    And I should see the page title "Todo Manager"

  @authentication @negative
  Scenario: Failed login with invalid username
    When I enter username "invaliduser" and password "password"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  @authentication @negative
  Scenario: Failed login with invalid password
    When I enter username "admin" and password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  @authentication @negative
  Scenario: Failed login with empty credentials
    When I enter username "" and password ""
    And I click the login button
    Then I should see an error message "Username and password are required"
    And I should remain on the login page

  @authentication @negative
  Scenario: Failed login with empty username
    When I enter username "" and password "password"
    And I click the login button
    Then I should see an error message "Username and password are required"
    And I should remain on the login page

  @authentication @negative
  Scenario: Failed login with empty password
    When I enter username "admin" and password ""
    And I click the login button
    Then I should see an error message "Username and password are required"
    And I should remain on the login page

  @authentication @ui
  Scenario: Login page elements are displayed correctly
    Then I should see the username input field
    And I should see the password input field
    And I should see the login button
    And I should see the "Register" tab


  @authentication @navigation
  Scenario: Navigate to register tab
    When I click the "Register" tab
    Then I should see the registration tab

  @authentication @security
  Scenario: Password field masks input
    When I enter password "secretpassword"
    Then the password field should mask the input
    And the password should not be visible in plain text
