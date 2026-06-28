// Section 11: API Testing with Playwright and  Build mix of Web & API tests

// 59. Refactor API calls from utils folder and isolate from Web test logic
// 60. Part 2 - Refactor API calls from utils folder and isolate from Web test logic

const {test, expect, request} = require('@playwright/test');  
const {APIUtils} = require('./utils/APIUtils')

 
const loginPayload = {userEmail:"skull03rush@gmail.com",userPassword:"Iamking@000"};
const orderPayload = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
let response;

test.beforeAll(async()=> {
    const APIContext = await request.newContext();
    const apiutils = new APIUtils(APIContext,loginPayload);  //object of class 
    response = await apiutils.createOrder(orderPayload);
});


test('API test', async({page})=>
{
    // Code to inject token in local storage
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.Token);  

    const email = "skull03rush@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body")    // locator is not unique hence it will return array
    
    await page.locator(".card-body b").first().waitFor();
    const prod_name = await page.locator(".card-body b").allTextContents();

    // Task 05: Validating the order ID from Orders
    await page.locator("button[routerlink*='myorders']").click();
    const orders = await page.locator("tbody tr");
    await page.locator("tbody").waitFor();
    for (let i=0; i<await orders.count(); ++i){
        const row_order_id = await orders.nth(i).locator("th").textContent();
        if (response.OrderID.includes(row_order_id)){
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    const placed_product = await page.locator(".title").textContent();
});