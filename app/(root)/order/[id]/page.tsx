import { getOrderById } from '@/lib/actions/order.action';
import { notFound } from 'next/navigation'
import React from 'react'
import OrderDetailTable from './OrderDetailTable';
import { TShippingAddress } from '@/lib/types';

const page = async ({params}:{params:Promise<{id:string}>}) => {

    const {id} = await params

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
        } />
    </div>
  )
}

export default page