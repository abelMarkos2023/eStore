import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from './Menu'

const Header = () => {
  return (
    <div className="w-full border-b shadow-lg">
      <div className="max-w-7xl p-5 md:px-10 lg:mx-auto">
        <div className="flex justify-between items-center">
          <Link href={'/'} className='flex items-center gap-2'>
          <Image src = '/images/logo.svg' alt='logo' width={48} height={48} />
          <span className="hidden lg:block font-bold text-2xl">{APP_NAME}</span>
        </Link>

          
          <Menu />
        </div>
        </div>
      </div>
  )
}

export default Header