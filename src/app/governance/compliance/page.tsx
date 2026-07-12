"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, ShieldAlert, FileText, CheckCircle, X, ExternalLink } from 'lucide-react';

interface Evidence {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'REMEDIATED' | 'ACCEPTED_RISK';
  remediationDeadline: string;
  remediatedAt: string | null;
  remediationOwner: string;
  evidence: Evidence[];
}

export default function CompliancePage() {
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setCategoryFilter] = useState('ALL');
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  // Form State for new Evidence
  const [newEvidence, setNewEvidence] = useState({
    title: '',
    description: '',
    fileUrl: '',
    uploadedBy: 'System Admin'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/governance/compliance');
      if (res.ok) {
        const json = await res.json();
        setIssues(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching compliance issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    try {
      const res = await fetch(`/api/governance/compliance/${selectedIssue.id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvidence)
      });
      if (res.ok) {
        setIsEvidenceModalOpen(false);
        // Refresh local state
        await fetchData();
        // Update selected issue to show the new evidence
        const updatedRes = await fetch('/api/governance/compliance');
        if (updatedRes.ok) {
          const json = await updatedRes.json();
          const match = (json.data || []).find((i: any) => i.id === selectedIssue.id);
          if (match) setSelectedIssue(match);
        }
        // Reset form
        setNewEvidence({
          title: '',
          description: '',
          fileUrl: '',
          uploadedBy: 'System Admin'
        });
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Failed to add evidence.');
      }
    } catch (error) {
      console.error('Error adding evidence:', error);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LOW':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'REMEDIATED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'UNDER_INVESTIGATION':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'OPEN':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Compliance &amp; Evidence</h3>
        <p className="text-slate-400 text-sm mt-1">Track compliance risk alerts, remediation owner tasks, and submit audit evidence files.</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search compliance issues by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="relative w-48">
          <select
            value={severityFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="ALL" className="bg-slate-900">All Severities</option>
            <option value="HIGH" className="bg-slate-900">High Risk</option>
            <option value="MEDIUM" className="bg-slate-900">Medium Risk</option>
            <option value="LOW" className="bg-slate-900">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
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
                    <th className="px-6 py-4 rounded-tl-lg font-medium">Compliance Issue</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Owner</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                        No compliance issues found matching filters.
                      </td>
                    </tr>
                  ) : filteredIssues.map((issue) => (
                    <tr 
                      key={issue.id} 
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer transition-colors ${selectedIssue?.id === issue.id ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-450">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <span>{issue.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityBadgeClass(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{issue.remediationOwner}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                        {issue.remediationDeadline ? new Date(issue.remediationDeadline).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Issue Details & Evidence Panel */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[400px]">
            {selectedIssue ? (
              <div className="space-y-6 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{selectedIssue.title}</h4>
                    <p className="text-xs text-slate-400">Owner: {selectedIssue.remediationOwner}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityBadgeClass(selectedIssue.severity)}`}>
                    {selectedIssue.severity}
                  </span>
                </div>

                <div className="bg-black/20 border border-white/5 p-3 rounded-lg">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Description</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedIssue.description}</p>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remediation Evidence ({selectedIssue.evidence?.length || 0})</h5>
                    <button 
                      onClick={() => setIsEvidenceModalOpen(true)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center font-medium gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  
                  <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1">
                    {selectedIssue.evidence?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No evidence items submitted yet.</p>
                    ) : (
                      selectedIssue.evidence.map(item => (
                        <div key={item.id} className="p-3 bg-black/20 border border-white/5 rounded-lg flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-slate-100">{item.title}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">{item.description}</span>
                            <span className="text-[9px] text-slate-500 mt-2">By {item.uploadedBy} on {new Date(item.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          {item.fileUrl && (
                            <a 
                              href={item.fileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-1 hover:bg-white/10 rounded text-emerald-400 transition-colors"
                              title="Open file link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <AlertTriangle className="w-12 h-12 mb-2 text-slate-600" />
                <h4 className="font-medium text-sm text-slate-300 mb-1">No Issue Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select an active compliance risk alert from the table to view remediation status, deadline dates, and linked evidence items.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isEvidenceModalOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Submit Compliance Evidence</h3>
              <button 
                onClick={() => setIsEvidenceModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvidence} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Evidence Title</label>
                <input
                  type="text"
                  required
                  value={newEvidence.title}
                  onChange={(e) => setNewEvidence({...newEvidence, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. ISO 27001 Internal Review Certificate"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence({...newEvidence, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  placeholder="Explain how this file remediates the compliance issue..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Evidence Document URL / Path</label>
                <input
                  type="text"
                  required
                  value={newEvidence.fileUrl}
                  onChange={(e) => setNewEvidence({...newEvidence, fileUrl: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. /uploads/iso-cert-2026.pdf"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Uploaded By</label>
                <input
                  type="text"
                  required
                  value={newEvidence.uploadedBy}
                  onChange={(e) => setNewEvidence({...newEvidence, uploadedBy: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-xs"
                >
                  Submit Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
