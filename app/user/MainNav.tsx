'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react';

const routes = [
    {
        href: "/user/profile",
        label: "Profile",
    },
    {
        href: "/user/orders",
        label: "Orders",
    },
];

const MainNav = ({className, ...props}: React.HTMLAttributes<HTMLElement>) => {

    const pathname = usePathname();
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        {
            routes.map((route) => (
               <Link
                key={route.href}
                href={route.href}
                className={cn(
                    'font-medium text-sm transition-colors hover:text-primary',
                    pathname.includes(route.href) ? "text-primary" : "text-muted-foreground"
                )}
                >
                    {route.label}
                </Link>
            ))
        }
        
    </nav>
  )
}

export default MainNav