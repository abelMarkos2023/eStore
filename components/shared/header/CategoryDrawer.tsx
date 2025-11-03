import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { getAllCategories } from '@/lib/actions/product.action'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CategoryDrawer = async() => {
    const categories = await getAllCategories();
  return (
    <Drawer direction='left'>
        <DrawerTrigger asChild>
            <Button variant='outline'>
                <Menu />
            </Button>

        </DrawerTrigger>
        <DrawerContent className='h-full max-w-sm'>
            <DrawerHeader>
                <DrawerTitle>Select a Category</DrawerTitle>
                <div className="space-y-2 mt-4">
                    {
                    categories.map((category) => (
                        <Button variant='ghost' className='w-full' key={category.category}>
                            <DrawerClose asChild>
                                <Link href={`/search?category=${category.category}`}>{category.category} ({category._count})</Link>
                            </DrawerClose>
                        </Button>
                    ))
                }
                </div>
            </DrawerHeader>
        </DrawerContent>
    </Drawer>
  )
}

export default CategoryDrawer