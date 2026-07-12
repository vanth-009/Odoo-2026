'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SourceBreakdown as SourceType } from '../types';
import { Lightbulb } from 'lucide-react';

interface SourceBreakdownProps {
  data: SourceType[];
  isLoading?: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4'];

export default function SourceBreakdown({ data, isLoading }: SourceBreakdownProps) {
  if (isLoading) {
    return (
      <div className="h-[380px] w-full flex items-center justify-center bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-zinc-500 font-medium">Analyzing carbon logs...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[380px] w-full flex items-center justify-center bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl">
        <span className="text-zinc-500 text-sm">No carbon category logs available.</span>
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.carbon, 0);

  const formattedData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? parseFloat(((item.carbon / total) * 100).toFixed(1)) : 0
  }));

  const primarySource = formattedData[0];

  return (
    <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 flex flex-col h-[380px] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/20 transition-premium">
      <div className="border-b border-[#1f1f23]/40 pb-4 mb-4">
        <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505">Category Ratios</span>
        <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Emission Categories</h3>
      </div>

      <div className="flex-1 w-full min-h-0 flex flex-col justify-between">
        {/* Pie Chart and Labels side-by-side or stacked cleanly */}
        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={74}
                paddingAngle={4}
                dataKey="carbon"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#09090b', 
                  borderColor: '#27272a',
                  borderRadius: '12px',
                  color: '#f4f4f5',
                  fontSize: '11px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
                formatter={(value: any, name: any, props: any) => [
                  `${value.toLocaleString()} tCO2e (${props.payload.percentage}%)`, 
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute text-center pointer-events-none">
            <span className="text-zinc-550 text-[8px] uppercase tracking-widest block font-bold font-mono">Total</span>
            <span className="text-sm font-extrabold text-[#f4f4f5] tracking-tight">{Math.round(total).toLocaleString()} t</span>
          </div>
        </div>

        {/* Custom Legend Cards */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {formattedData.slice(0, 4).map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-[#09090b]/40 border border-[#27272a]/20 p-2.5 rounded-xl hover:border-zinc-800 transition-premium">
              <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-zinc-350 block truncate">{entry.name}</span>
                <span className="text-[8px] font-mono text-zinc-500">{entry.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Insight footer */}
        {primarySource && (
          <div className="mt-4 pt-3 border-t border-[#1f1f23]/40 flex items-start gap-2 text-[10px] text-zinc-400">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug text-[10px] text-zinc-450 font-medium">
              <span className="text-zinc-300 font-bold">Mitigation Target: </span>
              {primarySource.name} represents {primarySource.percentage}% of outputs. Optimize here first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
