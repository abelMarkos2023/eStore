import { APP_NAME } from '@/lib/constants';
import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="p-5 border-b shadow-lg">
        <p className="text-center text-lg font-semibold">© {currentYear} Store. All rights reserved {APP_NAME}</p>
    </footer>
  )
}

export default Footer