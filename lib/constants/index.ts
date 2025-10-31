import { TShippingAddress } from "../types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Pro Store";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "This is a store app";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const shippingAddressDefaultValues : TShippingAddress = {
    fullName:'John Doe',
    address: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'USA',
    lat: 0,
    lng: 0
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || PAYMENT_METHODS[0];

export const productDefaultValues = {
    name: '',
    slug: '',
    category: '',
    description: '',
    images: [''],
    brand: '',
    price: '0',
    stock: '0',
    rating: '0',
    numReviews: 0,
    isFeatured: false,
    banner: ''
}