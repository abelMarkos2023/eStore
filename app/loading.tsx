import React from 'react'
import loader from '@/assets/loader.gif'
import Image from 'next/image'

const loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
        <Image src={loader} alt='loader' width={150} height={150}  />
    </div>
  )
}

export default loading