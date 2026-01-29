import ProductCard from '@/components/shared/products/ProductCard';
import { Button } from '@/components/ui/button';
import { getAllCategories, getAllProducts } from '@/lib/actions/product.action';
import { ProductType } from '@/lib/types';
import Link from 'next/link';
import React from 'react'


const prices = [
    {
        name : "$1 to $50",
        value:"1-50"
    },
    {
        name : "$51 to $200",
        value:"51-200"
    },
    {
        name : "$201 to $400",
        value:"201-400"
    },
    {
        name : "$401 to $600",
        value:"401-600"
    },
    {
        name : "$601 to $800",
        value:"601-800"
    },
    {
        name : "$801 to $1000",
        value:"801-1000"
    },
];

const ratings = [
    '1',
    '2',
    '3',
    '4'
]

const sortingList = ['newest','highest','rating','lowest']
const SearchPage = async ({searchParams}:{ searchParams:Promise<{ q?:string; category?:string; price?:string; rating?:string;sort?:string;
page?:string;}>}) => {
    const { q = 'all', category = 'all', price = 'all', rating = 'all', sort = 'newest', page = '1'} = await searchParams;
   const generateURL = ({c,p,s,r,pg}:{c?:string,p?:string,s?:string,r?:string,pg?:string}) => {
  const params  = { q,category,price,rating,sort, page};

        if(c) params.category = c;
        if(p) params.price = p;
        if(s) params.sort = s;
        if(r) params.rating = r;
        if(pg) params.page = pg;

        return `/search?${new URLSearchParams(params).toString()}`

    }

    const categories = await getAllCategories()

    const products = await getAllProducts({limit: 10, page: Number(page), category, sort, price, rating, query: q});

    console.log('products',products)

    if(!products) {
        return <p className='text-center'>No Products Found</p>
    }
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
        <div className="filter-links space-y-4">
            {/* Category Filter  */}
            <div className="category">
                <div className="text-xl font-bold mt-2">Department</div>
                <div>
                    <ul className='space-y-3'>
                        <li>
                            <Link className={`${category === 'all' || category === '' ? 'font-bold' : ''}`} href={generateURL({c:'all'})}>All</Link>
                        </li>
                        {
                            categories.map((cat) => (
                                <li key={cat.category}>
                                    <Link className={`${cat.category === category ? 'font-bold text-lg' : ''}`} href={generateURL({c:cat.category})}>
                                    {cat.category} ({cat._count})
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            {/* Price Filter */}
            <div className="price">
                <div className="text-2xl font-bold mt-3">Price Range</div>
                <div>
                    <ul className="space-y-3">
                        <li>
                            <Link className={`${price === 'all' ? 'font-bold text-lg' : ''}`} href={generateURL({p:'all'})}>All</Link>
                        </li>
                        {
                            prices.map((p) => (
                                <li key={p.value}>
                                    <Link className={`${p.value === price ? 'font-bold' : ''}`} href={generateURL({p:p.value})}>
                                    {p.name}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            {/* Rating Filter */}
            <div className="price">
                <div className="text-2xl font-bold mt-3">Customer Reviews</div>
                <div>
                    <ul className="space-y-3">
                        <li>
                            <Link className={`${price === 'all' ? 'font-bold text-lg' : ''}`} href={generateURL({r:'all'})}>All</Link>
                        </li>
                        {
                            ratings.map((r) => (
                                <li key={r}>
                                    <Link className={`${r === rating ? 'font-bold text-xl' : ''}`} href={generateURL({r})}>
                                    {`${r} ${r === '1' ?'star':'stars'} & above`}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
        <div className="md:col-span-4 space-y-4">
            <div className="flex flex-col my-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-2">
                        {
                            q !== 'all' && q !=='' && (
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Query:</span> 
                                    <span className="font-extabold text-sm">{q}</span>
                                </div>
                            )
                        }
                        {
                            category !== 'all' && category !=='' && (
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Category:</span> 
                                    <span className="font-extabold text-sm">{category}</span>
                                </div>
                            )
                        }
                        {
                            price !== 'all' && price !=='' && (
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Price:</span> 
                                    <span className="font-extabold text-sm ">{price}</span>
                                </div>
                            )
                        }
                        {
                            rating !== 'all' && rating !=='' && (
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Rating:</span> 
                                    <span className="font-extabold text-sm">{rating}</span>
                                </div>
                            )
                        }
                        {
                            (q !== 'all' && q !== '') ||
                            (category !== 'all' && category !== '') ||
                            price !== 'all' || rating !== 'all' ? (
                                <Button variant='link' asChild>
                                    <Link href='/search'>Clear Filters</Link>
                                </Button>
                            ) : null
                        }
                    </div>
                    <div className="flex gap-2">
                        {
                            sortingList.map((s) => (
                                <Link key={s} href={generateURL({s})} className={`cursor-pointer ${s === sort ? 'font-bold' : ''}`}>{s}</Link>
                            ))
                        }
                    </div>
                </div>
            <div className="grid md:grid-cols-3 md:gap-4">
                
                {products?.data?.length && products?.data?.length > 0 ? products.data.map((product:ProductType) => (
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