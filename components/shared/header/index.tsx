import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import { ShoppingCart, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w-full border-b shadow-lg">
      <div className="max-w-7xl p-5 md:px-10 lg:mx-auto">
        <div className="flex justify-between items-center">
          <Link href={'/'} className='flex items-center gap-2'>
          <Image src = '/images/logo.svg' alt='logo' width={48} height={48} />
          <span className="hidden lg:block font-bold text-2xl">{APP_NAME}</span>
        </Link>

        <div className="space-x-1">
          <Button variant='ghost' size='sm'>
            <Link href = '/cart' className='flex items-center'>
            <ShoppingCart className='mr-1' />
            Cart
            </Link>
          </Button>
          <Button variant='ghost' size='sm'>
            <Link href = '/sign-in' className='flex items-center'>
            <UserIcon className='mr-1' />
            Sign In
            </Link>
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Header