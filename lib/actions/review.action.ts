'use server';

import z from "zod";
import { insertReviewSchema } from "../validator";
import { auth } from "@/auth";
import { formatError } from "../utils";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";


export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {

    try {
        const session = await auth();

        if(!session || !session.user) {
            return { success: false, message: 'Unauthorized' };
        }

        const review = insertReviewSchema.parse({
            ...data,
            userId: session.user.id,
        });

        const reviewExcists = await prisma.review.findFirst({
            where:{
                productId: review.productId,
                userId: review.userId,
            }
        });

        await prisma.$transaction(async (tx) => {
            if(reviewExcists) {
                //update a review
                await tx.review.update({
                    where: {
                        id: reviewExcists.id
                    },
                    data: {
                        rating: review.rating,
                        description: review.description,
                        title: review.title
                    }
                });
            }else{
            //create a review
                await tx.review.create({
                    data: review
                });
            }

            const avgRating = await tx.review.aggregate({
                where: {
                    productId: review.productId
                },
                _avg: {
                    rating: true
                }
            });

            //get number of reviews

            const numReviews = await tx.review.count({
                where: {
                    productId: review.productId
                }
            });

            await tx.product.update({
                where: {
                    id: review.productId
                },
                data: {
                    rating: avgRating._avg.rating || 0,
                    numReviews: numReviews
                }
            });
        });

        revalidatePath(`/product/${data.productId}`);

        return { success: true, message: 'Review submitted successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export const getReviewsByProductId = async (productId: string) => {
    const reviews = await prisma.review.findMany({
        where: {
            productId
        },
        include:{
            user:{
                select: {
                    name: true,
                
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return reviews;
}

export async function getReviewByUserAndProduct({userId, productId}:{userId: string, productId: string}) {
    const review = await prisma.review.findFirst({
        where: {
            userId,
            productId
        },
        include:{
            user:{
                select:{
                    name:true
                }
            }
        }
    });
    return review;
}