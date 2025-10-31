"use server";


import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import z from "zod";
import { insertCartSchema, insertProductSchema, updateProductSchema } from "../validator";
import { revalidatePath } from "next/cache";

export const getLatestProducts = async() => {
    try {

    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 6
        
    });

    const result = convertToPlainObject(products);
    const data = result.map((product) => ({...product, banner: product.banner ? product.banner : '' ,stock: product.stock.toString()}));

    return data 
    } catch (error) {
        console.log(error);
    }
}

//fetching products by slug
export const getProductBySlug = async(slug:string) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug
            }
        })
        return product;
    } catch (error) {
        console.log(error);
    }
}

export const createProduct = async(data: z.infer<typeof insertProductSchema>) => {

    try {
        const product = insertProductSchema.parse(data);

        await prisma.product.create({
            data: {
                ...product,
                stock: Number(product.stock)
            }
        });

        return {success: true, message: "Product created successfully"}
    } catch (error) {
        return {success: false, message: formatError(error)}
    }
}

export const updateProduct = async(data: z.infer<typeof updateProductSchema>) => {

    try {
        const safeData = updateProductSchema.parse(data);

        const product = await prisma.product.findUnique({
            where: {
                id: safeData.id
            }
        });

        if(!product) throw new Error('Product not found');

        await prisma.product.update({
            where: {
                id: safeData.id
            },
            data: {
                ...safeData,
                stock: Number(safeData.stock)
            }
        });

        revalidatePath('/admin/products');
        return {success: true, message: "Product updated successfully"}
    } catch (error) {
        return {success: false, message: formatError(error)}
    }
}

export const getProductById = async(id:string) =>{

    const product = await prisma.product.findUnique({
        where: {
            id
        }
    });
    if(!product) throw new Error('Product not found');
    return convertToPlainObject({
        ...product,
        stock: String(product.stock),
        banner: product.banner ? product.banner : ''
    })
}