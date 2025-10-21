import { getAccessToken, paypal } from "../lib/paypal"

test('generate an access token', async() => {

    const token = await getAccessToken()
    console.log(token)

    expect(token.length).toBeGreaterThan(0)
    expect(typeof token).toBe('string')
    expect(token).toBeDefined()
});


test('create order', async() => {
    const token = await getAccessToken();

    const orderResponse = await paypal.createOrder(100);

    console.log(orderResponse);
    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('status');
    expect(orderResponse.status).toBe('CREATED');
})

test('capture payment', async() => {

    const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
        status: 'COMPLETED'
    });

    const response = await paypal.capturePayment('123');

    expect(mockCapturePayment).toHaveBeenCalledWith('123');
    expect(response.status).toBe('COMPLETED');
})