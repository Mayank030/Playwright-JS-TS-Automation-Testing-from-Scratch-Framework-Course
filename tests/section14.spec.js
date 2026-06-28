// Section 14: Perform Visual Testing with Playwright Algorithms

// 72. Capture  Screenshots with Playwright on page & partial Element level  - Demo


const {test, expect} = require('@playwright/test');  


test("Screenshots and Visual Comparision", async({page})=>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    // Screeshot only of a locator
    await page.locator("#displayed-text").screenshot({path:'ssofelement.png'}); 

    await page.locator("#hide-textbox").click();
    await page.screenshot({path:'screenshot.png'})
    await expect(page.locator("#displayed-text")).toBeHidden();
});

// 73. What is visual testing & How to perform it using Playwright

/*
a) On the first run you ask to take the screenshot of the page
And for every other run, it takes that screenshot of the page as Expected and compare it with the present run.
Playwright then compares the screenshot of Expected and Actual page. 
b) The comparision includes everthing present on the page including UI/Text/Alignment/color, pixel-by-pixel.
This comparision allows to know the differences in the page.
c) It will fail the script when the screenshot does not matches the Expected
*/

test.only("Screenshot Comparision", async({page})=>{

    await page.goto("https://www.firefox.com/en-US/");
    expect(await page.screenshot()).toMatchSnapshot('google.png')
    // this will fail for the first run since there is no expected image.
});


