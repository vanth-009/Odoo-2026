import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface JoinActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: number | null;
  activityTitle: string;
  onSuccess: () => void;
}

export default function JoinActivityModal({ isOpen, onClose, activityId, activityTitle, onSuccess }: JoinActivityModalProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [hours, setHours] = useState('2');
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && employees.length === 0) {
      fetch('/api/social/employees?limit=50')
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setEmployees(data.data);
            if (data.data.length > 0) setSelectedEmployee(data.data[0].id);
          }
        });
    }
  }, [isOpen, employees.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityId || !selectedEmployee) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/social/participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          activityId,
          hoursContributed: parseFloat(hours),
          proofUrl
        })
      });
      
      if (res.ok) {
        onSuccess();
        onClose();
        // Reset form
        setHours('2');
        setProofUrl('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to join activity');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Join ${activityTitle}`}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
        
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Select Employee (Simulated Login)</label>
          <select 
            required 
            value={selectedEmployee} 
            onChange={e => setSelectedEmployee(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id} className="bg-slate-900">{emp.firstName} {emp.lastName} ({emp.department?.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Expected Hours to Contribute</label>
          <input 
            type="number" 
            min="0.5" 
            step="0.5" 
            required 
            value={hours} 
            onChange={e => setHours(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Proof URL / Notes (Optional)</label>
          <input 
            type="text" 
            value={proofUrl} 
            onChange={e => setProofUrl(e.target.value)}
            placeholder="e.g. photo link or details"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-xs flex items-center"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
