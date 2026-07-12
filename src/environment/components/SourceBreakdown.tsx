'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SourceBreakdown as SourceType } from '../types';

interface SourceBreakdownProps {
  data: SourceType[];
  isLoading?: boolean;
}

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#fb7185', '#fbbf24', '#22d3ee'];

export default function SourceBreakdown({ data, isLoading }: SourceBreakdownProps) {
  if (isLoading) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-zinc-500 font-medium">Analyzing carbon logs...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
        <span className="text-zinc-500 text-sm">No carbon category logs available.</span>
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.carbon, 0);

  const formattedData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? parseFloat(((item.carbon / total) * 100).toFixed(1)) : 0
  }));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-[380px]">
      <div>
        <h3 className="text-base font-semibold text-zinc-100">Carbon Source Breakdown</h3>
        <p className="text-zinc-500 text-xs mt-0.5">Contribution by product / utility source</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="55%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="carbon"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                borderColor: '#27272a',
                borderRadius: '8px',
                color: '#f4f4f5',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value.toLocaleString()} tCO2e (${props.payload.percentage}%)`, 
                name
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              iconType="circle" 
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
