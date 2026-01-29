import { Torder } from '@/lib/types'
import React from 'react'
import {Html,Body,Container,Section,Heading,Text,Row,Column, Tailwind,Button,Img,Head, Preview} from '@react-email/components'
import { formatCurrency } from '@/lib/utils'

const PurchaseReciept = ({order}:{order:Torder}) => {

    const orderPriceSummary = [
        {label:'Items Price', value: formatCurrency(order.itemsPrice)},
        {label:'Tax Price', value: formatCurrency(order.taxPrice)},
        {label:'Shipping Price', value: formatCurrency(order.shippingPrice)},
        {label:'Total Price', value: formatCurrency(order.totalPrice)},
    ]
  return (
    <Html>
        <Preview>Your Purchase Receipt from Pro Store</Preview>
        <Head />
        <Body className="bg-white my-auto  mx-auto font-sans">
          <Tailwind>
            <Container className="border max-w-xl border-gray-200 rounded-lg p-6">

           
            
                <Heading className="text-2xl font-bold text-gray-800">
                    Thank you for your purchase!

                </Heading>
                <Section className="mt-4">
                    <Row>
                        <Column>
                        <Text>Order Summary</Text>
                            <Text className="text-gray-700 whitespace-nowrap text-nowrap">
                                Hi {order.user.name}, we appreciate your business. Here are the details of your order #{order.id} placed on {new Date(order.createdAt!).toLocaleDateString()}:
                            </Text>
                        </Column>
                        <Column>
                            <Text>Price Paid</Text>
                            <Text className="text-gray-700 font-bold">
                                {
                                formatCurrency(order.totalPrice)
                                }
                            </Text>
                        </Column>
                    </Row>
                </Section>
                <Section className="mt-6 border border-solid border-gray-500 rounded-lg p-4 md:p-8">
                    {order.orderItems.map((item)=>(
                        <Row key={item.productId} className="mb-4 md:mb-8">
                            <Column className="w-20">
                                <Img src={item.image} alt={item.name} width="80" height="80" className="object-cover rounded-md"/>
                            </Column>
                            <Column className='align-top'>
                            {item.name} x {item.qty}
                            </Column>
                            <Column className='text-right font-bold'>
                                {formatCurrency(item.price )}
                            </Column>
                        </Row>
                    ))}

                    {
                        orderPriceSummary.map((summary)=>(
                            <Row key={summary.label} className="mb-2">
                                <Column className="text-gray-700">
                                    {summary.label}
                                </Column>
                                <Column className="text-right font-bold">
                                    {summary.value}
                                </Column>
                            </Row>
                        ))
                    }
                </Section>
                 </Container>
          </Tailwind>
        </Body>
    </Html>
  )
}

export default PurchaseReciept