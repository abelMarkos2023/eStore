import ProductImages from '@/components/shared/products/ProductImages';
import ProductPrice from '@/components/shared/products/ProductPrice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import React from 'react'

const ProductDetail = async({params}:{params:Promise<{slug:string}>}) => {

    const {slug} = await params;

    const product = await getProductBySlug(slug);

    if(!product) return notFound();

  return (
    <>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
                {/* Product Image */}
                <ProductImages images={product.images} />
            </div>
            {/* Product Details */}
            <div className="p-6 md:col-span-2 flex flex-col gap-8">
                <p>{product.brand} {product.category}</p>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-md font-bold">
                    ${product.rating} of {product.numReviews} numReviews
                </p>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <ProductPrice value={Number(product.price)} className='bg-green-100 text-green-700 w-24 rounded-full px-4 py-2'/>
                </div>
                <div className="mt-8">{product.description}</div>
            </div>

            {/* Action */}

            <div className="md:col-span-1">
                <Card>
                <CardContent>
                    <div className="flex justify-between mb-2">
                        <span>Price</span>
                        <ProductPrice value={Number(product.price)} />
                    </div>
                    <div className="flex justify-between mb-4">
                        <span>Status</span>
                        <p>{product.stock > 0 ? <Badge variant = 'outline'>In Stock</Badge>: (<Badge variant='destructive'>Out of Stuck</Badge>)}</p>
                    </div>
                    {
                        product.stock > 0 && (
                            <Button className='w-full cursor-pointer'>
                                Add to Cart
                            </Button>
                        )
                    }
                </CardContent>
            </Card>
            </div>
        </section>
    </>
  )
}

export default ProductDetail