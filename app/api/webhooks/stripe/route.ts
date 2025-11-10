import { updateOrderToPaid } from "@/lib/actions/order.action";
import { NextRequest,NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request:NextRequest){
    const event = await Stripe.webhooks.constructEvent(
        await request.text(),
        request.headers.get("Stripe-Signature") as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
    );

    //check the payment status

if(event.type === "charge.succeeded"){

    //update order status to paid
    await updateOrderToPaid({
        orderId:event.data.object.metadata.order_id,
        paymentResult:{
            id:event.data.object.id,
            status:'COMPLETED',
            email_address:event.data.object.billing_details.email!,
            pricePaid:String((event.data.object.amount * 100).toFixed())
        }
    });

    return NextResponse.json({message:"Order payment status updated to paid"}, {status:200});
}

return NextResponse.json({message:"Event type not handled"}, {status:401});
        
}