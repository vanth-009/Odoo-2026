"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Download, ShieldCheck, HelpCircle, X, Check } from 'lucide-react';

interface Policy {
  id: number;
  title: string;
  category: string;
  description: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'DRAFT';
  effectiveDate: string;
  versions: {
    id: number;
    versionString: string;
    isActive: boolean;
    changeSummary: string;
    effectiveDate: string;
  }[];
  acknowledgements: {
    id: number;
    employeeId: string;
  }[];
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    category: 'GOVERNANCE',
    description: '',
    status: 'ACTIVE',
    effectiveDate: '',
    versionString: '1.0',
    changeSummary: 'Initial version publication'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/governance/policies');
      if (res.ok) {
        const json = await res.json();
        setPolicies(json.data || []);
        setEmployeesCount(json.employeesCount || 100); // fallback default
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/governance/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPolicy)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        // Reset form
        setNewPolicy({
          title: '',
          category: 'GOVERNANCE',
          description: '',
          status: 'ACTIVE',
          effectiveDate: '',
          versionString: '1.0',
          changeSummary: 'Initial version publication'
        });
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Failed to create policy.');
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          policy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getAcknowledgementRate = (policy: Policy) => {
    if (employeesCount === 0) return '0%';
    const count = policy.acknowledgements?.length || 0;
    return `${Math.min(100, Math.round((count / employeesCount) * 100))}%`;
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'ENVIRONMENTAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'SOCIAL':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'GOVERNANCE':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ETHICAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Policies &amp; Standards</h3>
          <p className="text-slate-400 text-sm mt-1">Manage, publish, and track acknowledgement rates of corporate ESG policy guidelines.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Policy
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search policies by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="relative w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="ALL" className="bg-slate-900">All Categories</option>
            <option value="ENVIRONMENTAL" className="bg-slate-900">Environmental (E)</option>
            <option value="SOCIAL" className="bg-slate-900">Social (S)</option>
            <option value="GOVERNANCE" className="bg-slate-900">Governance (G)</option>
            <option value="ETHICAL" className="bg-slate-900">Ethical Standards</option>
          </select>
        </div>
      </div>

      {/* Policies List Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-black/20">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-medium">Policy Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Active Version</th>
                  <th className="px-6 py-4 font-medium">Effective Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg font-medium">Acknowledgement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                      No policies found matching filters.
                    </td>
                  </tr>
                ) : filteredPolicies.map((p) => {
                  const activeVer = p.versions?.find(v => v.isActive);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span>{p.title}</span>
                          <span className="text-xs font-normal text-slate-400 line-clamp-1">{p.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeClass(p.category)}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">
                        {activeVer ? `v${activeVer.versionString}` : 'v1.0'}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString() : 'Immediate'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          p.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-bold">
                        {getAcknowledgementRate(p)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Create Governance Policy</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePolicy} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Policy Category</label>
                <select
                  required
                  value={newPolicy.category}
                  onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value="ENVIRONMENTAL" className="bg-slate-900">Environmental (E)</option>
                  <option value="SOCIAL" className="bg-slate-900">Social (S)</option>
                  <option value="GOVERNANCE" className="bg-slate-900">Governance (G)</option>
                  <option value="ETHICAL" className="bg-slate-900">Ethical Standards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. Anti-Bribery & Corruption Policy"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  placeholder="Summarize the rules and organizational boundaries..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial Version</label>
                  <input
                    type="text"
                    required
                    value={newPolicy.versionString}
                    onChange={(e) => setNewPolicy({...newPolicy, versionString: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Effective Date</label>
                  <input
                    type="date"
                    required
                    value={newPolicy.effectiveDate}
                    onChange={(e) => setNewPolicy({...newPolicy, effectiveDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Revision Change Summary</label>
                <input
                  type="text"
                  required
                  value={newPolicy.changeSummary}
                  onChange={(e) => setNewPolicy({...newPolicy, changeSummary: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-xs"
                >
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
