import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductPrice from "./ProductPrice";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="w-full max-w-sm p-0 rounded-xl hover:shadow-lg transition cursor-pointer">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            className="w-full object-cover rounded-lg"
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className="font-bold tsxt-sm">{product.brand}</h3>
        <Link href={`/product/${product.slug}`}>{product.name}</Link>
        <div className="flex justify-between gap-3">
            <p className="font-lg">Product Rating</p>
            <div className="font-extrabold text-xl">
                {
                    product.stock ? <>
                        <ProductPrice value={product.price} />
                    </> : <span className="text-red-500 line-through">Out of Stock</span>
                }
            </div>
        </div>
        </CardContent>
    </Card>
  );
};

export default ProductCard;
