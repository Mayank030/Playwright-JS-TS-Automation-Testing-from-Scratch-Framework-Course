// Section 10: Handling Web dialogs, Frames & Event listeners with Playwright


const {test, expect} = require('@playwright/test');  


// 50. How to validate if element is hidden, displayed mode with Expect assertions
// 51. How to automate  Java/JavaScript Alert popups with Playwright
// 52. How to handle & Automate frames with Playwright - Example

// A child frame inside of a main frame (iframe/frameset tag)

test ("Popupvalidations", async({page})=>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("https://google.com");
    // await page.goBack();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();

    page.on('dialog', dialog => dialog.accept());
    // page.on('dialog', dialog => dialog.dismiss()); // first arg is event
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();

    const framesPage =  page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const subsCount = await framesPage.locator(".text h2").textContent();
    console.log(subsCount.split(" ")[1]);

});

