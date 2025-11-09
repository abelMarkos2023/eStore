'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createUpdateReview, getReviewByUserAndProduct } from "@/lib/actions/review.action";
import { TReview } from "@/lib/types";
import { insertReviewSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ReviewForm = ({productId,userId,onReviewSubmitted}:{productId:string,userId:string,onReviewSubmitted:()=>void}) => {

const [open,setOpen] = useState(false);
const [reviews,setReviews] = useState<TReview>();
const form = useForm({
    resolver: zodResolver(insertReviewSchema),
    defaultValues:reviews|| {
        rating: 1,
        title: '',
        description: '',
        productId,
        userId
    }
});



const handleFormOpen = async () => {

    const review = await getReviewByUserAndProduct({userId,productId});

    form.setValue('rating',review?.rating||1);
    form.setValue('title',review?.title||'');
    form.setValue('description',review?.description||'');
    setOpen(true);
}

const handleFormSubmit = async (data: z.infer<typeof insertReviewSchema>) => {

    const res = await createUpdateReview({
        ...data,
        productId,
    });

    if(!res.success){

        toast.error(res.message);
        return;
    }

    toast.success(res.message);
    setOpen(false);
    onReviewSubmitted();
}
return (
<Dialog open={open} onOpenChange={setOpen}>
    <Button onClick={handleFormOpen}>Write a Review</Button>
    <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
            <form method='POST' onSubmit={form.handleSubmit(handleFormSubmit)}>
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>Share your experience with this product</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                    <FormField 
                        control={form.control}
                        name='title'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Review Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name='description'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Review Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name='rating'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select onValueChange={field.onChange} value={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a rating" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Array.from({length:5}).map((_,index) => (
                                                <SelectItem key={index+1} value={String(index+1)}>
                                                    {index+1} <StarIcon className="inline h-4 w-4" />
                                                    </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter className="mt-4">
                    <Button className="w-full cursor-pointer" type="submit" disabled={form.formState.isSubmitting}>
                        {
                            form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'
                        }
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    </DialogContent>
</Dialog>
)
}

export default ReviewForm