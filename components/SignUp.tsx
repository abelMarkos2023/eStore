"use client"

import React, { useActionState } from "react";
import { Label } from "./ui/label";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { signUserUp } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";

const SignUp = () => {

  const [data,action] = useActionState(signUserUp,{success:false,message:""});
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const SignUpButton = () => {

    const {pending} = useFormStatus();
    return (
      <Button
        disabled={pending}
        type="submit"
        className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {
          pending ? "Signing up..." : "Sign Up"
        }
      </Button>
    );
  };
  return (
    <div className="max-w-md w-full space-y-8 bg-primary">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary">
          Or{" "}
          <Link
            href="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Signin to your account
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6" action = {action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-4">
            <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-secondary"
            >
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="name"
              
              className="mt-1 appearance-none relative block w-full px-3 py-6 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-secondary"
            >
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="text"
              
              className="mt-1 appearance-none relative block w-full px-3 py-6 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-secondary"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-6 border border-gray-300 placeholder-secondary text-secondary rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>

           <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-secondary"
            >
              Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-6 border border-gray-300 placeholder-secondary text-secondary rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm your password"
            />
          </div>
        </div>

       

        <div>
          <SignUpButton />
        </div>
        {data && !data.success && <p className="text-red-500">{data.message}</p>}
      </form>
    </div>
  );
};

export default SignUp;
