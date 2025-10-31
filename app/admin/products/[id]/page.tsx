import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import React from 'react'

const UpdatePage = async({params}:{params:Promise<{id:string}>}) => {

    const {id} = await params;

    const product = await getProductById(id);

    if(!product) return notFound();
  return (
    <div className="space-y-8">
        <h1 className="text-2xl font-bold">Update Product</h1>
        <ProductForm type='Update' product={product} productId={id} />
    </div>
  )
}

export default UpdatePage