import z from "zod";
import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, paymentResultSchema, shippingAddressSchema } from "./validator";

export type ProductType = z.infer<typeof insertProductSchema> & {
    id: string,
    rating: string,
    numReviews: number,
    createdAt: Date,
};

export type TCart = z.infer<typeof insertCartSchema>;
export type TCartItem = z.infer<typeof cartItemSchema>;
export type TShippingAddress = z.infer<typeof shippingAddressSchema>;

export type TOrderItem = z.infer<typeof insertOrderItemSchema>

export type Torder = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date | null;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItems: TOrderItem[];
    user:{name:string;email:string};
}


export type TPaymentResult = z.infer<typeof paymentResultSchema>