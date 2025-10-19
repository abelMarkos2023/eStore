'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { TCartItem, Torder } from "../types"
import { convertToPlainObject, formatError } from "../utils"
import { auth } from "@/auth"
import { getUserById } from "./user.action"
import { getMyCart } from "./cart.actions"
import { insertOrderSchema } from "../validator"
import { prisma } from "@/db/prisma"

export const createOrder = async () => {

    try {

        const cart = await getMyCart();

        if(!cart || cart.items.length === 0) return {success:false, message:'Your cart is empty', redirect:'/cart'};
        const session = await auth();
        if(!session || !session.user || !session.user.id) throw new Error('You must be logged in to create an order');

        const user = await getUserById(session.user.id);

        if(!user) throw new Error('User not found');

        if(!user.address) return {success:false, message:'Please add your shipping address before creating an order', redirect:'/shipping-address'};

        if(!user.paymentMethod) return {success:false, message:'Please add your payment method before creating an order', redirect:'/payment-method'};

        const newOrder = insertOrderSchema.parse({
            userId: user.id,
            paymentsMethod: user.paymentMethod,
            shippingAddress: user.address,
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice,
           
        });
      const orderId = await prisma.$transaction(async (tsx) => {

        const order = await tsx.order.create({data:{...newOrder}});

        for (const item of cart.items as TCartItem[]){
            await tsx.orderItem.create({
                data:{
                    orderId: order.id,
                    ...item
                }
            })
        }

        await tsx.cart.update({
            where:{id:cart.id},
            data:{items:[],itemsPrice:0,shippingPrice:0,taxPrice:0,totalPrice:0}
        });

        return order.id
      })
        return {success:true, message:'Order created successfully', redirect:`/order/${orderId}`}
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
        return { success: false,message:formatError(error)}
    }
}


//get Order By Id

export const getOrderById = async (id:string) => {

    try {
        const order = await prisma.order.findFirst(
            {
                where:{id},
                include:{
                orderItems:true,
                user:{
                    select:{
                        name:true,
                        email:true,
                    }
                }
            }
        },
            
        );
        if(!order) throw new Error('Order not found');
        return convertToPlainObject(order);
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
        return null
    }
}