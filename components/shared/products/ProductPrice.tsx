import { cn } from '@/lib/utils';
import React from 'react'

const ProductPrice = ({value,className}:{value:number,className?:string}) => {

    const stringValue = value.toFixed(2);

    const [intValue,decimalValue] = stringValue.split('.')

  return (
    <p className={cn("font-bold text-2xl",className)}>
        <span className="text-xs align-super">$</span>
        <span className="text-extrabold">{intValue}</span>
        <span className="text-xs align-super">.{decimalValue}</span>
    </p>
  )
}

export default ProductPrice