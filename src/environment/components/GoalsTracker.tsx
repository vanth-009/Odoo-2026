'use client';

import React, { useState } from 'react';
import { Target, User, Calendar, Plus, AlertCircle, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';
import { SustainabilityGoal } from '../types';
import Modal from './Modal';

interface GoalsTrackerProps {
  goals: SustainabilityGoal[];
  departments: { id: string; name: string }[];
  onGoalCreated: () => void;
  isLoading?: boolean;
}

export default function GoalsTracker({ goals, departments, onGoalCreated, isLoading }: GoalsTrackerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    owner: '',
    target: '',
    deadline: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Goal name must be at least 3 characters';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select a department';
    }
    if (!formData.owner || formData.owner.trim().length < 2) {
      newErrors.owner = 'Owner name must be at least 2 characters';
    }
    if (!formData.target || isNaN(Number(formData.target)) || Number(formData.target) <= 0) {
      newErrors.target = 'Target carbon savings must be greater than 0';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Please select a deadline';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/environment/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          target: Number(formData.target)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create goal');
      }

      setFormData({ name: '', departmentId: '', owner: '', target: '', deadline: '' });
      setIsModalOpen(false);
      onGoalCreated();
    } catch (err: any) {
      setErrors({ apiError: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 animate-pulse h-full min-h-[350px]">
        <div className="h-6 bg-[#09090b] rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-[#09090b] rounded"></div>
          <div className="h-24 bg-[#09090b] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/10 transition-premium h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#1f1f23]/40">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505 font-mono">Milestone Targets</span>
            <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Sustainability Targets</h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium border border-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {goals.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-[#27272a]/35 rounded-xl bg-[#09090b]/30">
              <Target className="w-8 h-8 mb-2 opacity-50 text-zinc-650 animate-pulse" />
              <span className="text-xs font-medium">No active sustainability goals found.</span>
            </div>
          ) : (
            goals.map((goal) => {
              const r = 16;
              const circumference = 2 * Math.PI * r;
              const strokeOffset = circumference - (goal.progress / 100) * circumference;

              // Color configuration based on status/risk
              const progressStrokeColor = 
                goal.status === 'Completed' ? 'stroke-emerald-500' :
                goal.status === 'Behind Schedule' ? 'stroke-rose-500' : 'stroke-blue-500';

              const riskBadgeColor = 
                goal.risk === 'High' ? 'text-rose-455 bg-rose-500/10 border-rose-500/20' :
                goal.risk === 'Medium' ? 'text-amber-455 bg-amber-500/10 border-amber-500/20' :
                goal.risk === 'Low' ? 'text-emerald-455 bg-emerald-500/10 border-emerald-500/20' :
                'text-zinc-500 bg-[#09090b] border-[#27272a]/30';

              const forecast = 
                goal.status === 'Completed' ? 'Achieved compliance' :
                goal.status === 'Behind Schedule' ? 'Risk of delay: 18 days' : 'On path to achieve';

              return (
                <div 
                  key={goal.id} 
                  className="bg-[#09090b]/60 border border-[#27272a]/20 rounded-xl p-4 flex flex-col gap-3 hover:border-zinc-800 transition-premium shadow-[inset_0_1px_0_rgba(255,255,255,0.01)]"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[8.5px] text-zinc-500 font-mono tracking-wider uppercase">{goal.department}</span>
                      <h5 className="text-zinc-200 text-xs font-bold leading-normal truncate">{goal.name}</h5>
                    </div>

                    {/* SVG Circular Progress Meter */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r={r}
                          className="stroke-[#1f1f23]"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r={r}
                          className={`${progressStrokeColor} transition-all duration-1000`}
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute font-mono text-[9px] font-bold text-zinc-300">{goal.progress}%</span>
                    </div>
                  </div>

                  {/* Visual Timeline Details */}
                  <div className="flex justify-between items-center bg-[#09090b]/80 border border-[#27272a]/20 p-2.5 rounded-xl text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      <span className="text-zinc-500 font-medium">Risk:</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border text-[8px] uppercase tracking-wider ${riskBadgeColor}`}>
                        {goal.risk}
                      </span>
                    </div>
                    <div className="text-right text-zinc-500 font-medium">
                      Deadline: 
                      <span className="font-mono text-zinc-300 font-semibold ml-1">{new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-zinc-500 pt-2 border-t border-[#1f1f23]/30">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-550" />
                      {goal.owner}
                    </span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      goal.status === 'Behind Schedule' ? 'text-rose-400' : 
                      goal.status === 'Completed' ? 'text-emerald-400' : 'text-zinc-400'
                    }`}>
                      {goal.status === 'Behind Schedule' ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      {forecast}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Goal Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setErrors({});
        }} 
        title="Register Sustainability Target"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.apiError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.apiError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Target Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Electrify 80% logistics transit fleet"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
            />
            {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Department Node</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="">Select Dept</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="text-[10px] text-rose-400 mt-1">{errors.departmentId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Stakeholder Owner</label>
              <input
                type="text"
                name="owner"
                placeholder="e.g. Alan Turing"
                value={formData.owner}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {errors.owner && <p className="text-[10px] text-rose-400 mt-1">{errors.owner}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Carbon Offset Target (tCO2e)</label>
              <input
                type="number"
                name="target"
                placeholder="e.g. 50.0"
                step="0.1"
                value={formData.target}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {errors.target && <p className="text-[10px] text-rose-400 mt-1">{errors.target}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Target Milestone Date</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {errors.deadline && <p className="text-[10px] text-rose-400 mt-1">{errors.deadline}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4.5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-[#09090b] text-xs font-bold rounded-xl transition-premium"
            >
              {isSubmitting ? 'Registering...' : 'Register Target'}
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
