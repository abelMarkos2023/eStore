'use server'

import { cookies } from "next/headers"
import type { TCart, TCartItem } from "../types"
import { auth } from "@/auth"
import { convertToPlainObject, formatError, roundToTwoDecimal } from "../utils"
import { prisma } from "@/db/prisma"
import { cartItemSchema, insertCartSchema } from "../validator"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

const calcPrice = (items:TCartItem[]) => {

    const itemsPrice = items.reduce((acc,item) => acc + roundToTwoDecimal(Number(item.price) * item.qty) ,0);

    const taxPrice = roundToTwoDecimal(0.15 * itemsPrice);
    const shippingPrice = roundToTwoDecimal(itemsPrice > 200 ? 0 : 20);
    const totalPrice = roundToTwoDecimal(itemsPrice + taxPrice + shippingPrice);


    return {
        itemsPrice : itemsPrice.toFixed(2),
        taxPrice : taxPrice.toFixed(2),
        shippingPrice : shippingPrice.toFixed(2),
        totalPrice : totalPrice.toFixed(2)
    }
}

export const addToCart = async(data:TCartItem) => {

    try {
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
        const sessionId = ((await cookies()).get('cartSessionId'))?.value;

        const item = cartItemSchema.parse(data);

        //fetch product from DB

        const product = await prisma.product.findUnique({
            where:{id:item.productId}
        });

        if(!product) return {message:"Product not found",success:false};

        const cart = await getMyCart();

        if(!cart){
            const newCart = insertCartSchema.parse({
                userId:userId,
                sessionId:sessionId,
                items:[item],
                ...calcPrice([item]),
               
            });

            await prisma.cart.create({
                data:newCart
            });

            revalidatePath('/product/' + product.slug);
            return {message:`${product.name} added to cart ${product.slug}`,success:true}
        }else{
            //check if product already in cart
            const itemExists = cart.items.find(i => i.productId === item.productId);

            if(itemExists){
                //check stock
                if(itemExists.qty + 1 > product.stock) throw new Error('Product stock limit reached');
                //increace qty
                (cart.items as TCartItem[]).find(i => i.productId === item.productId)!.qty  = itemExists.qty + 1
            }else{
                //check stock
                if(item.qty > product.stock) throw new Error('Product stock limit reached');
                //add new item
             
                cart.items.push(item);
            }

            await prisma.cart.update({
                where: {id:cart.id},
                data: {
                    items : cart.items as Prisma.CartUpdateitemsInput[], 
                    ...calcPrice(cart.items as TCartItem[])
                }
            });
                        revalidatePath('/product/' + product.slug);

             return {message:`${product.name} ${itemExists ? 'quantity increased in cart' : 'added to cart'}`,success:true}
        }


       
    } catch (error) {
        return {message:formatError(error),success:false}
    }
}

export  async function getMyCart(){

    try {
         const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
        const sessionId = ((await cookies()).get('cartSessionId'))?.value ;

        const cart = await prisma.cart.findFirst({
            where : userId ? {userId:userId} : {sessionId:sessionId},
        })

        if(!cart) return undefined;

        return convertToPlainObject({
            ...cart,
            items: cart.items as TCartItem[],
            itemsPrice: cart.itemsPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
            taxPrice: cart.taxPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
        })

    } catch (error) {
     console.log(error)   
    }
}

export const removeItemFromCart = async(productId:string) => {

   try {
     const sessionId = (await cookies()).get('cartSessionId')?.value;

    if(!sessionId) throw new Error('No cart session found');

    const product = await prisma.product.findUnique({
        where:{id:productId}
    });

    if(!product) throw new Error('Product not found');

    const cart = await getMyCart();

    if(!cart) throw new Error('No cart found');

    const item = (cart.items as TCartItem[]).find(i => i.productId === productId);

    if(!item) throw new Error('Item not found in cart');

    if(item.qty === 1){
        //remove item from cart
        cart.items = (cart.items as TCartItem[]).filter(i => i.productId !== productId);
    }else{
        //decrease qty
        (cart.items as TCartItem[]).find(i => i.productId === productId)!.qty = item.qty - 1;
    }

    await prisma.cart.update({
        where: {id:cart.id},
        data: {
            items : cart.items as Prisma.CartUpdateitemsInput[], 
            ...calcPrice(cart.items as TCartItem[])
        }
    });

    revalidatePath('/cart');
    revalidatePath('/product/' + product.slug);
    return {message:`${product.name} ${item.qty === 1 ? 'removed ' : 'quantity decreased '} from cart`,success:true}
   } catch (error) {
    console.log(error)
    return {message:formatError(error),success:false}
   }
}