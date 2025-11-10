"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { APP_URL } from "@/lib/constants";


const StripePayment = ({
  stripeSecret,
  priceInCent,
  orderId,
}: {
  stripeSecret: string;
  priceInCent: number;
  orderId: string;
}) => {
  const { theme, systemTheme } = useTheme();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e:FormEvent) => {

        e.preventDefault();
        if(!stripe || !elements || errorMessage) {
            return;
        }
        setIsLoading(true);
        stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${APP_URL}/order/${orderId}/stripe-payment-success`,
        }
    }
     ).then((result) => {
            if(result.error) {
                setErrorMessage(result.error.message || "An unexpected error occured");
            }
        }).finally(() => setIsLoading(false));
    }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
                {errorMessage}
            </div>
        )}
        <PaymentElement />
        {/* <div>
            <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email || "")} />
        </div> */}
        <Button disabled={!stripe || !elements || isLoading} className="w-full mt-4">
            {isLoading ? "Processing..." : `Pay ${formatCurrency(priceInCent / 100)}Now` }
        </Button>
    </form>
  );
};
  return (
    <Elements
      options={{
        clientSecret: stripeSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
              ? "stripe"
              : systemTheme === "dark"
              ? "night"
              : "stripe",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  );
};

export default StripePayment;
