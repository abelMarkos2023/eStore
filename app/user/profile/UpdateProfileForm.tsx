'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/user.action";
import { updateProfileSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const UpdateProfileForm = () => {

    const {data:session,update} = useSession();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues:{
            name:session?.user?.name || '',
            email:session?.user?.email || '',
        }
    });

    const onSubmit = async (data:z.infer<typeof updateProfileSchema>) => {

        const res = await updateProfile(data);
        if(!res.success){
            toast.error(res.message);
            return;
        }
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: data.name,
               
            }
        }

        await update(newSession);
        toast.success(res.message);
        
    }
  return (
    <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit = {form.handleSubmit(onSubmit)}>
            <FormField 
                control={form.control}
                name='email'
                render={({field}) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input disabled {...field} className="input-field" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control}
                name='name'
                render={({field}) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input {...field} className="input-field" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full cursor-pointer" disabled={form.formState.isSubmitting}>
                {
                    form.formState.isSubmitting ? (
                        <span className="flex gap-1 items-center">
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            <span>Updating...</span>
                        </span>
                    ) : (
                        <span className="flex gap-1 items-center">
                            <ArrowRight className="mr-2 h-4 w-4" />
                            <span>Update Profile</span>
                        </span>
                    )
                }
            </Button>
        </form>
    </Form>
  )
}

export default UpdateProfileForm