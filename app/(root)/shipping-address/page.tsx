import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import ShippingAddressForm from "@/components/shared/shippingAddress/ShippingAddressForm";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { TShippingAddress } from "@/lib/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Shipping Address",
  description: "Enter your shipping address",
};
const page = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        Your cart is empty. Please add items to your cart before proceeding to
        checkout.
      </div>
    );
  }

  const session = await auth();
  if(!session || !session.user || !session.user.id) return redirect('/auth/signin');
  const userId = session.user.id;

  const user = await getUserById(userId);
  if(!user) return redirect('/auth/signin');


  return(
    <div>
      <CheckoutSteps step={1}/>
        <ShippingAddressForm address={user.address as TShippingAddress} />
    </div>
  );
};

export default page;
