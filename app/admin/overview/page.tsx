import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getOrdersSummary } from '@/lib/actions/order.action';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { BadgeDollarSignIcon, Barcode, CreditCard, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import Charts from './Charts';

const OverviewPage = async () => {

    const session = await auth();

    if(!session || !session.user || !session.user.id || session.user.role !== 'admin')
    { 
        throw new Error('Unauthorized'); 
    }

    const summary = await getOrdersSummary();

  return (
    <div className="space-y-3">
        <h2 className="text-2xl font-extrabold">Admin DAshboard</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <BadgeDollarSignIcon />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.totalSales._sum?.totalPrice?.toString() || 0)}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <CreditCard />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(summary.ordersData)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <Users />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(summary.usersData)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <Barcode />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(summary.productsData)}</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
            <Card className='col-span-4'>
                <CardHeader>
                    <CardTitle>Latest Orders</CardTitle>
                </CardHeader>
                <CardContent>
                   <Charts salesData={summary.salesData } />
                </CardContent>
            </Card>
            <Card className='col-span-3'>
                <CardHeader>
                    <CardTitle>Latest Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>BUYER</TableHead>
                                <TableHead>TOTAL</TableHead>
                                <TableHead>DATE</TableHead>
                                <TableHead>ACTION</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                summary.latestOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.user.name}</TableCell>
                                        <TableCell>{order.totalPrice}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell><Link href={`/orders/${order.id}`}>Detail</Link></TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default OverviewPage