import ProductForm from '@/components/admin/ProductForm'
import React from 'react'

const CreateProductPage = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold">Create Products</h1>
        <div className="my-8">
            <ProductForm  type='Create' />
        </div>
    </div>
  )
}

export default CreateProductPage