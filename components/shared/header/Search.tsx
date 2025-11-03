import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { getAllCategories } from '@/lib/actions/product.action'
import { SelectValue } from '@radix-ui/react-select'
import { SearchIcon } from 'lucide-react'
import React from 'react'

const Search = async() => {
    const categories = await getAllCategories();
  return (
    <form action="/search" className="flex w-full max-w-md items-center space-x-2">
         <Select name='caegory'>
            <SelectTrigger className='w-[180px] md:w-[300px]'>
                <SelectValue placeholder='all' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category.category} value={category.category}>{category.category} ({category._count})
                    </SelectItem>
                ))}
            </SelectContent>
         </Select>
         <Input name='q' placeholder='Search...' className='w-full' />
         <Button><SearchIcon /></Button>
    </form>
  )
}

export default Search