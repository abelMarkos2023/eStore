"use server";


import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";

export const getLatestProducts = async() => {
    try {

    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 6
        
    });

    const result = convertToPlainObject(products);

    return result
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