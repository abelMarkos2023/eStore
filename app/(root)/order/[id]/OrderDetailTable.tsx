"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Torder } from "@/lib/types";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { approvePaypalOrder, createPaypalOrder } from "@/lib/actions/order.action";
import { toast } from "sonner";

const OrderDetailTable = ({ order,paypalClientId }: { order: Torder,paypalClientId:string }) => {
  const {
    id,
    createdAt,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    orderItems,
    user,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentsMethod,
    shippingAddress,
  } = order;

   const handleCreatePaypalOrder = async() => {
    const res = await createPaypalOrder(id!);

    if(!res?.success){
      toast.error(res?.message || 'Failed to create paypal order. Please try again.');
    }
    return res?.data
   }
   const handleApprovePaypalOrder = async(data:{
    orderID:string
   }) => {
    return approvePaypalOrder(id!,data).then((res) => {
    if (!res?.success) {
      toast.error(res?.message || 'Failed to approve paypal order. Please try again.');
    } else {
      toast.success(res?.message);
    }
    return res.data;
  })
  .catch((error) => {
    toast.error('An error occurred while approving the PayPal order.');
    throw error; // Re-throw the error to handle it further if needed
  });

    
   } 
    
   console.log(paymentsMethod)

   const PrintLoadingState = () => {
    const [{isPending,isRejected}] = usePayPalScriptReducer();

    return isPending ? "Loading" : isRejected ? "Failed" : "Success";
   }
  return (
    <div>
      <h1 className="text-2xl my-4">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-4">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent>
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentsMethod}</p>
              <p>
                {isPaid ? (
                  <Badge variant="secondary">
                    Paid at {formatDate(paidAt!)}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Paid</Badge>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}
              </p>
              <p>
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <p>
                {isDelivered ? (
                  <Badge variant="secondary">
                    Paid at {formatDate(deliveredAt!)}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Paid</Badge>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-2xl my-4">Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => {
                    return (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-start space-x-2"
                          >
                            <Image
                              width={60}
                              height={60}
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover"
                            />
                            <span>{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
                    <Card className="p-2">
                      <CardContent className='p-2 flex flex-col gap-4'>
                        <h3 className="text-xl mb-4">Order Summary</h3>
                        <div className="flex justify-between">
                          <div className="font-bold">Items Price</div>
                          <div className="text-lg font-bold">{formatCurrency(itemsPrice)}
        
                          </div>
                        </div>
        
                        <div className="flex justify-between">
                          <div className="font-bold">Tax Price</div>
                          <div className="text-lg font-bold">{formatCurrency(taxPrice)}
                            
                          </div>
                        </div>
        
                        <div className="flex justify-between">
                          <div className="font-bold">Shipping Price</div>
                          <div className="text-lg font-bold">{formatCurrency(shippingPrice)}
                            
                          </div>
                        </div>
        
                        <div className="flex justify-between">
                          <div className="font-bold">Total Price</div>
                          <div className="text-lg font-bold">{formatCurrency(totalPrice)}
                            
                          </div>
                        </div>
                        {
                         ( !isPaid && paymentsMethod == 'Stripe') && (
                           <div>
                             <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                              <PrintLoadingState />
                              <PayPalButtons 
                              createOrder={handleCreatePaypalOrder} 
                              onApprove={handleApprovePaypalOrder} 
                              />
                            </PayPalScriptProvider>
                           </div>
                          )
                        }
                      </CardContent>
                    </Card>
                  </div>
      </div>
    </div>
  );
};

export default OrderDetailTable;
