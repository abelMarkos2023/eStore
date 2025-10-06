"use client"

import React, { useActionState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { signUserIn } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";

const SignIn = () => {

  const [data,action] = useActionState(signUserIn,{success:false,message:""});
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const SignInButton = () => {

    const {pending} = useFormStatus();
    return (
      <Button
        disabled={pending}
        type="submit"
        className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {
          pending ? "Signing in..." : "Sign in"
        }
      </Button>
    );
  };
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary">
          Or{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6" action = {action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-4">
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
              type="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-6 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
              autoComplete="email"
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-secondary"
            >
              Remember me
            </Label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot yourpassword?
            </Link>
          </div>
        </div>

        <div>
          <SignInButton />
        </div>
        {data && !data.success && <p className="text-red-500">{data.message}</p>}
      </form>
    </div>
  );
};

export default SignIn;
