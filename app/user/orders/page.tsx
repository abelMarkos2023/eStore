import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUsersOrder } from '@/lib/actions/order.action';
import { Torder } from '@/lib/types';
import { formatCurrency, formatDate, formatId } from '@/lib/utils';
import { Metadata } from 'next'
import Link from 'next/link';
import React from 'react'

export const metadata:Metadata = {
    title: 'Orders',
    description: 'Manage your orders',
}
const Orders = async({searchParams}:{searchParams:Promise<{page:string}>}) => {

    const {page} = await searchParams;

    const paginatedData = await getUsersOrder({page:Number(page) || 1,limit:1});

    if(!paginatedData) return null


    console.log(paginatedData)
  return (
    <div className='space-y-4 overflow-x-auto'>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Is Paid</TableHead>
                    <TableHead>Is Delivered</TableHead>
                    <TableHead>Action</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    paginatedData?.data.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{formatId(order.id)}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                            <TableCell>
                                {
                            order.isPaid ? <Badge variant='outline'>
                                {
                                formatDate(order.paidAt!)
                                }
                            </Badge> : 'Not Paid'
                            }
                            </TableCell>
                            <TableCell>{order.isDelivered ? <Badge variant='outline'>
                                {
                                formatDate(order.deliveredAt!)
                                }
                            </Badge> : 'Not Delivered'}</TableCell>
                            <TableCell><Link href={`/order/${order.id}`}>View</Link></TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
        {
            paginatedData?.totalPages > 1 && (
                <Pagination page={Number(page) || 1} totalPages={paginatedData.totalPages} />
            )
        }
    </div>
  )
}

export default Orders