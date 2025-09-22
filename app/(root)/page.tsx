import ProductList from "@/components/shared/products/ProductList";
import sampleData from "@/db/sample-data";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import {type Metadata } from "next";


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const metadata:Metadata ={
title:{
  template: '%s | Store',
  default: APP_NAME,
},
description: APP_DESCRIPTION
}
export default async function Home() {

  await delay(1000);
  return (
   
   <div className="main">
      <ProductList title="New Arrivals" data = {sampleData.products} />
   </div>
  );
}
