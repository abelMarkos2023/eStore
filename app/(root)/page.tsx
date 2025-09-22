import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import {type Metadata } from "next";


export const metadata:Metadata ={
title:{
  template: '%s | Store',
  default: APP_NAME,
},
description: APP_DESCRIPTION
}
export default function Home() {
  return (
   
   <div className="main">
    Home Page
   </div>
  );
}
