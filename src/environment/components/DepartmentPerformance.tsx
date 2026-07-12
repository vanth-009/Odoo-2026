'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Award, Sparkles, AlertTriangle } from 'lucide-react';
import { Department } from '../types';

interface DepartmentPerformanceProps {
  departments: Department[];
  isLoading?: boolean;
}

type SortField = 'name' | 'currentEmissions' | 'targetEmissions' | 'score';
type SortOrder = 'asc' | 'desc';

export default function DepartmentPerformance({ departments, isLoading }: DepartmentPerformanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('currentEmissions');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedAndFilteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => {
        const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || dept.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' 
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }

        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [departments, searchQuery, statusFilter, sortField, sortOrder]);

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-400 inline" /> 
      : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-400 inline" />;
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-zinc-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Department Environmental Leaderboard</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Ranked by carbon footprint and performance score</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-44"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
          >
            <option value="all">All Statuses</option>
            <option value="on track">On Track</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-xs font-semibold">
              <th className="pb-3 cursor-pointer select-none hover:text-zinc-200" onClick={() => handleSort('name')}>
                Department <SortIndicator field="name" />
              </th>
              <th className="pb-3 cursor-pointer select-none hover:text-zinc-200 text-right" onClick={() => handleSort('currentEmissions')}>
                Current (tCO2e) <SortIndicator field="currentEmissions" />
              </th>
              <th className="pb-3 cursor-pointer select-none hover:text-zinc-200 text-right" onClick={() => handleSort('targetEmissions')}>
                Target Limit <SortIndicator field="targetEmissions" />
              </th>
              <th className="pb-3 text-center">Efficiency Progress</th>
              <th className="pb-3 cursor-pointer select-none hover:text-zinc-200 text-right" onClick={() => handleSort('score')}>
                Score <SortIndicator field="score" />
              </th>
              <th className="pb-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-xs">
            {sortedAndFilteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  No matching departments found.
                </td>
              </tr>
            ) : (
              sortedAndFilteredDepartments.map((dept, index) => {
                const percentage = Math.min(100, Math.round((dept.currentEmissions / dept.targetEmissions) * 100));
                
                // Color for progress bar based on status
                const progressColor = 
                  dept.status === 'Critical' ? 'bg-rose-500' :
                  dept.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500';

                return (
                  <tr key={dept.id} className="group hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 font-medium text-zinc-200 flex items-center gap-2">
                      <span className="text-zinc-500 font-mono w-4">#{index + 1}</span>
                      {dept.name}
                    </td>
                    <td className="py-3.5 text-right font-mono text-zinc-200">{dept.currentEmissions.toLocaleString()}</td>
                    <td className="py-3.5 text-right font-mono text-zinc-400">{dept.targetEmissions.toLocaleString()}</td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${progressColor} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400 w-8 text-right">{percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-semibold">
                      <span className={`flex items-center justify-end gap-1 ${
                        dept.score >= 90 ? 'text-emerald-400' :
                        dept.score >= 75 ? 'text-zinc-200' : 'text-amber-400'
                      }`}>
                        {dept.score}
                        {dept.score >= 90 && <Sparkles className="w-3 h-3" />}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        dept.status === 'Critical' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                        dept.status === 'Warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                        'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
