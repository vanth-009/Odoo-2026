"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, ClipboardCheck, Calendar, Shield, X, AlertTriangle, 
  CheckCircle, FileText, Image, FileCode, ExternalLink, ArrowRight, CornerDownRight, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Evidence {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'image' | 'pdf' | 'document';
  uploadedBy: string;
  createdAt: string;
}

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  dueDate: string | null;
  resolution: string;
  closedDate: string | null;
  evidences: Evidence[];
}

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
    severity: string;
    status: string;
  }[];
  complianceIssues: ComplianceIssue[];
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  // Resolution Form state
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Form State for creating new audit
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
        const dataList = json.data || [];
        setAudits(dataList);
        
        // Refresh selected audit details if active
        if (selectedAudit) {
          const match = dataList.find((a: any) => a.id === selectedAudit.id);
          if (match) setSelectedAudit(match);
        }
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
        toast.success('Audit scheduled successfully!');
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
        toast.error(errJson.error || 'Failed to schedule audit.');
      }
    } catch (error) {
      console.error('Error scheduling audit:', error);
      toast.error('Server execution error.');
    }
  };

  const handleResolveIssue = async (issueId: string) => {
    if (!resolutionText.trim()) {
      toast.error('Please enter resolution description.');
      return;
    }
    setIsResolving(true);
    try {
      const res = await fetch('/api/governance/compliance/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, resolution: resolutionText })
      });
      if (res.ok) {
        toast.success('Compliance issue marked as Resolved!');
        setResolvingIssueId(null);
        setResolutionText('');
        // Refresh lists
        await fetchData();
      } else {
        toast.error('Failed to resolve compliance issue.');
      }
    } catch (err) {
      console.error('Failed to resolve', err);
      toast.error('Connection failure.');
    } finally {
      setIsResolving(false);
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
      case 'Completed':
      case 'RESOLVED':
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN_PROGRESS':
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'SCHEDULED':
      case 'Scheduled':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Audits &amp; Findings</h3>
          <p className="text-slate-400 text-sm mt-1">Schedule and monitor operational audit timelines and findings report status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
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
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="relative w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="ALL" className="bg-slate-900">All Statuses</option>
            <option value="SCHEDULED" className="bg-slate-900">Scheduled</option>
            <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
            <option value="COMPLETED" className="bg-slate-900">Completed</option>
          </select>
        </div>
      </div>

      {/* Audits Main Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Table List */}
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-zinc-400 uppercase bg-black/25">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-medium">Audit Title</th>
                    <th className="px-6 py-4 font-medium">Scope</th>
                    <th className="px-6 py-4 font-medium">Auditor</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium text-center">Compliance Status</th>
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {a.complianceIssues?.length > 0 ? (
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20">
                            {a.complianceIssues.filter(i => i.status !== 'RESOLVED' && i.status !== 'Closed').length} open issues
                          </span>
                        ) : a.status === 'COMPLETED' ? (
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                            Compliant
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Detailed drill-down Panel */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[500px]">
            {selectedAudit ? (
              <div className="space-y-6 flex flex-col h-full overflow-y-auto max-h-[700px] pr-1">
                
                {/* 1. Audit Header */}
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase block">Audit Node</span>
                  <h4 className="text-base font-bold text-white mb-1.5">{selectedAudit.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(selectedAudit.status)}`}>
                      {selectedAudit.status}
                    </span>
                    <span className="text-[10px] text-zinc-400">Scope: {selectedAudit.scope}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-black/25 border border-white/5 p-3 rounded-lg text-xs">
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Lead Auditor</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block">{selectedAudit.auditorName}</span>
                    <span className="text-[9px] text-zinc-550 block">{selectedAudit.auditorEmail}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Timeline Range</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block">
                      {new Date(selectedAudit.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {selectedAudit.endDate ? new Date(selectedAudit.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Ongoing'}
                    </span>
                  </div>
                </div>

                {/* 2. Findings (Audit Findings relation) */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-emerald-500" />
                    Audit Findings ({selectedAudit.findings?.length || 0})
                  </h5>
                  
                  {selectedAudit.findings?.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic pl-5">No direct audit findings registered.</p>
                  ) : (
                    <div className="space-y-2.5 pl-4">
                      {selectedAudit.findings.map(finding => (
                        <div key={finding.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-xs relative">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-slate-200">{finding.title}</span>
                            <span className={`px-1.5 py-0.5 text-[8.5px] font-bold rounded ${getSeverityBadgeClass(finding.severity)}`}>
                              {finding.severity}
                            </span>
                          </div>
                          <p className="text-zinc-400 mt-1 text-[11px] leading-relaxed">{finding.description}</p>
                          <span className="text-[9px] text-zinc-500 block mt-2">Remediation: {finding.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Compliance Issues linked to Audit */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <h5 className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    Linked Compliance Issues ({selectedAudit.complianceIssues?.length || 0})
                  </h5>

                  {selectedAudit.complianceIssues?.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic pl-5">No compliance alerts linked to this audit.</p>
                  ) : (
                    <div className="space-y-4 pl-4">
                      {selectedAudit.complianceIssues.map(issue => (
                        <div key={issue.id} className="p-3.5 bg-black/40 border border-white/10 rounded-xl space-y-3">
                          
                          {/* Title and severity */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-bold text-xs text-white leading-tight">{issue.title}</h6>
                              <span className="text-[9px] text-zinc-550">Due date: {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${getSeverityBadgeClass(issue.severity)}`}>
                                {issue.severity}
                              </span>
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${getStatusBadgeClass(issue.status)}`}>
                                {issue.status}
                              </span>
                            </div>
                          </div>

                          {/* 4. Evidence Uploaded for this issue */}
                          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 text-[11px] space-y-2">
                            <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest">Evidence Submitted Proof ({issue.evidences?.length || 0})</span>
                            {issue.evidences?.length === 0 ? (
                              <p className="text-zinc-550 italic text-[10px]">No evidence proofs uploaded.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {issue.evidences.map(ev => (
                                  <div key={ev.id} className="flex items-center justify-between bg-white/[0.02] p-1.5 rounded border border-white/5">
                                    <span className="truncate max-w-[120px] text-slate-300 flex items-center gap-1 font-semibold">
                                      {ev.fileType === 'image' && <Image className="w-3 h-3 text-amber-400" />}
                                      {ev.fileType === 'pdf' && <FileText className="w-3 h-3 text-emerald-400" />}
                                      {ev.fileType === 'document' && <FileCode className="w-3 h-3 text-blue-400" />}
                                      {ev.title}
                                    </span>
                                    <a href={ev.fileUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 5. Resolution Block */}
                          <div className="bg-white/[0.01] p-2.5 rounded-lg border border-white/5 text-[11px] space-y-1.5">
                            <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest">Remediation Resolution</span>
                            {issue.status === 'RESOLVED' || issue.status === 'Resolved' || issue.status === 'CLOSED' ? (
                              <div>
                                <p className="text-slate-300 font-medium leading-relaxed">{issue.resolution}</p>
                                <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-1.5 font-bold">
                                  <Check className="w-3.5 h-3.5 border border-emerald-500/20 rounded bg-emerald-500/10" />
                                  Resolved on {issue.closedDate ? new Date(issue.closedDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            ) : (
                              <div>
                                {resolvingIssueId === issue.id ? (
                                  <div className="space-y-2 mt-1">
                                    <textarea
                                      rows={2}
                                      value={resolutionText}
                                      onChange={(e) => setResolutionText(e.target.value)}
                                      placeholder="Describe resolving steps..."
                                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setResolvingIssueId(null)}
                                        className="px-2.5 py-1 rounded bg-white/5 text-[10px] text-zinc-300 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isResolving}
                                        onClick={() => handleResolveIssue(issue.id)}
                                        className="px-3.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold text-black disabled:opacity-50"
                                      >
                                        Submit Resolution
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-between items-center">
                                    <span className="text-rose-400 font-bold italic text-[10px]">Remediation Pending</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setResolvingIssueId(issue.id);
                                        setResolutionText('');
                                      }}
                                      className="px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-450 font-bold text-[10px] transition-colors"
                                    >
                                      Resolve Issue
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <ClipboardCheck className="w-12 h-12 mb-2 text-slate-650" />
                <h4 className="font-semibold text-sm text-slate-350 mb-1">No Audit Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select an audit from the list to view lead auditor details, findings timeline logs, linked compliance issues, proofs, and resolutions.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Schedule Audit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white">Schedule Compliance Audit</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAudit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Audit Title</label>
                <input
                  type="text"
                  required
                  value={newAudit.title}
                  onChange={(e) => setNewAudit({...newAudit, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Annual ESG Compliance Audit"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Scope</label>
                <input
                  type="text"
                  required
                  value={newAudit.scope}
                  onChange={(e) => setNewAudit({...newAudit, scope: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Governance / Anti-Bribery Controls"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newAudit.startDate}
                    onChange={(e) => setNewAudit({...newAudit, startDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newAudit.endDate}
                    onChange={(e) => setNewAudit({...newAudit, endDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Auditor Name</label>
                  <input
                    type="text"
                    required
                    value={newAudit.auditorName}
                    onChange={(e) => setNewAudit({...newAudit, auditorName: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. Deloitte"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Auditor Email</label>
                  <input
                    type="email"
                    required
                    value={newAudit.auditorEmail}
                    onChange={(e) => setNewAudit({...newAudit, auditorEmail: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. auditor@deloitte.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Audit Status</label>
                <select
                  required
                  value={newAudit.status}
                  onChange={(e) => setNewAudit({...newAudit, status: e.target.value as any})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="SCHEDULED" className="bg-slate-900">Scheduled</option>
                  <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
                  <option value="COMPLETED" className="bg-slate-900">Completed</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors"
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
