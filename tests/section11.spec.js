// Section 11: API Testing with Playwright and  Build mix of Web & API tests

const {test, expect, request} = require('@playwright/test');  

/* 
53. understanding the importance of API integration calls for Web tests  
a) Example: Whenever we login to application, there is a API request made in backend which returns a TOKEN.
API call can be seen in Network tab in devtools. When you click on the API call, there would be many properties of API.
Headers, Response, Payload etc. 
Headers: General (information such as URL, Status code etc), Response Headers, Request Headers
Payload: The creds used to login are displayed in JSON
Reponse: Token, userid, message etc in JSON. To access any object use object.token/userid/message

b) The TOKEN is set in the Session Storage.
Application tab in dev tools -> Storage -> Local/Session storage
To demonstrate, once we login to app and open the app in new tab, since the API token is stored in the session storage, the user will no have to login again.
If we login into incognito, the session is not shared, but we can isert the same token and value in the Session storage manually to login automatically.
*/


// 54. Playwright request method to make API calls and grab response - Example

const loginPayload = {userEmail:"skull03rush@gmail.com",userPassword:"Iamking@000"};
const orderPayload = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
let Token;
let OrderID;

test.beforeAll(async()=> {
    const APIContext = await request.newContext();

    // Login API call
    const loginAPIcall = await APIContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayload
        } 
    )
    expect(loginAPIcall.ok()).toBeTruthy();
    const ResponsefromLogin = await loginAPIcall.json();  // Returns the JSON representation of response body which includes the TOKEN.
    await console.log(ResponsefromLogin);
    Token =  ResponsefromLogin.token;
    console.log(Token);

    // Orders API
    const ordersAPIcall = await APIContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: 
            {
                'Authorization': Token,
                'Content-Type': 'application/json'
            }
        }
    )
    const ResponsefromOrder = await ordersAPIcall.json();
    console.log(ResponsefromOrder);
    OrderID = ResponsefromOrder.orders[0];  // Network -> Response
});


// 55. Parsing API response & passing token to browser local storage with Playwright
/* 
a) Playwright cannot directly insert the token in the session storage and hence we have to use Javascript.
Playwright can execute javascript expressions using ".addInitScript()" 
First argument for above method is a funtion, this fucntion has code to insert the item in the local storage
Second argument is a parameter which is the actual Token value
b) After this, there is no need for the login code. This API token will bypass the login screen.
*/


// 56. Place order API to create order and bypass the flow in UI with mix of web/API
/*
a) There is API call made whenever we place a Order, we can use this API directly to place the order if our goal 
is to check the order is visible in the "Orders" page
b) But, before we place a order, we need Authorization. Place order for the logged in user. We have to tell that the order
creation is tied up with this account.
Under Headers -> Request Headers; there is a Authorization key with value
*/

// 57. End to end validation with mix of API & Web concepts - Reduce test time


test('API test', async({page})=>
{
    // Code to inject token in local storage
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, Token);  

    // Login code (not required)

    const email = "skull03rush@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body")    // locator is not unique hence it will return array
    
    await page.locator(".card-body b").first().waitFor();
    const prod_name = await page.locator(".card-body b").allTextContents();
    

    // Task01: "Zara Coat 3" Add to cart (not required)
    // Task 02: Verify the item added to the cart is same (not required)
    // Task 03: Checkout and fill information (Auto suggestive dropdown options) (not required)
    // Task 04: Place Order after validating shipping information and validating the order is placed and storing orderid (not required)

    // Task 05: Validating the order ID from Orders
    await page.locator("button[routerlink*='myorders']").click();
    const orders = await page.locator("tbody tr");
    await page.locator("tbody").waitFor();
    for (let i=0; i<await orders.count(); ++i){
        const row_order_id = await orders.nth(i).locator("th").textContent();
        if (OrderID.includes(row_order_id)){
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    const placed_product = await page.locator(".title").textContent();
});