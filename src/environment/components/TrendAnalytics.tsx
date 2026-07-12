'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyTrend } from '../types';
import { Sparkles, TrendingDown } from 'lucide-react';

interface TrendAnalyticsProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

export default function TrendAnalytics({ data, isLoading }: TrendAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="h-[380px] w-full flex items-center justify-center bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-zinc-500 font-medium">Aggregating emission logs...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[380px] w-full flex items-center justify-center bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl">
        <span className="text-zinc-500 text-sm">No transaction trend data available.</span>
      </div>
    );
  }

  // Get current vs previous month to explain trend
  const currentMonthVal = data[data.length - 1]?.carbon || 0;
  const prevMonthVal = data[data.length - 2]?.carbon || 0;
  const delta = currentMonthVal - prevMonthVal;
  const percentage = prevMonthVal > 0 ? ((delta / prevMonthVal) * 100).toFixed(1) : '0';

  return (
    <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 flex flex-col h-[380px] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/20 transition-premium">
      {/* Chart Header with explicit insight block */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5 border-b border-[#1f1f23]/40 pb-4">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505">Temporal Telemetry</span>
          <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Emissions Trajectory</h3>
        </div>

        <div className="bg-[#09090b]/80 border border-[#27272a]/20 p-2.5 rounded-xl flex items-center gap-2 text-left max-w-sm">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[8.5px] font-bold text-zinc-450 uppercase tracking-widest block font-mono">Trend Driver</span>
            <p className="text-[10px] text-zinc-500 leading-normal font-medium">
              {Number(percentage) < 0 
                ? `Carbon output declined by ${Math.abs(Number(percentage))}% MoM. Primary driver: IT Data Center cooling efficiency upgrades.`
                : `Carbon output rose by ${percentage}% MoM. Seasonal HVAC load increases registered in Manufacturing & Corporate Events.`
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCarbonTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              unit=" t"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: '#27272a',
                borderRadius: '12px',
                color: '#f4f4f5',
                fontSize: '11px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#34d399', marginBottom: '4px' }}
              formatter={(value: any) => [`${value} tCO2e`, 'Emissions']}
            />
            <Area 
              name="Carbon Footprint"
              type="monotone" 
              dataKey="carbon" 
              stroke="#10b981" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorCarbonTrend)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
