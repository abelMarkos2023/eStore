"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TCart, TCartItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: TCart }) => {
  const [isPending, startTransition] = useTransition();
  const [isRemovePending, startRemoveTransition] = useTransition();
  const router = useRouter();

  const handleRemoveFromCart = async (item: TCartItem) => {
    startRemoveTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error("product did not remove from cart");
        return;
      }
      toast.success(res.message);
      return;
    });
  };
  const handleAddToCart = async (item: TCartItem) => {
    startTransition(async () => {
      const res = await addToCart(item);

      if (!res.message) {
        toast.error("product did not add to cart");
        return;
      }

      toast.success(res.message);

      return;
    });
  };
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Shopping Cart</h1>

      <div className="mt-10">
        {!cart || cart.items.length === 0 ? (
          <div>
            Your cart is empty <Link href={"/"}>Shop Now</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-4">
            <div className="overflow-x-auto md:col-span-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                   <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-1"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="inline-block mr-5"
                          />
                          <span className="ml-2"> {item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="flex justify-center items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRemovePending}
                          className="flex-1 cursor-pointer"
                          onClick={() => handleRemoveFromCart(item)}
                        >
                          {isRemovePending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4 " />
                          )}
                        </Button>
                        <span className="p-2">{item.qty}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="flex-1 cursor-pointer"
                          onClick={() => handleAddToCart(item)}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4 " />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(item.price).toFixed(2)}
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Card >
                <CardContent className="py-0">
                    Items Count ({cart.items.reduce((acc, item) => acc + item.qty, 0)} items)
                    <span className="ml-2">{formatCurrency(cart.totalPrice)}</span>
                    <Button className="w-full mt-4 cursor-pointer" disabled = {isPending}
                    onClick = {() => {
                        startTransition(async() => {
                            router.push('/shipping-address')
                        })
                    }}
                    >
                        {
                            isPending ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <ArrowRight className="w-4 h-4" />
                            )
                            
                        }
                        Proceed to Checkout
                    </Button>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
