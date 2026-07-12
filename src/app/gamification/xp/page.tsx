"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Award, Calendar, User, ArrowUpRight, ArrowDownRight, 
  HelpCircle, ShieldCheck, Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface XPTransaction {
  id: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  xp: number;
  challengeTitle: string | null;
  activityName: string;
  createdAt: string;
}

interface FilterOptions {
  employees: { id: string; name: string }[];
  departments: { id: string; name: string }[];
}

export default function XPManagementPage() {
  const [transactions, setTransactions] = useState<XPTransaction[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ employees: [], departments: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual adjustment form
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustState, setAdjustState] = useState({
    employeeId: '',
    xp: '100',
    activityName: ''
  });
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        employeeId: employeeFilter,
        departmentId: departmentFilter
      });
      const res = await fetch(`/api/gamification/xp?${queryParams.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setTransactions(json.data || []);
        if (json.filterOptions) {
          setFilterOptions(json.filterOptions);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employeeFilter, departmentFilter]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustState.employeeId) {
      toast.error('Please select an employee.');
      return;
    }
    if (!adjustState.activityName.trim()) {
      toast.error('Please provide a reason description.');
      return;
    }

    setIsAdjusting(true);
    try {
      const res = await fetch('/api/gamification/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustState)
      });

      if (res.ok) {
        toast.success('Manual XP adjustment recorded!');
        setIsAdjustModalOpen(false);
        setAdjustState({
          employeeId: '',
          xp: '100',
          activityName: ''
        });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to adjust XP.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    } finally {
      setIsAdjusting(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.activityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">XP Points Management</h3>
          <p className="text-slate-400 text-sm mt-1">Audit employee XP transaction ledgers and make administrative point adjustments.</p>
        </div>
        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Adjust XP (Credit/Debit)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions by employee or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Filter Employee */}
        <div>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Employees</option>
            {filterOptions.employees.map(emp => (
              <option key={emp.id} value={emp.id} className="bg-slate-900">{emp.name}</option>
            ))}
          </select>
        </div>

        {/* Filter Department */}
        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {filterOptions.departments.map(dept => (
              <option key={dept.id} value={dept.id} className="bg-slate-900">{dept.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Transaction Logs list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-zinc-400 uppercase bg-black/25">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Reason / Action</th>
                  <th className="px-6 py-4 font-medium">Linked Challenge</th>
                  <th className="px-6 py-4 font-medium">XP Points</th>
                  <th className="px-6 py-4 rounded-tr-lg font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                      No XP transaction logs found.
                    </td>
                  </tr>
                ) : filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Employee Profile */}
                    <td className="px-6 py-4 font-bold text-white flex flex-col">
                      <span>{t.employeeName}</span>
                      <span className="text-[9px] font-normal text-zinc-500">{t.departmentName} ({t.employeeCode})</span>
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4 text-slate-200">
                      {t.activityName}
                    </td>

                    {/* Challenge Link */}
                    <td className="px-6 py-4 text-slate-350">
                      {t.challengeTitle || <span className="text-zinc-600 italic">None (Adjustment)</span>}
                    </td>

                    {/* XP Points with arrow */}
                    <td className="px-6 py-4 font-bold">
                      <span className={`inline-flex items-center gap-1.5 ${
                        t.xp >= 0 ? 'text-emerald-450' : 'text-rose-400'
                      }`}>
                        {t.xp >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-400 border border-emerald-500/10 bg-emerald-500/5 rounded" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-rose-450 border border-rose-500/10 bg-rose-500/5 rounded" />
                        )}
                        <span>{t.xp >= 0 ? `+${t.xp}` : t.xp} XP</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-400 font-mono text-[10.5px]">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual XP adjustment modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white">Manual XP Adjustment</h3>
              <button 
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              
              {/* Select Employee */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Select Employee</label>
                <select
                  required
                  value={adjustState.employeeId}
                  onChange={(e) => setAdjustState({...adjustState, employeeId: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">Choose Employee...</option>
                  {filterOptions.employees.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-zinc-900">{emp.name}</option>
                  ))}
                </select>
              </div>

              {/* XP points input */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">XP Offset Amount</label>
                <input
                  type="number"
                  required
                  value={adjustState.xp}
                  onChange={(e) => setAdjustState({...adjustState, xp: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. 100 or -50"
                />
                <span className="text-[9px] text-zinc-550 mt-1 block">Positive credits or negative debits allowed.</span>
              </div>

              {/* Reason description */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Reason / Notes</label>
                <textarea
                  required
                  rows={2}
                  value={adjustState.activityName}
                  onChange={(e) => setAdjustState({...adjustState, activityName: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Describe justification (e.g. Volunteer at Earth Day event)..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Apply Adjustment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
