import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.action';
import { TShippingAddress } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Metadata } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import PlaceOrderForm from './PlaceOrderForm';

export const metadata:Metadata = {
  title: 'Place Order',
  description: 'Place your order',
}

const PlaceOrderPage = async () => {

  const cart = await getMyCart();

  if(!cart || cart.items.length === 0) return redirect('/cart');

  const session = await auth();
  
  const userId = session?.user?.id;

  if(!userId) return redirect('/auth/signin?callbackUrl=/place-order');

  const user = await getUserById(userId);

  if(!user) return redirect('/auth/signin?callbackUrl=/place-order');

  if(!user.address) return redirect('/shipping-address');
  if(!user.paymentMethod) return redirect('/payment-method');

  const userAddress = user.address as TShippingAddress

  
  return (
    <div>
        <h2 className="text-2xl py-4">Place Order</h2>
        <div className="grid md:grid-cols-3 md:gap-4">
          <div className="md:col-span-2 overflow-x-auto space-y-4">
            <Card className="mb-2 p-2">
              <CardContent className='p-2 gap-4'>
                <h3 className="text-xl mb-4">Shipping Address</h3>
                <h4 className="text-lg">{userAddress.fullName}</h4>
                <p>
                  {userAddress.address}, {userAddress.city}, {" "}
                  {userAddress.postalCode}, {userAddress.country}
                </p>
                <div className="mt-3">
                  <Link href="/shipping-address" className="">
                  <Button variant="outline" className="cursor-pointer">Edit</Button>
                  </Link>
                </div>
              
             
              </CardContent>

            </Card>

            <Card className="mb-2 p-2">
              <CardContent className='p-2 gap-4'>
                <h3 className="text-xl mb-4">Payment Method</h3>
                <h4 className="text-lg">{user.paymentMethod}</h4>
                <p>
                 
                </p>
                <div className="mt-3">
                  <Link href="/payment-method" className="">
                  <Button variant="outline" className="cursor-pointer">Edit</Button>
                  </Link>
                </div>
              
             
              </CardContent>

            </Card>

            <Card className="mb-4 p-4">
              <CardContent className='p-4 gap-4'>
                <h3 className="text-xl mb-8">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        cart.items.map(item => {
                          return (
                            <TableRow key={item.productId}>
                              <TableCell>
                                <Link href={`/product/${item.slug}`} className="flex items-start space-x-2">
                                  <Image width={60} height={60} src={item.image} alt={item.name} className="w-10 h-10 object-cover"/>
                                  <span>{item.name}</span>
                                </Link>
                              </TableCell>
                              <TableCell>${item.price}</TableCell>
                              <TableCell>{item.qty}</TableCell>
                            </TableRow>
                          )
                        }
                      )
                      }
                      
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
                  <div className="text-lg font-bold">{formatCurrency(cart.itemsPrice)}

                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="font-bold">Tax Price</div>
                  <div className="text-lg font-bold">{formatCurrency(cart.taxPrice)}
                    
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="font-bold">Shipping Price</div>
                  <div className="text-lg font-bold">{formatCurrency(cart.shippingPrice)}
                    
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="font-bold">Total Price</div>
                  <div className="text-lg font-bold">{formatCurrency(cart.totalPrice)}
                    
                  </div>
                </div>
                <PlaceOrderForm />
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}

export default PlaceOrderPage