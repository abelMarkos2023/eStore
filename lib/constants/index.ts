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