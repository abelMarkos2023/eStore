import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 w-[50vw]  items-center">
            <Image src = '/images/logo.svg' alt='logo' width={150} height={150} />
            <div className="p-6 rounded-lg shadow-xl w-1/2 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-lg mb-4">The page you are looking for does not exist.</p>
                <Button asChild>
                    <Link href={'/'}>Go to Home</Link>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default NotFound