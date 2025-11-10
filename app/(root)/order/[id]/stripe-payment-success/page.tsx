import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order.action';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'
import Stripe from 'stripe';

const page = async({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<{payment_intent:string}>}) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const {id} = await params;
    const {payment_intent:paymentIntentId} = await searchParams;

    const order = await getOrderById(id);

    if(!order) return notFound();

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);

    if(paymentIntent.metadata.order_id !== order.id.toString()){
        return notFound();
    }

    const isPaymentSuccessful = paymentIntent.status === 'succeeded';

    if(!isPaymentSuccessful) return notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-green-200 text-green-800 p-6 flex flex-col gap-2 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
                Payment Successful!
                <CheckIcon className="inline-block w-8 h-8 ml-2 text-green-600" />
                
            </h2>
            <p className="mb-2">Thank you for your payment. Your order has been successfully processed.</p>
            <p className="mb-4">Order ID: <span className="font-mono">{order.id}</span></p>
            <p className="text-lg font-semibold">
                Amount Paid: ${(paymentIntent.amount_received / 100).toFixed(2)}
            </p>
            <Button asChild className='w-full'>
                <Link href={`/order/${id}`}>View Order</Link>
            </Button>
        </div>
    </div>
  )
}

export default page