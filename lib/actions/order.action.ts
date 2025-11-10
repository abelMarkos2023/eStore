'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { TCartItem, TPaymentResult, TSalesData } from "../types"
import { convertToPlainObject, formatError } from "../utils"
import { auth } from "@/auth"
import { getUserById } from "./user.action"
import { getMyCart } from "./cart.actions"
import { insertOrderSchema } from "../validator"
import { prisma } from "@/db/prisma"
import { paypal } from "../paypal"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

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

export const createPaypalOrder = async (orderId:string) => {

    try {
        const order = await prisma.order.findFirst({where:{id:orderId}});
        if(!order) throw new Error('Order not found');

        const payapalOrderResult = await paypal.createOrder(Number(order.totalPrice));
        await prisma.order.update({where:{id:order.id},data:{
            paymentResult:{
                id:payapalOrderResult.id,
                status:'',
                email_address:'',
                pricePaid:0

            }
        }});
        return {success:true, message:'Paypal order created successfully', data:payapalOrderResult.id};
    } catch (error) {
        
        if(isRedirectError(error)){
            throw error
        }
        return null
    }
}

export const approvePaypalOrder = async(orderId:string,data:{orderID:string}) => {
    
    try {
        //get the order from the database
        const order = await prisma.order.findFirst({where:{id:orderId}});
        if(!order) throw new Error('Order not found');

        //capture the paypal order

        const captureOrderResult = await paypal.capturePayment(data.orderID);

        if(!captureOrderResult || captureOrderResult.status !== 'COMPLETED' || captureOrderResult.id !== (order.paymentResult as TPaymentResult)?.id) throw new Error('Paypal order not found');



        await updateOrderToPaid({orderId,paymentResult:{
            id:captureOrderResult.id,
            status:captureOrderResult.status,
            email_address:captureOrderResult.payer.email_address,
            pricePaid:captureOrderResult.purchase_units[0]?.payments?.captures[0]?.amount?.value
        }});

        revalidatePath(`/order/${orderId}`);
        return {success:true, message:'Paypal order captured successfully', data:captureOrderResult};
    } catch (error) {
        console.log(error)
        return {success:false, message:formatError(error)}
    }
}

export async function updateOrderToPaid({orderId,paymentResult}:{orderId:string,paymentResult?:TPaymentResult}){
    const order = await prisma.order.findFirst(
        {
            where:{id:orderId},
            include:{orderItems:true}
        }
    );
        if(!order) throw new Error('Order not found');

        if(order.isPaid) throw new Error('Order already paid');

        await prisma.$transaction(async (tsx) => {

            for (const item of order.orderItems){
                await tsx.product.update({
                    where:{id:item.productId},
                    data:{stock:{increment:-item.qty}}
                });

            }

            await tsx.order.update({
                where:{id:order.id},
                data:{isPaid:true,paidAt:new Date(),paymentResult}
            })
        });


        const updatedOrder = await prisma.order.findFirst(
            {
                where:{id:orderId},
                include:{orderItems:true,user:{select:{name:true,email:true}}}
            }
        );
        return updatedOrder


}

export const getUsersOrder = async({limit= 5,page=1}:{limit?:number,page?:number}) => {
    const session = await auth();
    if(!session || !session.user || !session.user.id) throw new Error('You must be logged in to get your orders');
    const userId = session.user.id;

    try {
        const data = await prisma.order.findMany({
            where:{userId},
            orderBy:{createdAt:'desc'},
            take:limit,
            skip:(page-1)*limit
        });

        const userOrders = await prisma.order.count({where:{userId}});
        const totalPages = Math.ceil(userOrders/limit);
        return {data,totalPages};


    } catch (error) {
        console.log(error);
    }
}

