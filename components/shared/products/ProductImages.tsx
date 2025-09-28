'use client'

import Image from 'next/image'
import React, { useState } from 'react'

const ProductImages = ({images}:{images:string[]}) => {

    const [current,setCurrent] = useState(0)
  return (
    <div className='flex flex-col gap-4'>
       <div className="group overflow-hidden rounded-lg">
         <Image 
            src={images[current]} 
            alt='product' 
            width={1000} 
            height={1000} 
            className='min-h-[300px] object-cover object-center group-hover:scale-110 transform transition-transform duration-300' />
       </div>

        <div className="flex gap-2 w-full">
            {
                images.map((image,index) => (
                    <Image 
                        src={image}
                         alt='product' 
                         key={image} 
                         width={100} 
                         height={100} 
                         className={`min-h-[100px] ${index === current && 'border-4 border-green-500'} object-cover object-center cursor-pointer`} 
                         onClick={() => setCurrent(index)} />
                ))
            }
        </div>
    </div>
  )
}

export default ProductImages