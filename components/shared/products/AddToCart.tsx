"use client";

import { Button } from "@/components/ui/button";
import { addToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { TCart, TCartItem } from "@/lib/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ item, cart }: { item: TCartItem; cart?: TCart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const exists =
    cart && cart?.items?.find((i) => i.productId === item.productId);
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addToCart(item);

      if (!res.message) {
        toast("product did not add to cart", {
          description: res.message,
          action: (
            <Button
              className="w-full cursor-pointer"
              onClick={() => toast.dismiss()}
            >
              Close
            </Button>
          ),
        });
        return;
      }

      toast(res.message, {
        description: "click on the button to view your cart",
        action: {
          label: "View Cart",
          onClick: () => {
            router.push("/cart");
          },
        },
      });

      return;
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast("product did not remove from cart", {
          description: res.message,
          action: (
            <Button
              className="w-full cursor-pointer "
              onClick={() => toast.dismiss()}
            >
              Close
            </Button>
          ),
        });
        return;
      }
      toast(res.message, {
        description: "click on the button to view your cart",
        action: {
          label: "View Cart",
          onClick: () => {
            router.push("/cart");
          },
        },
      });
    });
  };
  return exists ? (
    <div className="flex items-center gap-2 justify-center">
      <Button onClick={handleRemoveFromCart} className="cursor-pointer flex-1">
        {isPending ? (<Loader className="w-4 h-4 animate-spin" />) : <Minus className="w-4 h-4" />}
      </Button>
      <span className="px-2">
        {exists.qty}
      </span>
      <Button onClick={handleAddToCart} className="cursor-pointer flex-1">
        {isPending ? (<Loader className="w-4 h-4 animate-spin" />) : <Plus className="w-4 h-4" />}
      </Button>
    </div>
  ) : (
    <Button className="w-full cursor-pointer" onClick={handleAddToCart}>
      <Plus className="w-4 h-4" />
      AddToCart
    </Button>
  );
};

export default AddToCart;
