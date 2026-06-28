// Section 7: Playwright Unique GetBy Locators for Smart Testing & Test Runner usage



const {test, expect} = require('@playwright/test'); 
const { count } = require('node:console');

// 36. Understand how GetByLabel & Playwright UI Runner works with an example
// 37. Filtering elements with GetByRole,GetByText and perform chaining methods in step
// 39. Understand when getByLabel can be used to enter into edit boxes


test ('playwright_locators', async({page})=> {
    await page.goto("https://rahulshettyacademy.com/angularpractice");

    // Task 01: Selecting checkbox, radiobtns, dropdowns...
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");

    // Task 02: Applying filters on locators and chaining locators.
    await page.getByPlaceholder("Password").fill("123@abc");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByRole("Link", {name: "Shop"}).click();
    await page.locator("app-card").filter({hasText: "Samsung Note 8"}).getByRole("button").click();
    await page.pause();

    // Task 03: Edit boxes
    /* getbyLabel can be used for input boxes, if the input tag is used inside the label tag 
    or
    if there is association in label tag (for="xyz") and input tag (id="xyz")
    */

});


// 42. Strategy on handling Calendars automation using Playwright

test ('calender automation', async({page})=> {

    await page.goto("https://rahulshettyacademy.com/angularpractice");

} );