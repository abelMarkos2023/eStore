import zod from "zod";
import { formatDecimal } from "./utils";

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
   stock: zod.number(),
    isFeatured: zod.boolean(),
    banner: zod.string().nullable(),
});

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
})