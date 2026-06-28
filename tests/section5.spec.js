// Section 5: Handling UI Components(Dropdowns ,Radio Buttons, Childwindows) with Playwright



const {test, expect} = require('@playwright/test'); 

// 20,21,22. Static dropdown, radio button, assertions, blinking text 

/* 
1. 2 types of dropdown: a) Static b) Dynamic
a) Static: Options are already present also known as Select dropdowns (select tag is used)
2. Use ".selectOption" and pass the value to select the option from the dropdown.
3. "page.pause()" is used to pause the execution before it closes. 
It opens Playwright inspector which is also useful in debugging
4. Selecting radio button we use ".click()" 

5. "".toBeChecked()" is used for radio buttons and checkboxes to check if it is selected.
".isChecked()" is used to give a boolean (T/F) whether it is selected or not (but not used with assertion).
".uncheck()" is used to uncheck a checkbox 
6. There is no assertion for uncheck. But assert a unchecked radio button we can use ".toBeFalsy()" with ".isChecked()"
which asserts it to be false.
*/

test('ui_controls', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const user_name = page.locator('input#username');
    const pass_word = page.locator("[type='password']");
    const signin_btn = page.locator('#signInBtn');
    const floating_text1 = page.locator("[href*='documents-request']");
    const floating_text2 = page.locator("[href*='techsmarthire.com']");
    //Dropdown
    const drop_down = page.locator("select.form-control");
    await drop_down.selectOption("consult");  // select option from dropdown
    //Radio button
    await page.locator(".radiotextsty").nth(1).click()  // 2nd radio btn i.e User
    await page.locator("#okayBtn").click();       // popup opens 
    // await page.pause();  // Playwright inspector
    //Checkbox
    // expect(await page.locator("#terms").isChecked().toBeFalsy());
    await page.locator("#terms").click();
    // await page.locator("#terms").uncheck();    // to uncheck 
    //Assertions 
    // console.log(await page.locator((".radiotextsty").last().isChecked()));  // returns [T/F]
    // await expect(page.locator(".radiotextsty").nth(1)).toBeChecked();
    // await expect(page.locator("#terms").toBeChecked());
    // expect(await page.locator("#terms").isChecked().toBeTruthy());

    // Blinking text
    await expect(floating_text1).toHaveAttribute("class","blinkingText");
    await expect(floating_text2).toHaveAttribute("class","blinkingText");
});


// 24. Handling Child windows/page and tabs


/*
1. When something opens in separate window, we have to tell playwright to wait for an event of new page.
The original page does not have any context out of this page.
".waitForEvent()" listener is invoked when new background page is created in the context.
2. This new page "newPatge" now will have all the context of the new page.
3. Note: The new page listener is initialized before the click action is performed but the new page only opens when click is performed.
Which means both the action must be performed parallaly. We use Promise for such operations.

4. A JS Promise is an object representing the eventual outcome (completion or failure) of an asynchronous operation.
A promise is a container for a future result. 
A promise exists in one of three states: 
a) Pending: Operation is in progress.
b) Fulfilled: Operation completed successfully.
c) Rejected: Operation failed.
5. Promise.all() is a static JS method that takes an iterable (typically an array) of Promises and returns a single new Promise. 
It ties the operation togther to run parallaly. It itters until the Promise state is fulfilled for all steps in array.
*/


test.only('child_page_handling', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const floating_text1 = page.locator("[href*='documents-request']");
    const floating_text2 = page.locator("[href*='techsmarthire.com']");
    // Child page
    const [newPage] = await Promise.all(
        [
            context.waitForEvent('page'), // listen for new page
            await floating_text1.click() // this opens in separate window
        ]
    );
    const red_text = await newPage.locator(".red").textContent();
    // console.log(red_text);
    // Task
    // Grab the username from the new page (present in emailid) and enter it in the parent page.
    const array_text = red_text.split("@"); // breaks strings into 2 array based on delimeter
    const domain = array_text[1].split(" ")[0];
    console.log(domain);
    await page.locator('#username').fill(domain);
    console.log(await page.locator('#username').inputValue());
    await page.pause();
});


// 25. Difference b/w textContent() and inputValue()
/*
Initially when the page is opened, the username feild is blank. This is what the DOM is attched to page.
But after filling the value in the username feild, it does not gets attached to DOM.
Hence we use "inputValue()" instead of "textContent()" to grab the text after the  DOM is altered.
*/