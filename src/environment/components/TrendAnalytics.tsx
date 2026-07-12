'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyTrend } from '../types';

interface TrendAnalyticsProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

export default function TrendAnalytics({ data, isLoading }: TrendAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-zinc-500 font-medium">Aggregating emission logs...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
        <span className="text-zinc-500 text-sm">No transaction trend data available.</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-[380px]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Carbon Emission Trends</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Monthly aggregate over the last 12 months</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-zinc-800 rounded-lg text-emerald-400">
          Scope 1, 2 & 3
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#71717a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#71717a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              unit=" t"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                borderColor: '#27272a',
                borderRadius: '8px',
                color: '#f4f4f5',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#10b981' }}
              formatter={(value: any) => [`${value} tCO2e`, 'Emissions']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area 
              name="Carbon Footprint"
              type="monotone" 
              dataKey="carbon" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCarbon)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
