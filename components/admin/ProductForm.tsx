'use client'

import { productDefaultValues } from "@/lib/constants";
import { ProductType } from "@/lib/types";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"
import { ControllerRenderProps, useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import slugify from "slugify";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Checkbox } from "../ui/checkbox";

const ProductForm = ({type,product,productId}:{type:'Update' | 'Create',product?:ProductType,productId?:string}) => {

const router = useRouter();
const schema = type === 'Update' ? updateProductSchema : insertProductSchema;


const form = useForm({
resolver: zodResolver(schema),
defaultValues: product && type === 'Update' ? product : productDefaultValues
});

// const form = useForm({
//     resolver : type === 'Create' ? zodResolver(insertProductSchema) : zodResolver(updateProductSchema),
//     defaultValues: product && type === 'Update' ? product : productDefaultValues
// })

const submitHandler = async(values: z.infer<typeof schema>) => {

console.log('submitting')

if(type === 'Create') {
    const res = await createProduct(values);
    if(!res.success) {
        toast.error(res.message || 'Something went wrong');
        router.push('/admin/products');
        return
    }
        toast.success(res.message || 'Product created successfully and will be available for sale soon');
        router.push('/admin/products');
        return
}

if(type === 'Update') {
    const res = await updateProduct({...values, id: productId!});
    if(!res.success) {
        toast.error(res.message || 'Something went wrong');

        return
    }
        toast.success(res.message || 'Product updated successfully and will be available for sale soon');
        router.push('/admin/products');
        return
}
}

const images = form.watch('images');
const isFeatured = form.watch('isFeatured');
const banner = form.watch('banner');
return (
<Form {...form}>
<form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
    <div className="flex flex-col md:flex-row gap-5 md:justify-between items-start">
        {/* Name */}

            <FormField 
                control={form.control}
                name="name"
                render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "name">}) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        {/* Slug */}
        <FormField 
            control = {form.control}
            name="slug"
            render = {({field}:{field:ControllerRenderProps<z.infer<typeof schema>, "slug">}) => (
                <FormItem className="w-full">
                    <FormLabel>
                        Slug
                    </FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input placeholder="Product slug" {...field} />
                            <Button type="button" className="mt-2 cursor-pointer"
                            onClick = {() => form.setValue('slug', slugify(form.getValues('name'),{lower: true}))}
                            >Generate</Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </div>
    
    <div className="flex flex-col md:flex-row gap-5 md:justify-between">
        {/* Price */}
            <FormField 
                control={form.control}
                name="price"
                render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "price">}) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Price
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Product price" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        {/* Stock */}

            <FormField 
                control={form.control}
                name="stock"
                render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "stock">}) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Stock
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Product stock" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
    </div>

    <div className="flex flex-col md:flex-row gap-5 md:justify-between">
        {/* Description */}

            <FormField 
                control={form.control}
                name="description"
                render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "description">}) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Description
                        </FormLabel>
                        <FormControl>
                            <Textarea placeholder="Product description" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
    </div>
        <div className="flex flex-col md:flex-row gap-5 md:justify-between">
        {/* Price */}
            <FormField 
                control={form.control}
                name="category"
                render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "category">}) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Category
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Product Category" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        {/* Stock */}

            <FormField 
                control={form.control}
                name="brand"
                render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "brand">}) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Brand
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Product Brand" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
    </div>
    <div className="flex flex-col md:flex-row gap-5 md:justify-between">
        {/* Image Upload */}

            <FormField 
                control={form.control}
                name="images"
                render = {() => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Images
                        </FormLabel>
                        <Card>
                            <CardContent className="space-y-2 mt-2">
                    
                                <div className="flex items-start space-x-2">
                                {
                                    images.map((image) => (
                                        <div key={image} className="relative w-24 h-24">
                                            <Image src={image || '/default.jpg'} alt="product" fill className="object-cover" />
                                        </div>
                                    ))
                                }
                            <FormControl>
                                <UploadButton endpoint="imageUploader" onClientUploadComplete={(res) => {
                                    // Do something with the response
                                    if(res){
                                        form.setValue('images', [...images, res[0].ufsUrl]);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    // Do something with the error.
                                    toast.error(`ERROR! ${error.message}`);
                                }}
                                />
                            </FormControl>
                            <FormMessage />

                                </div>
                            

                            </CardContent>
                        </Card>
                        
                    </FormItem>
                )}
            />

    </div>
    <div className="flex flex-col md:flex-row gap-5 md:justify-between">
        {/* isFeatured */}

      <Card className="w-full">
        <CardContent className="space-y-2 mt-2 flex flex-col w-full gap-4">
              <FormField 
            control = {form.control}
            name='isFeatured'
            render = {({field}:{field: ControllerRenderProps<z.infer<typeof schema>, "isFeatured">}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            Featured
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                            This product will appear on the home page
                        </p>
                    </div>
                </FormItem>
            )}
        />

        {
            isFeatured && banner && (
                <Image src={banner} alt="banner" width={1000} height={1000} className="w-full h-60 md:h-96 object-cover rounded-lg" />
            )
        }
        {
            isFeatured && !banner && (
                <UploadButton endpoint="imageUploader" onClientUploadComplete={(res) => {
                    form.setValue('banner', res[0].ufsUrl);
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    toast.error(`ERROR! ${error.message}`);
                }}
                />
            )
        }
        </CardContent>
      </Card>
    </div>

    <Button type="submit" disabled={form.formState.isSubmitting}>
        { 
        form.formState.isSubmitting ? "Submitting..." : `${type} Product`
        } 
        </Button>
</form>
</Form>
)
}

export default ProductForm