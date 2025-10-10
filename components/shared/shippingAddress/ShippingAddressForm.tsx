'use client'

import { TShippingAddress } from "@/lib/types"
import {zodResolver} from '@hookform/resolvers/zod'
import { shippingAddressSchema } from "@/lib/validator"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { shippingAddressDefaultValues } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader } from "lucide-react"
import z from "zod"
import { updateUserAddress } from "@/lib/actions/user.action"
import { toast } from "sonner"

const ShippingAddressForm = ({address}:{address: TShippingAddress}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues:address || shippingAddressDefaultValues
  });

  const handleFormSubmit : SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values: z.infer<typeof shippingAddressSchema>) => {
    startTransition(async() => {
      const res = await updateUserAddress(values);

      if(!res.success){
        toast.error(res.message || 'Something went wrong');
        return
      }

      toast.success(res.message || 'Address updated successfully');
      router.push('/payment')
    })

  }
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl text-center font-extrabold">
        fill in your shipping address to proceed to payment page  
      </h2>
      <p className="text-xs text-muted-foreground">
        This is just a one time step, if you are signed in then  you would not need to
        enter your shipping address again.
      </p>
      <Form {...form}>
        <form method = 'post' onSubmit ={form.handleSubmit(handleFormSubmit)} className="my-8 space-y-4">
        <FormField 
          control={form.control}
          name = 'fullName'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'fullName'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 ">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            </div>
          )}
        />
        <FormField 
          control={form.control}
          name = 'address'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'address'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 ">Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your street address" {...field} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
            </div>
          )}
        />

        <FormField 
          control={form.control}
          name = 'city'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'city'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 ">City</FormLabel>
              <FormControl>
                <Input placeholder="New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>

            </div>
          )}
        />
        <FormField 
          control={form.control}
          name = 'postalCode'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'postalCode'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 ">Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="09987" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            </div>
          )}
        />

        <FormField 
          control={form.control}
          name = 'country'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'country'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 ">Country</FormLabel>
              <FormControl>
                <Input placeholder="USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            </div>
          )}
        />

        <FormField 
          control={form.control}
          name = 'lat'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'lat'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 "> Lat</FormLabel>
              <FormControl>
                <Input placeholder="09987" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            </div>
          )}
        />

         <FormField 
          control={form.control}
          name = 'lng'

          render = {({field}:{field:ControllerRenderProps<z.infer<typeof shippingAddressSchema>,'lng'>}) => (
            <div className="">
              <FormItem className="flex flex-col gap-2 w-full">
              <FormLabel className="text-md font-bold block flex-1 ">Lng</FormLabel>
              <FormControl>
                <Input placeholder="8763454" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            </div>
          )}
        />
        <div className="flex gap-2">
          <Button className="w-full cursor-pointer">
            {
              isPending ? (<Loader className="mr-2 h-4 w-4 animate-spin" />) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )
            } Continue
          </Button>
        </div>
        </form>
        </Form>
    </div>
  )
}

export default ShippingAddressForm