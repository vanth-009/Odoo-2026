"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Check, X, RefreshCw, Eye, ExternalLink, HelpCircle, 
  AlertTriangle, ShieldAlert, Award, FileCode, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  challengeXp: number;
  challengeCategory: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  progress: number;
  proof: string;
  approvalStatus: string;
  submittedAt: string | null;
  approvedAt: string | null;
  approvedBy: string;
}

export default function ChallengeParticipationPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // View Proof Modal State
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'RESUBMIT'>('APPROVE');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gamification/participation');
      if (res.ok) {
        const json = await res.json();
        setSubmissions(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAction = (sub: Submission, type: 'APPROVE' | 'REJECT' | 'RESUBMIT') => {
    setSelectedSub(sub);
    setActionType(type);
    setFeedbackText('');
    setIsActionModalOpen(true);
  };

  const handleProcessSubmission = async () => {
    if (!selectedSub) return;
    try {
      const res = await fetch('/api/gamification/participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participationId: selectedSub.id,
          action: actionType,
          feedback: feedbackText,
          approvedBy: 'Sarah Connor'
        })
      });

      if (res.ok) {
        toast.success(`Submission marked as ${actionType === 'APPROVE' ? 'Approved!' : actionType === 'REJECT' ? 'Rejected' : 'Resubmit Requested'}`);
        setIsActionModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.challengeTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-450 border border-red-500/20';
      case 'RESUBMIT_REQUESTED':
        return 'bg-amber-500/10 text-amber-450 border border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-450 border border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Challenge Submissions Review</h3>
        <p className="text-slate-400 text-sm mt-1">Review employee compliance proof uploads, allocate XP rewards, and verify badge requirements.</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions by employee name or challenge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="relative w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RESUBMIT_REQUESTED">Resubmit Requested</option>
          </select>
        </div>
      </div>

      {/* Main Submissions Table */}
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
                  <th className="px-6 py-4 font-medium">Challenge</th>
                  <th className="px-6 py-4 font-medium">Completion Progress</th>
                  <th className="px-6 py-4 font-medium">Proof / Evidence</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                      No challenge participations found matching filters.
                    </td>
                  </tr>
                ) : filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Employee profile details */}
                    <td className="px-6 py-4 font-bold text-white flex flex-col">
                      <span>{sub.employeeName}</span>
                      <span className="text-[9px] font-normal text-zinc-500">{sub.departmentName} ({sub.employeeCode})</span>
                    </td>

                    {/* Challenge name */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-200 block">{sub.challengeTitle}</span>
                      <span className="text-[9px] text-amber-400 font-bold block mt-0.5">+{sub.challengeXp} XP Payout</span>
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-4 font-semibold text-slate-300">
                      <div className="flex items-center gap-2">
                        <span>{sub.progress}%</span>
                        <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div className="bg-emerald-500 h-full" style={{ width: `${sub.progress}%` }} />
                        </div>
                      </div>
                    </td>

                    {/* Proof text */}
                    <td className="px-6 py-4 max-w-[200px] truncate text-slate-400 font-mono text-[10.5px]">
                      {sub.proof ? (
                        <div className="flex items-center gap-1.5 cursor-pointer text-emerald-450 hover:text-emerald-450/80" onClick={() => handleOpenAction(sub, 'APPROVE')}>
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.proof}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">No proof files uploaded</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(sub.approvalStatus)}`}>
                        {sub.approvalStatus === 'RESUBMIT_REQUESTED' ? 'Resubmit' : sub.approvalStatus}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      {sub.approvalStatus === 'PENDING' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleOpenAction(sub, 'APPROVE')}
                            className="p-1 px-2 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded text-emerald-400 transition-all flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenAction(sub, 'RESUBMIT')}
                            className="p-1 px-2 text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-black rounded text-amber-405 transition-all flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Resubmit
                          </button>
                          <button
                            onClick={() => handleOpenAction(sub, 'REJECT')}
                            className="p-1 px-2 text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded text-rose-400 transition-all flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-600 italic">No pending actions</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proof Viewer / Process Action Modal */}
      {isActionModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <div>
                <h3 className="text-base font-bold text-white">Review Submission Proof</h3>
                <p className="text-[10px] text-zinc-550 mt-0.5">{selectedSub.employeeName} - {selectedSub.challengeTitle}</p>
              </div>
              <button 
                onClick={() => setIsActionModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* Proof description details */}
              <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-xs leading-relaxed">
                <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Submitted Evidence Proof</span>
                <p className="text-slate-200 font-mono bg-white/[0.01] p-2 rounded border border-white/5">
                  {selectedSub.proof || 'No proof details submitted.'}
                </p>
              </div>

              {/* Status Action type selection */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-2">Review Audit Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType('APPROVE')}
                    className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                      actionType === 'APPROVE'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    Approve Payout
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('RESUBMIT')}
                    className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                      actionType === 'RESUBMIT'
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    Ask Resubmit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('REJECT')}
                    className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                      actionType === 'REJECT'
                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-450'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    Reject Audit
                  </button>
                </div>
              </div>

              {/* Audit feedback notes */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Auditor Feedback Notes</label>
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Explain reasons for rejection or resubmission request..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessSubmission}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Confirm Decision
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
