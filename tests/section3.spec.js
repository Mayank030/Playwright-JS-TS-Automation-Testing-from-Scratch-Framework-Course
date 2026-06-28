// Section 3: Getting started with Playwright Automation Core concepts



// 9. Test annotation

const {test, expect} = require('@playwright/test');   // importing playwright module

/*  To write a test case, we write a test function. 
2 arguments: test case name, test function (actual code) 
Note: test annatation runs sequentially. */

test('testcase01',async ()=> {
    // playwright code
});

/* JS is asynchronious, which means code will not execute in sequence. Code will execute together parallely.
Hence await is used before every step to ensure previous step is completed before it executes next step.
async keyword represents that the fucntion is asynchronious. async and await comes as a combination. await will only be activated when the fucntion is marked as async */


// 10. Fixtures

test('browser_context_declaration',async ({browser})=>
{
    // chrome - plugins,cookies etc
    const context = await browser.newContext();     // new instance of browser with fixed properties (like chrome icognito),  we can inject cookies in parameters
    const page = await context.newPage();           // this opens a blank page or tab in a browser to enter the URL 
    await page.goto("https://groww.in/");           // Enter URL to goto that page
});

/* If we do not want to inject any cookies or plugins etc.., i.e. newContext() has no parameters, then it is considered as default.
We can use another Fixture "page" to use default browser with no cookies (like icognito)   */
 
test('page_test',async ({page})=>
{
    await page.goto("https://groww.in/"); 
});

/* {browser} is a fixture which is globally available to all tests in project for every test annotation. {} is used to represent it as playwright fixture
In JS, particularly within Playwright, a fixture refers to the established, known, and consistent environment or set of data used as a baseline for running tests. 
Context  acts as an independent environment with its own cookies, local storage, and cache, ensuring full test isolation with minimal overhead.
Passing parameters in Context, will open Browser with injected cookies. (e.g. to bypass login page )
browser is passed in config file.
test.only is used to excute the particular test skipping other test functions
*/


// 11. config file

/* 
1. To run a test we do not directly run the file. We use terminal which would execute the config.js file. 
The test file we need to run is mentioned in this config.js file under testDir.
2. Timeouts: Default timeout to wait for a testcase to execute is 30sec (30000ms). To overwrite this timeout (to wait for longer time), we can specify in config.js file.
3. Expect Timeout: except are assertions which we use in our tests, are used explicitly for assertions validations.
assertions are used in tests to verify that the application behaves as expected, by comparing the actual result with the desired outcome.
4. Browsername: it is menttioned under use{}
5. export default defineConfig: All configuaration key value pairs are converted into one variable and this module is exported so it is available across all files in the project.
6. Headless/Headed: Headless means no UI, Headed means Chrome would open and actions perfom would be visible.
We can declare this in config.js or in terminal we can mention "--headed" while running "npx playwright test"
*/


// 12. Test assertions 

/*
1. Test assertion: get title of page and set assertion to check if its correct 
*/
test('page_tst',async ({page})=>
{
    await page.goto("https://groww.in/"); 
    console.log(await page.title());   // prints the title
    await expect(page).toHaveTitle("Groww - Online Demat, Trading and Direct Mutual Fund Investment in India");  // assertion to check if it has this title (if yes pass else fail)
});
