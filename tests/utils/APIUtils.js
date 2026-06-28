/*
Notes:
a) The API newContext is to be declared in the test itself, but it must be sent to this file, using Constructor.
So while creating an object of this class in the test file, it will take the context as a paramater. 
But the context is decalred in the test file itself.
b) The payload would be given in the test file, since every test may use different payload.
Hence, the payload would be passed as a parameter
c) We created reponse{} object which holds 2 things, Token and OrderID. This is made so that it can be called in the test 
*/


class APIUtils
{
    // newContext constructor
    constructor(APIContext,loginPayload)
    {
        this.APIContext = APIContext;
        this.loginPayload = loginPayload;
    }


    // Login Token function 
    async getLoginToken()
    {
        // Login API
        const loginAPIcall = await this.APIContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
                {
                    data: this.loginPayload
                } 
            )
            const ResponsefromLogin = await loginAPIcall.json();  // Returns the JSON representation of response body which includes the TOKEN.
            await console.log(ResponsefromLogin);
            const Token =  ResponsefromLogin.token;
            console.log(Token);

            return Token;
    }

    
    // Create Order API
    async createOrder(orderPayload)
    {
        let response = {};
        response.Token = await this.getLoginToken();
        const ordersAPIcall = await this.APIContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
                {
                    data: orderPayload,
                    headers: 
                    {
                        'Authorization': response.Token,
                        'Content-Type': 'application/json'
                    }
                }
            )
            const ResponsefromOrder = await ordersAPIcall.json();
            console.log(ResponsefromOrder);
            const OrderID = ResponsefromOrder.orders[0]; 
            response.OrderID = OrderID;
            return response;
    }
}
module.exports = {APIUtils};