"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, ClipboardCheck, Calendar, Shield, X, AlertTriangle } from 'lucide-react';

interface Audit {
  id: string;
  title: string;
  scope: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  auditorName: string;
  auditorEmail: string;
  findings: {
    id: string;
    title: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'REMEDIATED' | 'ACCEPTED_RISK';
  }[];
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  // Form State
  const [newAudit, setNewAudit] = useState({
    title: '',
    scope: '',
    startDate: '',
    endDate: '',
    auditorName: '',
    auditorEmail: '',
    status: 'SCHEDULED'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/governance/audits');
      if (res.ok) {
        const json = await res.json();
        setAudits(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/governance/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAudit)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        // Reset form
        setNewAudit({
          title: '',
          scope: '',
          startDate: '',
          endDate: '',
          auditorName: '',
          auditorEmail: '',
          status: 'SCHEDULED'
        });
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Failed to schedule audit.');
      }
    } catch (error) {
      console.error('Error scheduling audit:', error);
    }
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          audit.auditorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          audit.scope.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SCHEDULED':
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
          <h3 className="text-xl font-bold text-white">Audits &amp; Findings</h3>
          <p className="text-slate-400 text-sm mt-1">Schedule and monitor operational audit timelines and findings report status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Audit
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audits by title, scope, or auditor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="relative w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="ALL" className="bg-slate-900">All Statuses</option>
            <option value="SCHEDULED" className="bg-slate-900">Scheduled</option>
            <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
            <option value="COMPLETED" className="bg-slate-900">Completed</option>
          </select>
        </div>
      </div>

      {/* Audits List Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-black/20">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-medium">Audit Title</th>
                    <th className="px-6 py-4 font-medium">Scope</th>
                    <th className="px-6 py-4 font-medium">Auditor</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium">Findings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                        No audits found matching filters.
                      </td>
                    </tr>
                  ) : filteredAudits.map((a) => (
                    <tr 
                      key={a.id} 
                      onClick={() => setSelectedAudit(a)}
                      className={`cursor-pointer transition-colors ${selectedAudit?.id === a.id ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-450">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        <span>{a.title}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{a.scope}</td>
                      <td className="px-6 py-4 text-slate-300">{a.auditorName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {a.findings?.length > 0 ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-500/10 text-red-400 border border-red-500/20">
                            {a.findings.length} findings
                          </span>
                        ) : a.status === 'COMPLETED' ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Clean
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Details & Findings Sidebar Panel */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[400px]">
            {selectedAudit ? (
              <div className="space-y-6 flex flex-col h-full">
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{selectedAudit.title}</h4>
                  <p className="text-xs text-slate-400">Scope: {selectedAudit.scope}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Auditor</span>
                    <span className="text-xs font-medium text-slate-200">{selectedAudit.auditorName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Dates</span>
                    <span className="text-xs font-medium text-slate-200">
                      {new Date(selectedAudit.startDate).toLocaleDateString()} - {new Date(selectedAudit.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Audit Findings ({selectedAudit.findings?.length || 0})</h5>
                  <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
                    {selectedAudit.findings?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No findings reported in this audit.</p>
                    ) : (
                      selectedAudit.findings.map(finding => (
                        <div key={finding.id} className="p-3 bg-black/20 border border-white/5 rounded-lg">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <span className="font-semibold text-xs text-slate-100">{finding.title}</span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                              finding.severity === 'HIGH' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {finding.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{finding.description}</p>
                          <div className="mt-2 text-[10px] text-slate-500">Status: {finding.status}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <ClipboardCheck className="w-12 h-12 mb-2 text-slate-600" />
                <h4 className="font-medium text-sm text-slate-300 mb-1">No Audit Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select an audit from the list to view auditor, findings, and schedule timelines.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Schedule Governance Audit</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAudit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Audit Title</label>
                <input
                  type="text"
                  required
                  value={newAudit.title}
                  onChange={(e) => setNewAudit({...newAudit, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. Q3 SOC 2 Security Compliance Audit"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Scope</label>
                <input
                  type="text"
                  required
                  value={newAudit.scope}
                  onChange={(e) => setNewAudit({...newAudit, scope: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. Security / Internal Controls"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newAudit.startDate}
                    onChange={(e) => setNewAudit({...newAudit, startDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newAudit.endDate}
                    onChange={(e) => setNewAudit({...newAudit, endDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Auditor Name</label>
                  <input
                    type="text"
                    required
                    value={newAudit.auditorName}
                    onChange={(e) => setNewAudit({...newAudit, auditorName: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="e.g. Deloitte"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Auditor Email</label>
                  <input
                    type="email"
                    required
                    value={newAudit.auditorEmail}
                    onChange={(e) => setNewAudit({...newAudit, auditorEmail: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="e.g. auditor@deloitte.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Audit Status</label>
                <select
                  required
                  value={newAudit.status}
                  onChange={(e) => setNewAudit({...newAudit, status: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value="SCHEDULED" className="bg-slate-900">Scheduled</option>
                  <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
                  <option value="COMPLETED" className="bg-slate-900">Completed</option>
                </select>
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
                  Schedule Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
