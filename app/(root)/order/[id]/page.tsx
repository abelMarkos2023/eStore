import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation'
import React from 'react'
import OrderDetailTable from './OrderDetailTable';
import { TShippingAddress } from '@/lib/types';
import { auth } from '@/auth';
import Stripe from 'stripe';

const page = async ({params}:{params:Promise<{id:string}>}) => {

    const {id} = await params
    const session = await auth();

    if(!id) return notFound();

    const order = await getOrderById(id);

    if(!order) return notFound();
    let client_secret = null;

    if(order.paymentsMethod === 'Stripe' && !order.isPaid){
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        const paymentIntents = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalPrice) * 100),
            currency: 'USD',
            metadata: {integration_check: 'accept_a_payment', order_id: order.id},
        });

        client_secret = paymentIntents.client_secret;

    }
    
  return (
    <div>
        <OrderDetailTable order={
            {
                ...order,
                shippingAddress: order.shippingAddress as TShippingAddress
          
            }
        
        } 
            paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
            isAdmin={session?.user?.role === 'admin' ? true : false}
            stripeClientSecret={client_secret}
        />
    </div>
  )
}

export default page