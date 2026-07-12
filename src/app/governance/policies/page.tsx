"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, FileText, Check, X, ShieldCheck, Clock, 
  UserCheck, AlertTriangle, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Policy {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'DRAFT';
  effectiveDate: string;
  versions: {
    id: string;
    versionString: string;
    isActive: boolean;
    changeSummary: string;
    effectiveDate: string;
  }[];
  acknowledgements: {
    id: string;
    employeeId: string;
  }[];
}

interface AcknowledgementLog {
  id: string;
  policyId: string;
  policyTitle: string;
  employeeName: string;
  employeeCode: string;
  version: string;
  status: string; // Pending, Accepted, Rejected
  acceptedAt: string | null;
  remarks: string;
}

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'acceptance'>('directory');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<AcknowledgementLog[]>([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for creating policies
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
      const [policiesRes, acksRes] = await Promise.all([
        fetch('/api/governance/policies'),
        fetch('/api/governance/policies/acknowledge')
      ]);

      if (policiesRes.ok) {
        const json = await policiesRes.json();
        setPolicies(json.data || []);
        setEmployeesCount(json.employeesCount || 10);
      }

      if (acksRes.ok) {
        const json = await acksRes.json();
        setAcknowledgements(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
        toast.success('Policy created successfully!');
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
        toast.error(errJson.error || 'Failed to create policy.');
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error('Server submission failed.');
    }
  };

  const handleUpdateAck = async (ackId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      const res = await fetch('/api/governance/policies/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgementId: ackId, action })
      });
      if (res.ok) {
        toast.success(action === 'ACCEPT' ? 'Policy accepted successfully!' : 'Policy marked as rejected.');
        // Refresh values
        fetchData();
      } else {
        toast.error('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updates:', error);
      toast.error('Server execution failed.');
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          policy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredAcks = acknowledgements.filter(ack => {
    const matchesSearch = ack.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ack.policyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Policies &amp; Standards</h3>
          <p className="text-slate-400 text-sm mt-1">Manage, publish, and track acknowledgement rates of corporate ESG policy guidelines.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Policy
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-px">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all outline-none ${
            activeTab === 'directory'
              ? 'border-emerald-500 text-emerald-450 bg-emerald-500/[0.02]'
              : 'border-transparent text-zinc-450 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-1.5" /> Policies Directory
        </button>
        <button
          onClick={() => setActiveTab('acceptance')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all outline-none ${
            activeTab === 'acceptance'
              ? 'border-emerald-500 text-emerald-450 bg-emerald-500/[0.02]'
              : 'border-transparent text-zinc-450 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4 inline mr-1.5" /> Employee Policy Acceptance
        </button>
      </div>

      {/* Filters (Dynamic for tabs) */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'directory' ? "Search policies by title or description..." : "Search acceptance by employee or policy..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        {activeTab === 'directory' && (
          <div className="relative w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              <option value="ENVIRONMENTAL" className="bg-slate-900">Environmental (E)</option>
              <option value="SOCIAL" className="bg-slate-900">Social (S)</option>
              <option value="GOVERNANCE" className="bg-slate-900">Governance (G)</option>
              <option value="ETHICAL" className="bg-slate-900">Ethical Standards</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Table view */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : activeTab === 'directory' ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-zinc-400 uppercase bg-black/25">
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
                          <span className="text-[10px] font-normal text-slate-400 line-clamp-1">{p.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryBadgeClass(p.category)}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300">
                        {activeVer ? `v${activeVer.versionString}` : (p.versions && p.versions[0] ? `v${p.versions[0].versionString}` : 'v1.0')}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString() : 'Immediate'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-450 font-bold">
                        {getAcknowledgementRate(p)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Employee policy acceptance list */
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-zinc-400 uppercase bg-black/25">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Policy</th>
                  <th className="px-6 py-4 font-medium">Accepted</th>
                  <th className="px-6 py-4 font-medium">Version</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 rounded-tr-lg font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAcks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                      No policy acceptance records found.
                    </td>
                  </tr>
                ) : filteredAcks.map((ack) => (
                  <tr key={ack.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex flex-col">
                      <span>{ack.employeeName}</span>
                      <span className="text-[9px] font-normal text-zinc-500">{ack.employeeCode}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-200">{ack.policyTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ack.status === 'Accepted' || ack.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'
                          : ack.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-450 border-amber-500/20'
                      }`}>
                        {ack.status === 'Accepted' ? 'Yes' : ack.status === 'Rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">v{ack.version}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {ack.acceptedAt ? new Date(ack.acceptedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ack.status === 'Pending' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleUpdateAck(ack.id, 'ACCEPT')}
                            className="p-1 px-2 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded text-emerald-400 transition-all flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Accept Policy
                          </button>
                          <button
                            onClick={() => handleUpdateAck(ack.id, 'REJECT')}
                            className="p-1 px-2 text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded text-rose-400 transition-all flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      ) : ack.status === 'Rejected' ? (
                        <button
                          onClick={() => handleUpdateAck(ack.id, 'ACCEPT')}
                          className="p-1 px-2 text-[10px] font-bold bg-zinc-800 border border-zinc-700 hover:bg-emerald-500 hover:text-black rounded text-zinc-400 transition-all flex items-center gap-1 ml-auto"
                        >
                          Re-Accept
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-550 font-semibold italic">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-zinc-950 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white">Create Corporate Policy</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePolicy} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Policy Category</label>
                <select
                  required
                  value={newPolicy.category}
                  onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value="ENVIRONMENTAL" className="bg-zinc-900">Environmental (E)</option>
                  <option value="SOCIAL" className="bg-zinc-900">Social (S)</option>
                  <option value="GOVERNANCE" className="bg-zinc-900">Governance (G)</option>
                  <option value="ETHICAL" className="bg-zinc-900">Ethical Standards</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. Anti-Bribery & Corruption Policy"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none text-xs"
                  placeholder="Summarize the rules and organizational boundaries..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Initial Version</label>
                  <input
                    type="text"
                    required
                    value={newPolicy.versionString}
                    onChange={(e) => setNewPolicy({...newPolicy, versionString: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Effective Date</label>
                  <input
                    type="date"
                    required
                    value={newPolicy.effectiveDate}
                    onChange={(e) => setNewPolicy({...newPolicy, effectiveDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Revision Change Summary</label>
                <input
                  type="text"
                  required
                  value={newPolicy.changeSummary}
                  onChange={(e) => setNewPolicy({...newPolicy, changeSummary: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-zinc-950">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-bold text-xs shadow-lg shadow-emerald-500/10"
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
