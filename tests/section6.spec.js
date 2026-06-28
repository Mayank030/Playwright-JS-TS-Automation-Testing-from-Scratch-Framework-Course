// Section 6: End to End Web Automation Practice Exercise with Playwright



const {test, expect} = require('@playwright/test'); 
const { count } = require('node:console');

// 27.
// 28. Write the Script to dynamically find the product to buy from list of products
// 29. Add assertions for the actions performed and implement necessary Sync steps 
// 30. Handling Auto suggestive dropdown options with playwright - Example
// 32. Complete E2E flow of Placing the order and grab the OrderID with Playwright
// 34. Dynamically find the order from OrderHistory page using Playwright Script logic

/*
".isVisible()" - to check if the element/text is visible on the page -> it returns a boolean value 
.pressSequentially(): Playwright directly inserts the text into the suggestion box, but suggestions only comes when 
we start TYPING into the field.
*/

test('endtoendautomation', async({page})=>
{
    const email = "skull03rush@gmail.com"
    const products = page.locator(".card-body")    // locator is not unique hence it will return array
    const item = "ZARA COAT 3";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');  
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
    // await page.pause();

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
    // await page.pause();

    // Task 04: Place Order after validating shipping information and validating the order is placed and storing orderid
    await expect(page.locator(".user__name [style*='color']")).toHaveText(email);
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