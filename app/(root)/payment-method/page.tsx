import { auth } from '@/auth'
import { getUserById } from '@/lib/actions/user.action';
import React from 'react'
import PaymentMethodForm from './PaymentMethodForm';

const PaymentMethodPage = async () => {

  const session = await auth();

  const userId = session?.user?.id;
  if(!userId){
    // throw new Error('Unauthorized')
    return <div>Please sign in to manage your payment methods.</div>
  }
  const user = await getUserById(userId);
  return (
    <div>
      <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod || null} />
    </div>
  )
}

export default PaymentMethodPage