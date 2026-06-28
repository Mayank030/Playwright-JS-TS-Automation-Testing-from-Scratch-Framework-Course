// Section 8: Learn  Playwright Inspectors , Trace Viewers & Codegen tools with Demo examples\



const {test, expect} = require('@playwright/test'); 
const { count } = require('node:console');

// 46. What is Playwright Inspector? And how to debug the playwright script
/* --debug : Debug, record and playback (codegen) and also locate elements IDs
npx playwright test section8.spec.js --debug
Step over: Move to the next line/action in the code 
Get locator or Validate locator: Select element to get the locator or paste the locator to validate */


// 47. Codegen tool to record & Playback with generated automation script
/* npx playwright codegen [url]
Perform actions when in codegen tool
Assert text: To assert the text which is present
Visibility: To check that the element is visible 
Assert value: .toHaveValue
Change language of code  */


// 48. Detailed view of Test Traces, HTML reports, logs & Screenshots for test results
/* To get screenshots or trace:
pw.config - under "use" mention it, types: [off,on,on-first-failure,only-on-failure]
trace: What happened on each and every step execution with log (a detailed report).
/test-results: contains screenshots with trace.zip
/playwright-report: html report visible to understand test steps, failure, screenshots, traces
Trace viewer: Upload the downloaded trace.zip, to understand line-by-line step with screenshots with Before and After action
*/

test('playwrightInspector', async({page})=> {
    await page.goto("https://rahulshettyacademy.com/angularpractice");

    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("123@abc");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByRole("Link", {name: "Shop"}).click();
    await page.locator("app-card").filter({hasText: "Samsung Note 8"}).getByRole("button").click();

} );