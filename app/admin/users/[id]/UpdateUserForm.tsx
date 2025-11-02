'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user.action";
import { USER_ROLES } from "@/lib/constants";
import { updateUserSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const UpdateUserForm = ({user}:{user:z.infer<typeof updateUserSchema>}) => {

const router = useRouter();
const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user
})

const submitHandler = async(data:z.infer<typeof updateUserSchema>) => {

    const res = await updateUser({...data,id:user.id});

    if(!res.success){
        toast.error(res.message || 'Something went wrong');
        return
    }
    toast.success(res.message || 'User updated successfully');
    router.push('/admin/users');
    
}
return (
<Form {...form}>
    <form method='POST' onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
        {/* Name */}
        <FormField 
            control = {form.control}
            name = 'name'
            render = {({field}) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

                    {/* Email */}
        <FormField 
            control = {form.control}
            name = 'email'
            render = {({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input disabled = {true} placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        {/* Role */}
        <FormField 
            name="role"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        
                        >
                        <FormControl className="w-full">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                USER_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))
                            }
                            
                        </SelectContent>
                        </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
       <div className="flex">
         <Button type="submit" className="w-full cursor-pointer" disabled={form.formState.isSubmitting}>
            {
                form.formState.isSubmitting ? 'Updating...' : 'Update'
            }
        </Button>
       </div>
    </form>
</Form>
)
}

export default UpdateUserForm