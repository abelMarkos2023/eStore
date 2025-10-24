import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation'
import React from 'react'
import OrderDetailTable from './OrderDetailTable';
import { TShippingAddress } from '@/lib/types';
import { auth } from '@/auth';

const page = async ({params}:{params:Promise<{id:string}>}) => {

    const {id} = await params
    const session = await auth();

    if(!id) return notFound();

    const order = await getOrderById(id);

    if(!order) return notFound();
    
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
        />
    </div>
  )
}

export default page