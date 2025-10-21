const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
    createOrder: async function createOrder(price:number){

        const token = await getAccessToken();

        const response = await fetch(`${base}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: price,
                        },
                    },
                ],
            }),
        });

       return handleResponse(response);
    },
    capturePayment: async function capturePayment(orderId:string){

        const token = await getAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            
        });
        return handleResponse(response);
    }
};


async function getAccessToken(){

    const {PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env;

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');

    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });


        const jsonData = await handleResponse(response);
        return jsonData.access_token
    
    
}


async function handleResponse(response:Response){
    
    if(response.ok){
        const jsonData = await response.json();
        return jsonData;
    }else{
        const errortext = await response.text();
        console.log(errortext);
        throw new Error(errortext);
    }
}
export {
    getAccessToken
}