'use client'

import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order.action';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useFormStatus } from 'react-dom';

const PlaceOrderForm = () => {

    const router = useRouter();

    const PlaceOrder = () => {

        const {pending} = useFormStatus();

        return <Button className='cursor-pointer w-full' disabled={pending}>
            {
                pending ? (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                ) : (<Check className='mr-2 h-4 w-4' />)
            }
            {' '} Place Order
        </Button>
    }
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        const res = await createOrder();

        if(res.redirect){
            router.push(res.redirect);
        }
    }
  return (
    <form onSubmit={handleSubmit} className="w-full">
        <PlaceOrder />
    </form>
  )
}

export default PlaceOrderForm