@login
@smoke
@web_test
Feature: Validate Login Feature

  @customdownloadfolder
  Scenario: Login, Order books, checkout and download invoice
    Given I open DemoWebShop Login page
    And I go to books page
    Then I add books to cart
    And I go to cart and checkout
    Then I enter information on checkout page and confirm the Order