import ProductCard from '@/components/shared/products/ProductCard';
import { getAllProducts } from '@/lib/actions/product.action';
import { ProductType } from '@/lib/types';
import React from 'react'

const SearchPage = async ({searchParams}:{
    searchParams:Promise<{
        q?:string;
        category?:string;
        price?:string;
        rating?:string;
        sort?:string;
        page?:string;
    }>
}) => {
    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
        sort = 'newest',
        page = '1'
    } = await searchParams

    const products = await getAllProducts({limit: 10, page: Number(page), category, sort, price, rating, query: q});

    console.log(products)
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
        <div className="filter-links">
            {/* Filter Links */}
        </div>
        <div className="md:col-span-4 space-y-4">

            <div className="grid md:grid-cols-3 md:gap-4">
                {products!.data.length > 0 ? products!.data.map((product:ProductType) => (
                    <ProductCard key={product.slug} product={product} /> 
                ))
            :(
                <p>No Products Found</p>)
            }
            </div>
            {/* Product List */}
        </div>
    </div>
  )
}

export default SearchPage