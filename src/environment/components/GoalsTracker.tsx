'use client';

import React, { useState } from 'react';
import { Target, User, Calendar, Plus, AlertCircle, Sparkles } from 'lucide-react';
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

      // Success
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse h-[350px]">
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 bg-zinc-800 rounded"></div>
          <div className="h-28 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Sustainability Goals Tracker</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Active carbon offset and reduction milestones</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-zinc-100 text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[360px] pr-1">
        {goals.length === 0 ? (
          <div className="col-span-2 py-10 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
            <Target className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">No active sustainability goals found.</span>
          </div>
        ) : (
          goals.map((goal) => {
            // progress bar color based on status
            const barColor = 
              goal.status === 'Completed' ? 'bg-emerald-500' :
              goal.status === 'Behind Schedule' ? 'bg-rose-500' : 'bg-blue-500';

            const statusClass = 
              goal.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
              goal.status === 'Behind Schedule' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
              'text-blue-400 bg-blue-500/10 border-blue-500/20';

            return (
              <div 
                key={goal.id} 
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-zinc-200 line-clamp-1">{goal.name}</span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium border ${statusClass} shrink-0`}>
                      {goal.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">{goal.department}</span>

                  {/* Progress details */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-900 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-400" />
                    {goal.owner}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Goal Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setErrors({});
        }} 
        title="Create Sustainability Goal"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.apiError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.apiError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Goal Title</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Reduce corporate travel flight offsets"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
            />
            {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Dept</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="text-[10px] text-rose-400 mt-1">{errors.departmentId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Owner / Stakeholder</label>
              <input
                type="text"
                name="owner"
                placeholder="e.g. Alan Turing"
                value={formData.owner}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
              />
              {errors.owner && <p className="text-[10px] text-rose-400 mt-1">{errors.owner}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Target Savings (tCO2e)</label>
              <input
                type="number"
                name="target"
                placeholder="e.g. 75.0"
                step="0.1"
                value={formData.target}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
              />
              {errors.target && <p className="text-[10px] text-rose-400 mt-1">{errors.target}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Target Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
              />
              {errors.deadline && <p className="text-[10px] text-rose-400 mt-1">{errors.deadline}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-zinc-100 text-xs font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
