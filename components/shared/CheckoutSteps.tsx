import { cn } from '@/lib/utils';
import React from 'react'


const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order'];
const CheckoutSteps = ({step = 0}:{step:number}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-10">
        {steps.map((s,i) => (
            <React.Fragment key={s}>
                <div className={cn('w-56 p-2 rounded-lg text-center',i === step ? 'bg-primary text-secondary':'')}>
                    {s}
                </div>
                {s !== 'Place Order' && <hr className='w-16 mx-2 border-t border-amber-300 ' /> }
            </React.Fragment>
        ))}
    </div>
  )
}

export default CheckoutSteps