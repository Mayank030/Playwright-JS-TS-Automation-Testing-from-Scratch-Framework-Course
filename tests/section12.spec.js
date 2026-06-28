// Section 12: Session storage & Intercepting Network request/responses with Playwright

const {test, expect} = require('@playwright/test'); 

// 63. How to save session storage using Playwright and inject into new Browser context

/*
a) For some application,process of storing the cookies while login might be complicated.
Hence, we can save the storage state after login and save it in a file.json and inject this file directly to browser through context.
*/

test.beforeAll('Login', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();

    const email = "skull03rush@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle'); 
    await context.storageState({path: 'loginState.json'})
});

let webContextwithLogin;

test('endtoendautomation', async({browser})=>
{

    webContextwithLogin = await browser.newContext({storageState:'loginState.json'})
    const page = await webContextwithLogin.newPage()

    
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body")    // locator is not unique hence it will return array
    const item = "ZARA COAT 3";
     
    await page.locator(".card-body b").first().waitFor();
    const prod_name = await page.locator(".card-body b").allTextContents();
    console.log(prod_name);

    // Task01: "Zara Coat 3" Add to cart
    const total_prod = await products.count();
    for (let i=0; i<total_prod; ++i) {
        if (await products.nth(i).locator("b").textContent() === item){
            // Add to Cart
            await products.nth(i).locator("text= Add To Cart").click();
            break; // since we added the desired item to the cart, no need to iterate
        }  
    }

    // Task 02: Verify the item added to the cart is same
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const cart_item = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect (cart_item).toBeTruthy();

    // Task 03: Checkout and fill information (Auto suggestive dropdown options)
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*=Country]").pressSequentially("ind", {delay:150});
    // after typing, suggestions may take time to appear
    const suggestions = page.locator(".ta-results");
    await suggestions.waitFor();
    // iterate through options to look for the option
    const number_of_suggestion = await suggestions.locator("button").count();
    for (let i=0; i<number_of_suggestion; ++i){
        const country = await suggestions.locator("button").nth(i).textContent();
        if (country.trim() === "India"){
            await suggestions.locator("button").nth(i).click();
            break;  
        }
    }


    // Task 04: Place Order after validating shipping information and validating the order is placed and storing orderid
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const order_id = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(order_id);

    // Task 05: Validating the order ID from Orders
    await page.locator("button[routerlink*='myorders']").click();
    const orders = await page.locator("tbody tr");
    await page.locator("tbody").waitFor();
    for (let i=0; i<await orders.count(); ++i){
        const row_order_id = await orders.nth(i).locator("th").textContent();
        if (order_id.includes(row_order_id)){
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    const placed_product = await page.locator(".title").textContent();
    expect(item === placed_product);
});


// 64. How to debug the API steps in script using Visual code debugging

/*
a) The playwright inspector debugs only on the UI/frontend part and skips the API part
To debug 
1) VSCODE:
- Go to package.json
- In scripts add the command in test ("test:npx playwright...")
- Show and run commands (Ctrl+Shift+P)
- And select Debug: Debug npm script 
- In the code, mark the line with the red dot as debug point or breakpoint
- Run in debug npm script mode 
*/


// 65. Detailed view of Trace viewer to understand the API logging req/responses

/*
2) Trace Viewer
- Keep the trace 'on' from config file 
- Run the file
- In the 'test-results' folder, a trace zip file would be created 
- Open the file from trace.playwright.dev
*/
