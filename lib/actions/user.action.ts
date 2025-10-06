'use server'

import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signInSchema, signUpSchema } from "../validator";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

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

export const signOutUser = async() => await signOut()