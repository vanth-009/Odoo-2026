'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { Department } from '../types';

interface DepartmentPerformanceProps {
  departments: Department[];
  isLoading?: boolean;
}

export default function DepartmentPerformance({ departments, isLoading }: DepartmentPerformanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDepts = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || dept.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [departments, searchQuery, statusFilter]);

  // Split into Top Performers (high score, <= target) and At-Risk (exceeding target or low score)
  const sortedDepts = useMemo(() => {
    return [...filteredDepts].sort((a, b) => b.score - a.score);
  }, [filteredDepts]);

  const topPerformers = useMemo(() => {
    return sortedDepts.filter(d => d.score >= 80 && d.status === 'On Track');
  }, [sortedDepts]);

  const underPerformers = useMemo(() => {
    return sortedDepts.filter(d => d.score < 80 || d.status !== 'On Track');
  }, [sortedDepts]);

  if (isLoading) {
    return (
      <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 animate-pulse space-y-4">
        <div className="h-6 bg-[#09090b] rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-[#09090b] rounded"></div>
          <div className="h-32 bg-[#09090b] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/10 transition-premium">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-[#1f1f23]/40">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505">Spatial Nodes</span>
          <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Departmental Diagnostics</h3>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-[#f4f4f5] placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-36 lg:w-48 transition-premium"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer transition-premium"
          >
            <option value="all">All Statuses</option>
            <option value="on track">On Track</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {sortedDepts.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 font-medium">
          No environmental nodes matched the filter criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Outstanding Performance Section (Class A) */}
          {topPerformers.length > 0 && (
            <div>
              <h4 className="text-[9.5px] font-bold text-emerald-450 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Outstanding Performance Nodes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topPerformers.map((dept) => (
                  <DepartmentPerformanceCard key={dept.id} dept={dept} />
                ))}
              </div>
            </div>
          )}

          {/* Underperforming / High-Risk Section (Class B & C) */}
          {underPerformers.length > 0 && (
            <div>
              <h4 className="text-[9.5px] font-bold text-rose-455 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-405" />
                Telemetry Risk & Correction Nodes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {underPerformers.map((dept) => (
                  <DepartmentPerformanceCard key={dept.id} dept={dept} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Single Department Card Component
function DepartmentPerformanceCard({ dept }: { dept: Department }) {
  const percentage = Math.min(100, Math.round((dept.currentEmissions / dept.targetEmissions) * 100));

  // Determine card styles and glow based on status
  const cardBorder = 
    dept.status === 'Critical' ? 'border-rose-500/20 hover:border-rose-500/40 bg-gradient-to-br from-[#141417]/80 to-rose-955/5 shadow-[0_4px_20px_rgba(244,63,94,0.02)]' :
    dept.status === 'Warning' ? 'border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-br from-[#141417]/80 to-amber-955/5 shadow-[0_4px_20px_rgba(245,158,11,0.02)]' :
    'border-[#27272a]/30 hover:border-emerald-500/30 bg-gradient-to-br from-[#141417]/80 to-emerald-955/2 shadow-[0_4px_20px_rgba(16,185,129,0.02)]';

  const progressColor = 
    dept.status === 'Critical' ? 'bg-rose-500' :
    dept.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500';

  const statusBadge = 
    dept.status === 'Critical' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
    dept.status === 'Warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  const StatusIcon = 
    dept.status === 'Critical' ? ShieldAlert :
    dept.status === 'Warning' ? AlertTriangle : CheckCircle;

  // Custom mock analytics descriptions
  const quickInsight = 
    dept.status === 'Critical' ? 'Urgent heating grid coil upgrades required.' :
    dept.status === 'Warning' ? 'Boiler run schedules exceed compliance limits.' :
    'Zero emission compliance targets met ahead of schedule.';

  return (
    <div className={`border p-4.5 rounded-xl flex flex-col justify-between transition-premium shadow-md group ${cardBorder}`}>
      <div>
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <span className="text-[8px] text-zinc-500 font-mono tracking-wider uppercase">Node ID</span>
            <h5 className="text-[#f4f4f5] text-xs font-bold leading-normal truncate group-hover:text-zinc-100 transition-colors">
              {dept.name}
            </h5>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-bold border uppercase tracking-wider ${statusBadge}`}>
            <StatusIcon className="w-2.5 h-2.5" />
            {dept.status}
          </span>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-2 gap-4 my-4.5 border-y border-[#1f1f23]/40 py-3">
          <div>
            <span className="text-[8.5px] text-zinc-500 font-semibold block uppercase">Emissions / Limit</span>
            <span className="text-sm font-bold text-zinc-205 font-mono leading-none">
              {dept.currentEmissions.toLocaleString()} <span className="text-[9.5px] text-zinc-550 font-normal">t</span>
            </span>
            <span className="text-[8.5px] text-zinc-500 font-mono block mt-0.5">
              Limit: {dept.targetEmissions.toLocaleString()} t
            </span>
          </div>

          <div>
            <span className="text-[8.5px] text-zinc-500 font-semibold block uppercase">Score / Trend</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-sm font-extrabold font-mono ${
                dept.score >= 90 ? 'text-emerald-400' :
                dept.score >= 75 ? 'text-zinc-200' : 'text-amber-400'
              }`}>
                {dept.score}
              </span>
              {dept.trend === 'up' ? (
                <span className="text-rose-450 flex items-center" title="Emissions Increasing">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="text-emerald-450 flex items-center" title="Emissions Decreasing">
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <span className="text-[8px] text-zinc-550 block font-mono">Weighted status</span>
          </div>
        </div>

        {/* Progress bar representing emissions ratio */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8.5px] text-zinc-500 font-semibold">
            <span>Quota Utilized</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#09090b] border border-[#27272a]/20 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressColor} transition-all duration-700`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#1f1f23]/40 text-[9.5px] text-zinc-400 flex items-start gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
        <p className="leading-relaxed">
          <span className="text-zinc-300 font-bold">Diagnostics Insight: </span>
          {quickInsight}
        </p>
      </div>
    </div>
  );
}
