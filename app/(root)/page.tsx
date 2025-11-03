import FeaturedProductCarousel from "@/components/shared/products/FeaturedProductCarousel";
import ProductList from "@/components/shared/products/ProductList";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/product.action";
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
  const featuredProducts = await getFeaturedProducts()

  if(!products) return <p>No Products Found</p>;


  return (
   
   <div className="main">
    {featuredProducts.length > 0 && <FeaturedProductCarousel data={featuredProducts} />}
      <ProductList title="New Arrivals" data = {products} />
   </div>
  );
}
