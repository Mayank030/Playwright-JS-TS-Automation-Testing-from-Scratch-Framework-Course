// 66. How to intercept Network response calls with Playwright route method

/*
Use for this:
Suppose if there are multiple orders when we login,
but we have to test the UI elements or the message displayed on the page when there are 0 orders.
a) To do this, it is not convinient to delete all the order just to check the empty orders page.
b) The orders that are displayed on the page, is brought by a API as a response.
c) We can intercept or alter the response before response is rendered on the browser.
Hence if we fake the response of the empty data, the page renders the no orders page. 
Note: This is only for the automated browser session. 
*/

// 67. Understand the playwright route method and its parameters in intercepting - Demo

/*
Use page.route(url to be routed, a function -> url to which it route)
Use .fulfill() method to fake the reponse through route
Note: Routing must happen before clicking on Orders
Note: Use .waitForResponse(URL) since we connot fake the response before the actual response, else it will throw error
Note: Use * (regular expression) in the URL since the ID might be different for different users
*/

const {test, expect, request} = require('@playwright/test');  
const {APIUtils} = require('./utils/APIUtils')

 
const loginPayload = {userEmail:"skull03rush@gmail.com",userPassword:"Iamking@000"};
const orderPayload = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]}

const emptyOrdersPayload = {data:[], message:"No Orders"};

let response;

test.beforeAll(async()=> {
    const APIContext = await request.newContext();
    const apiutils = new APIUtils(APIContext,loginPayload);  //object of class 
    response = await apiutils.createOrder(orderPayload);
});


test('Empty Orders Fake Response', async({page})=>
{
    // Code to inject token in local storage
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.Token);  

    const email = "skull03rush@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => 
        {
            // Intercepting the response 
            // True API response to Fake API response -> Browser -> Render data as per response on frontend
            const trueResponse = await page.request.fetch(route.request());
            const fakeResponse = JSON.stringify(emptyOrdersPayload);
            route.fulfill(
                {
                    trueResponse,
                    fakeResponse 
                }
            )

        }
    ) 
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
    console.log(await page.locator(".mt-4").textContent())
    //await page.pause();
});


// 69. How to intercept Network request calls with Playwright - Example demo

/*
a) Intercepting request calls with route.continue() method
b) Use for this:
- To check the authorization working of the site from hackers.
- If someone intercepts the request and redirects to another order which was not made by the user. It must display 403 error.
c) To do this:
Redirect the URL with some another order id, which is not placed from this account.
.continue() method routes the URL or Headers.
*/

test('Security Test request intercept', async({page}) =>{

    // Login and reach Orders page
    const email = "skull03rush@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');  
    await page.locator(".card-body b").first().waitFor();

    // Intercept the request 
    await page.locator("button[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        async route => route.continue(
            {
                url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a2e89e317ee3e78badbe069',
            }
        )
    )
    await page.locator("button:has-text('View')").nth(2).click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
    //await page.pause();
});


// 71. How to abort the Network calls with Playwright - Examples

/*
a) Use for this:
- When the server is down and the page cannot be reached
- Or you donot want to load any type of css/img(png,jpeg,jpg) files etc
b) To do this:
- We can abort the request call and hence no response
c) Using page.on() which is an event listener we can track all the Requests and Reponses with status codes etc
to understand which API fails to get response.
*/
test.only('Abort Request calls', async({page}) =>{

    const email = "skull03rush@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client");

    // Abort bg images, icons calls
    page.route('**/*.{webp,ico,jpeg,jpg,png}', route=> route.abort());

    page.on('request', request=> console.log(request.url()));
    page.on('response', response => console.log(response.status()));

    
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');  
    await page.locator(".card-body b").first().waitFor();

    // Intercept the request 
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("button:has-text('View')").nth(2).click();
});
