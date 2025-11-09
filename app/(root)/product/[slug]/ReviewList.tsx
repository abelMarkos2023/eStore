'use client'

import Link from "next/link"
import ReviewForm from "./ReviewForm"
import { useEffect, useState } from "react"
import { TReview } from "@/lib/types"
import { getReviewsByProductId } from "@/lib/actions/review.action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, UserIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Rating from "@/components/shared/products/rating"

const ReviewList = ({userId,productId,slug}:{userId:string,productId:string,slug:string}) => {

    const [reviews,setReviews] = useState<TReview[]>([]);

    const reloadReview = async() => {
        const productReviews = await getReviewsByProductId(productId);
        setReviews(productReviews)
    }

    useEffect(() => {

        const reloadreviews = async() => {
            const productReviews = await getReviewsByProductId(productId);
            setReviews(productReviews)
        }

        reloadreviews();
    },[productId])
  return (
   <div className="space-y-4">

    {
        userId ? (<ReviewForm productId={productId} userId={userId} onReviewSubmitted={reloadReview} />) : (
            <div>
                please <Link className="px-2 text-blue-600" href={`/auth/signin?callbackUrl=/product/${slug}`}>Sign In</Link> to write a review.
            </div>
        )
    }


    <div className="flex flex-col gap-4">
        {
            reviews.map(review => (
                <Card key={review.id}>
                    <CardHeader>
                        <CardTitle>{review.title}</CardTitle>
                        <CardDescription>{review.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <Rating value={Number(review.rating)} />
                            <div className="flex gap-2">
                                <UserIcon className="h-5 w-5"/>
                            <span>{review.user.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <Calendar className="h-5 w-5"/>
                                <span>{formatDate(review.createdAt)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        }
    </div>
   </div>
  )
}

export default ReviewList