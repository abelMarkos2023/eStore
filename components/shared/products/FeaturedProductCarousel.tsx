'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ProductType } from '@/lib/types'
import React from 'react';
import AutoPlay from "embla-carousel-autoplay";
import Link from 'next/link';
import Image from 'next/image';

const FeaturedProductCarousel = ({data}:{data:ProductType[]}) => {

    
  return (
    <Carousel className='w-full mb-12' opts={{ 
        loop:true
     }}
     plugins={[AutoPlay({ delay: 3000, stopOnInteraction:true,stopOnMouseEnter: true })]}
     >
        <CarouselContent className='rounded-lg'>
            {
                data.map((product:ProductType) => (
                    <CarouselItem key={product.id}>
                        <Link href={`/product/${product.slug}`}>
                            <div className="relative">
                                <Image src={product.banner!} alt={product.name} width={0} height={0} sizes="100vw" className='h-auto w-full object-cover object-center group-hover:scale-110 transform transition-transform duration-300 roinded-lg' />
                                <div className="absolute inset-0 flex items-end justify-center">
                                    <h3 className="text-white bg-gray-900 opacity-70 px-4 py-2 text-3xl font-bold">{product.name}

                                    </h3>
                                </div>
                            </div>
                        </Link>
                    </CarouselItem>
                ))
            }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
     </Carousel>
  )
}

export default FeaturedProductCarousel