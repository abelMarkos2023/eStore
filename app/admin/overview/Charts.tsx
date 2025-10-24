'use client'

import { TSalesData } from '@/lib/types'
import React from 'react';
import {BarChart, Bar, XAxis, ResponsiveContainer, YAxis} from 'recharts';

const Charts = ({salesData}:{salesData:TSalesData[]}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart width='100%' 
                 height={300} 
                 data={salesData}
                 margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
            <XAxis stroke='#888888' 
                   dataKey="month" 
                   fontSize={14} 
                   tickLine={false} 
                   axisLine={false}
         />
            <YAxis stroke='#888888' 
                   fontSize={14} 
                   tickLine={false}
                    axisLine={false}
                     tickFormatter={(value) => `$${value}`}
            />
            <Bar dataKey="totalSales" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default Charts