export const getOrdersSummary = async () => {

    //get resources counts

    const usersData = await prisma.user.count({});
    const ordersData = await prisma.order.count({});
    const productsData = await prisma.product.count({});

    //get total sales

    const totalSales = await prisma.order.aggregate({
        _sum:{totalPrice: true}
    })
    //get total revenue

    const salesDataRaw = await prisma.$queryRaw<Array<{month:string,totalSales: Prisma.Decimal}>>`
    SELECT to_char("createdAt",'MM/YY') as "month",sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt",'MM/YY')`

    const salesData:TSalesData[] = salesDataRaw.map((item) => ({
        month:item.month,
        totalSales: Number(item.totalSales)
    }));

    //get latest sales

    const latestOrders = await prisma.order.findMany({
        orderBy:{createdAt:'desc'},
        include:{user:{select:{name:true,email:true}}},
        take:5
    });

    return {
        usersData,
        ordersData,
        productsData,
        salesData,
        latestOrders,
        totalSales
    }
}

export const getAllOrder = async({limit= 5,page=1,query=''}:{limit?:number,page?:number,query?:string}) => {
    const session = await auth();
    if(!session || !session.user || session.user.role !== 'admin') throw new Error('You must be logged in as admin to get all orders');

    const queryFilter : Prisma.OrderWhereInput = query && query !== '' ? {
        user:{
            name:{
                contains:query,
                 mode:'insensitive'
                } as Prisma.StringFilter,
           
        } 
    } : {};
    
    try {
        const data = await prisma.order.findMany({
            where:{...queryFilter},
            orderBy:{createdAt:'desc'},
            include:{user:{select:{name:true,email:true}}},
            take:limit,
            skip:(page-1)*limit
        });

        
        
        const orders = await prisma.order.count({});
        const totalPages = Math.ceil(orders/limit);
        return {data,totalPages};
    } catch (error) {
        console.log(error);
    }
}

export const DeleteOrderById = async(id:string) => {

    const session = await auth();
    if(!session || !session.user || session.user.role !== 'admin') throw new Error('You must be logged in as admin to delete an order');
    try {
        await prisma.order.delete({where:{id}});
        revalidatePath('/admin/orders');
        return {success:true, message:'Order deleted successfully'};
    } catch (error) {
        console.log(error);
        return {success:false, message:formatError(error)};
    }
}

export const updateCODOrderToPaid = async (orderId:string) => {

   try {
    await updateOrderToPaid({orderId});

    revalidatePath('/admin/orders');
    return {success:true, message:'Order marked as paid successfully'}
   } catch (error) {
    return {success:false, message:formatError(error)}
   }
}

export const updateCODOrderToDelievered = async(orderId:string) => {

    try {
        const order = await prisma.order.findFirst({
            where:{id:orderId}
        });
        if(!order) throw new Error('Order not found');

        await prisma.order.update({
            where:{id:order.id},
            data:{isDelivered:true,deliveredAt:new Date()}
        });
        revalidatePath('/admin/orders');
        return {success:true, message:'Order marked as delievered successfully'}
    } catch (error) {
        return {success:false, message:formatError(error)}
    }
}

//get all products
export const getAllProducts = async({limit= 5,page=1,category,query,sort,rating,price}:{limit?:number,page?:number,category?:string,query?:string,sort?:string,rating?:string,price?:string}) => {

    try {
        const session = await auth();

        if(!session || !session.user || session.user.role !== 'admin') throw new Error('You must be logged in as admin to get all products');

        
        const data = await prisma.product.findMany({
            where:{category:category || undefined, name:{contains:query || undefined}},
            orderBy:{createdAt:'desc'},
            take:limit,
            skip:(page-1)*limit
        });
        const products = await prisma.product.count(
            {
                where:{
                    category:category || undefined, 
                    name:{contains:query || undefined}
                    }
            });
        const totalPages = Math.ceil(products/limit);
        const productList = data.map((product) => ({
            ...product,
            stock:product.stock.toString(),
            banner: product.banner ? product.banner : ''
        }))
        return {data:productList,totalPages};
    } catch (error) {
        console.log(formatError(error));
    }
}

export const deleteProductById = async(id:string) => {

    try {
        const product = await prisma.product.findUnique({where:{id}});
        if(!product) throw new Error('Product not found');
        await prisma.product.delete({where:{id}});
        revalidatePath('/admin/products');
        return {success:true, message:'Product deleted successfully'}
    } catch (error) {
     return {success:false, message:formatError(error)}   
    }
}