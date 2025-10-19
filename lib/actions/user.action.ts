'use server'

import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { paymentMethodSchema, shippingAddressSchema, signInSchema, signUpSchema } from "../validator";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { TShippingAddress } from "../types";
import z from "zod";

export const signUserUp = async(prevState:unknown,formData:FormData) => {

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

 

    try {
           const user = signUpSchema.parse({ name, email, password, confirmPassword });

          user.password = hashSync(password,6);
          const newUser = await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                password:user.password,
                role:"user",
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                  },
                  paymentMethod: '',
                  emailVerfied:new Date(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
            }
        });
        console.log(newUser)

        await signIn('credentials', {email,password});

        return {success:true,message:"You've signed up successfully "}
    } catch (error) {
     if(isRedirectError(error)){
            throw error
        }
        
        
        return { success: false,message:formatError(error)}   
    }
}

export const getUserById = async(id:string) => {

    try {
        const user = await prisma.user.findFirst({
            where:{id}
        });
        if(!user) throw new Error('User not found');
        return user;
    } catch (error) {
        console.log(error)
        
    }
}

export const updateUserAddress = async (address:TShippingAddress) => {

    try {
        const session = await auth();
        if(!session || !session.user || !session.user.email) throw new Error('You must be logged in to update your address');

        const user = await getUserById(session.user.id);
        if(!user) throw new Error('User not found');

        const addressData = shippingAddressSchema.parse(address);

        await prisma.user.update({
            where:{id:user.id},
            data:{address:addressData}
        })

        return {success:true,message:"Address updated successfully"}
        
    } catch (error) {
        return { success: false,message:formatError(error)}
    }
}

export const signUserIn = async(prevState:unknown,formData:FormData) => {

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user =  signInSchema.parse({ email, password })

    try {
        await signIn('credentials', user);

        return {success:true,message:"You've successfully logged in"}
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
        return { success: false,message:'Invalid Email or Password'}
    }
}


export const updateUserPaymentMethod = async(data: z.infer<typeof paymentMethodSchema>) => {
try {

    const session = await auth();
    if(!session || !session.user || !session.user.email) throw new Error('You must be logged in to update your payment method');

    const user = await getUserById(session.user.id);
    if(!user) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
        where:{id:user.id},
        data:{paymentMethod:paymentMethod.type}
    })
    return {success:true,message:"Payment method updated successfully"}
    
} catch (error) {
    return { success: false,message:formatError(error)}
}
}

export const signOutUser = async() => await signOut()