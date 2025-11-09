import zod from "zod";
import {z} from "zod";
import { formatDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = zod.string().refine(value => /^\d+(\.\d{2})?$/.test(formatDecimal(Number(value))), "Invalid currency format");

export const insertProductSchema = zod.object({
   
    name: zod.string()
    .min(3, "Product name must be at least 3 characters long")
    .max(255, "Product name must be at most 255 characters long"),
    slug: zod.string()
    .min(3, "Product slug must be at least 3 characters long")
    .max(255, "Product slug must be at most 255 characters long"),
    category: zod.string()
    .min(3, "Product category must be at least 3 characters long")
    .max(255, "Product category must be at most 255 characters long"),
    description: zod.string(),
    images: zod.array(zod.string())
    .min(1, "Product must have at least one image")
    .max(5, "Product can have a maximum of 5 images"),
    brand: zod.string(),
    price: currency,
   stock: zod.string(),
    isFeatured: zod.boolean(),
    banner: zod.string().optional(),
});

export const updateProductSchema = insertProductSchema.extend({
    id: zod.string().min(3, "Product ID must be at least 3 characters long"),
})

export const signInSchema = zod.object({
    email: zod.string().email("Not a valid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
})

export const signUpSchema = zod.object({
    name: zod.string(),
    email: zod.string().email("Not a valid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: zod.string().min(6, "Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const cartItemSchema = zod.object({
    productId: zod.string(),
    name: zod.string().min(3, "Product name must be at least 3 characters long"),
    slug: zod.string().min(3, "Product slug must be at least 3 characters long"),
    image: zod.string().min(3, "Product image must be at least 3 characters long"),
    price: currency,
    qty: zod.number().min(1, "Quantity must be at least 1"),
});

export const insertCartSchema = zod.object({
    items: zod.array(cartItemSchema).min(1, "Cart must have at least one item"),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice:currency,
    totalPrice:currency,
    sessionId: zod.string().min(3, "Session cart id must be at least 3 characters long"),
    userId: zod.string().optional().nullable(),
});

export const shippingAddressSchema = zod.object({
    fullName: zod.string().min(3, "Full name must be at least 3 characters long"),
    address: zod.string().min(3, "Address must be at least 3 characters long"),
    city: zod.string().min(2, "City must be at least 2 characters long"),
    postalCode: zod.string().min(2, "Postal code must be at least 2 characters long"),
    country: zod.string().min(2, "Country must be at least 2 characters long"),
    lat: zod.number().optional(),
    lng: zod.number().optional(),
})


export const paymentMethodSchema = zod.object({
    type:zod.string().min(3, "Payment method must be at least 3 characters long"),
}).refine(data => PAYMENT_METHODS.includes(data.type), {
    message: `Payment method must be one of the following: ${PAYMENT_METHODS.join(', ')}`,
    path: ["type"],
});

export const insertOrderSchema = zod.object({
    userId: zod.string().min(3, "User ID must be at least 3 characters long"),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice:currency,
    totalPrice:currency,
    paymentsMethod:zod.string().refine(data => PAYMENT_METHODS.includes(data), {
        message: "Payment method is not valid",
        path: ["paymentMethod"],
    }),
    shippingAddress: shippingAddressSchema,
})

export const insertOrderItemSchema = zod.object({
    productId: zod.string(),
    name: zod.string().min(3, "Product name must be at least 3 characters long"),
    slug: zod.string().min(3, "Product slug must be at least 3 characters long"),
    image: zod.string().min(3, "Product image must be at least 3 characters long"),
    price: currency,
    qty: zod.number().min(1, "Quantity must be at least 1"),
})

export const paymentResultSchema = zod.object({
    id: zod.string(),
    status: zod.string(),
    pricePaid: zod.string(),
    email_address: zod.string(),
});

export const updateProfileSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters long"),
    email: zod.string().email("Not a valid email address"),
});

export const updateUserSchema = updateProfileSchema.extend({
    id: zod.string().min(3, "User ID must be at least 3 characters long"),
    role: zod.string().min(3, "Role must be at least 3 characters long"),
});

export const insertReviewSchema = z.object({
    productId: z.string().min(3, "Product ID must be at least 3 characters long"),
    userId: z.string().min(3, "User ID must be at least 3 characters long"),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
})