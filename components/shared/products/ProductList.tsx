import React from 'react'
import ProductCard from './ProductCard'
import {type ProductType } from '@/lib/types'

//es-
const ProductList = ({data,title}:{data:ProductType[],title:string}) => {
  return (
    <div className="my-10">
        <h2 className="text-2xl font-bold mb-5">{title}</h2>
        {
            data.length === 0 ? <p>No Products Found</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((product:ProductType) => (
                    <ProductCard key={product.slug} product={product} />
                )
                )}
                </div>
            )
        }
  
    </div>
  )
}

export default ProductList