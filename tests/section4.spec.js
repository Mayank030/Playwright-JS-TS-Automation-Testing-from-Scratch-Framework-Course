// Section 4: Playwright Basic methods for Web Automation testing with examples

const {test, expect} = require('@playwright/test'); 

// 13.,14.,15. 


/*
1. In Playwright, a locator is an object that represents a way to find element(s) on a web page at any moment, capturing the logic necessary to re-locate the target element as the DOM changes.
2. Playwright supports CSS selectors or Xpath to identify elements on a web page. (css selectors are recommended)
You can identify attributes by inspecting and hovering over that element to get id,class...
3. Use plugin "SelectorsHub" to validate at runtime if the selector in correct with all the instances.
4. Use ".locator('rule)" tp locate any element on the page
5. Use ".fill()" to type into the input fields
6. Use ".click()" to click a button
7. To write partial value we can user regularexpression "*", e.g. [attribute*='partialvalue']
*/
/* 
Rules to identify elements on a page  using CSS selectors
1) If ID is present:
css -> tagname#id or #id

2) if class attribute is present:
css -> tagname.class or .class\

3) Write css based on any Attribute: 
css -> [attribute='value']

4) Write css with traversing from Parent to Child:
css -> parenttagename >> childtagname

5) if needs to write the locator based on the text 
text=''  
*/


// 16. Wait mechanism

/*
1. Autowait for ".textContent()" is Attached which means, playwright wait until the locator is attached to the DOM.
But for ".allTextsContents", framework doesnot have any autowait mechanism, hence using this method it will return []
an empty array (because it might still be loading) as per Documetation.
*/

test.only('inputfeild',async({browser})=>
{
    const context = await browser.newContext();   
    const page = await context.newPage(); 
    //storing locators in variables
    const user_name = page.locator('input#username');
    const pass_word = page.locator("[type='password']");
    const signin_btn = page.locator('#signInBtn');
    const card_title = page.locator(".card-body a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");       
    console.log(await page.title());

    // Login using incorrect credentials
    // Note: To show the error msg popup it takes ~2s, playwright will wait till mentioned timeout in config file
    // await page.locator('input#username').fill('skullrush');  // or #username 
    // await page.locator("[type='password']").fill("learning");
    // await page.locator('#signInBtn').click();
    // console.log(await page.locator("[style*='block']").textContent());  // to extract the error text 

    //Login using correct creds 
    await user_name.fill('skullrush'); 
    await pass_word.fill("learning");
    await signin_btn.click();
    console.log(await page.locator("[style*='block']").textContent());  
    await user_name.fill("");  //works as erase all 
    await user_name.fill("rahulshettyacademy");
    await pass_word.fill("");
    await pass_word.fill("Learning@830$3mK2");
    await signin_btn.click();

    // Fetch the title of the first product after login
    // console.log(await page.locator("card-body a").textContent()); // traversing parent to child
    // The above code would throw error since the locator is not unique (there are 4 instances)
    console.log(await page.locator(".card-body a").first().textContent()); // gives 1st ele
    console.log(await page.locator(".card-body a").nth(1).textContent());  // gives 2nd ele
    console.log(await page.locator(".card-body a").last().textContent()); 

    // To take all the text contents 
    const all_card_titles = await card_title.allTextContents();
    console.log(all_card_titles);
    // Note: If we comment the .textContent() code, the playwright will return [] empty array
});


// 17. Wait mechanism

/*
1. The data available on page are driven by API calls which can be seen under "Network" tab in inspect.
".waitForLoadState()" will wait until all the API calls are made and the page is loaded.
2. The above method is flaky, an alternative for this is to use '.waitfor()' with the locator.
Note: This only works when the locator is giving only single element 
*/

test('assignmenttest', async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill("anshika@gmail.com");
    await page.locator('#userPassword').fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');   // wait until network comes to idle state, which means all api calls are made
    // await page.locator(".card-body b").last().waitFor();  // alternate method
    const cards = await page.locator(".card-body b").allTextContents();
    console.log(cards);
});