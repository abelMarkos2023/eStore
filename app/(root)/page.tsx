import ProductList from "@/components/shared/products/ProductList";
import { getLatestProducts } from "@/lib/actions/product.action";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import {type Metadata } from "next";
import Image from "next/image";


// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const metadata:Metadata ={
title:{
  template: '%s | Store',
  default: APP_NAME,
},
description: APP_DESCRIPTION
}
export default async function Home() {

  const products = await getLatestProducts();

  if(!products) return <p>No Products Found</p>;


  return (
   
   <div className="main">
    <Image src="/images/banner-2.jpg" alt="Store Hero" width={1200} height={300} className="w-full h-60 md:h-96 object-cover rounded-lg"/>
      <ProductList title="New Arrivals" data = {products} />
   </div>
  );
}
