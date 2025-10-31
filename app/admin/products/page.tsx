import DeleteDialog from '@/components/shared/DeleteDialog';
import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteProductById, getAllProducts } from '@/lib/actions/order.action';
import { formatCurrency, formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

const ProductsPage = async(props:{searchParams:Promise<{
    page:string,
    category:string,
    query:string
}>}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page || 1);
    const category = searchParams.category || '';
    const searchText = searchParams.query || '';

    const products = await getAllProducts({limit: 10, page, category, query:searchText});

    console.log(products)
  return (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Prooducts</h2>
            <Button variant='default'>
                <Link href = '/admin/products/create'>Add New</Link>
            </Button>
        </div>
        <div className="overflow-x-auto-w-fill space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rating</TableHead>
                        
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        products?.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{formatId(product.id)}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.rating}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell className='flex gap-2'>
                                   <DeleteDialog id ={product.id} action={deleteProductById}/>
                               <Button className='cursor-pointer' variant='default' size={'sm'}>
                                 <Link href={`/admin/products/${product.id}`}>
                                Edit
                                    </Link>
                               </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            {
                 products!.totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={products?.totalPages || 1}
                    />
                )
            }
        </div>
    </div>
  )
}

export default ProductsPage