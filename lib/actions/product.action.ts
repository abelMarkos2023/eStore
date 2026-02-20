"use server";


import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import z from "zod";
import {insertProductSchema, updateProductSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export const getAllProducts = async({limit= 5,page=1,category,query,sort,rating,price}:{limit?:number,page?:number,category?:string,query?:string,sort?:string,rating?:string,price?:string}) => {

    const queryFilter : Prisma.ProductWhereInput = query && query !== 'all' ? {
        name:{
            contains:query,
             mode:'insensitive'
            } as Prisma.StringFilter,
    } 
    : {};

    const categoryFilter : Prisma.ProductWhereInput = category && category !== 'all' ? {
        category
    } 
    : {};

    const priceFilter: Prisma.ProductWhereInput = price && price !== 'all' ? {
        price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1])
        }
    }
    : {};

    const ratingFilter: Prisma.ProductWhereInput = rating && rating !== 'all' ? {
        rating: {
           gte: Number(rating),
        }
    }
    : {};
    

    try {
        //const session = await auth();

       // if(!session || !session.user || session.user.role !== 'admin') throw new Error('You must be logged in as admin to get all products');

        
        const data = await prisma.product.findMany({
           where:{...queryFilter,...categoryFilter,...priceFilter,...ratingFilter},
            orderBy: sort === 'lowest' ? {price:'asc'} : sort === 'highest' ? {price:'desc'} : 
            sort === 'rating' ? {rating:'desc'} : {createdAt:'desc'},
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

export async function getAllCategories(){

    const data = await prisma.product.groupBy({
        by:['category'],
        _count: true
    });

    return data;
}

export async function getFeaturedProducts(){
    const data = await prisma.product.findMany({
        where:{
            isFeatured: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 6
    
    
    })

    const products =  convertToPlainObject(data);
    const convertedProducts = products.map((product) => ({...product,stock:product.stock.toString(), banner: product.banner ? product.banner : ''}));

    return convertedProducts
}