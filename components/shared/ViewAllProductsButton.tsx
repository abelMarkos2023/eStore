import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const ViewAllProductsButton = () => {
  return (
    <div className="flex items-center justify-center my-8">
        <Button className='px-8 py-4 rounded-lg text-lg font-semibold'>
            <Link href = '/search'>View All Products</Link>
        </Button>
    </div>
  )
}

export default ViewAllProductsButton