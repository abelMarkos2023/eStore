'use client'

import Link from "next/link"
import ReviewForm from "./ReviewForm"

const ReviewList = ({userId,productId,slug}:{userId:string,productId:string,slug:string}) => {

    console.log('userId,productId,slug',userId,productId,slug)
  return (
   <div className="space-y-4">

    {
        userId ? (<ReviewForm productId={productId} userId={userId} onReviewSubmitted={() => {}} />) : (
            <div>
                please <Link className="px-2 text-blue-600" href={`/auth/signin?callbackUrl=/product/${slug}`}>Sign In</Link> to write a review.
            </div>
        )
    }


    {/* Render list of reviews here */}
   </div>
  )
}

export default ReviewList