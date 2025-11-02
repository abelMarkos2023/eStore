import { auth } from "@/auth";
import DeleteDialog from "@/components/shared/DeleteDialog";
import Pagination from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteOrderById, getAllOrder } from "@/lib/actions/order.action";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Orders = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string, query: string }>;
}) => {
  const { page = 1 , query} = await searchParams;
  const session = await auth();
  if (session?.user?.role !== "admin")
    throw new Error("You're not authorized to view this page");
  const paginatedData = await getAllOrder({
    page: Number(page) || 1,
    limit: 6,
    query : query || ''
  });

  if (!paginatedData) return null;
  return (
    <div className="space-y-4 overflow-x-auto">
         <div className="flex gap-3 items-center">
                <h2 className="text-2xl font-bold">All Orders</h2>
                {
                    query && (
                        <>
                            <p className="text-muted-foreground">
                            Showing results for{ `  " ${query} "` } 
                            </p>
                            <Link href= '/admin/orders'>
                                <Button variant='ghost'>
                                     Reset
                                </Button>
                             </Link>
                        </>
                        )
                }
                
            </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableCell>BUYER</TableCell>
            <TableHead>Total Price</TableHead>
            <TableHead>Is Paid</TableHead>
            <TableHead>Is Delivered</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatId(order.id)}</TableCell>
              
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>
                {order.isPaid ? (
                  <Badge variant="outline">{formatDate(order.paidAt!)}</Badge>
                ) : (
                  "Not Paid"
                )}
              </TableCell>
              <TableCell>
                {order.isDelivered ? (
                  <Badge variant="outline">
                    {formatDate(order.deliveredAt!)}
                  </Badge>
                ) : (
                  "Not Delivered"
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  <Link href={`/order/${order.id}`}>View</Link>
                </Button>
                <DeleteDialog id={order.id} action={DeleteOrderById} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {paginatedData?.totalPages > 1 && (
        <Pagination
          page={Number(page) || 1}
          totalPages={paginatedData.totalPages}
        />
      )}
    </div>
  );
};

export default Orders;
