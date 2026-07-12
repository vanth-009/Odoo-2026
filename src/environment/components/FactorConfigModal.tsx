'use client';

import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { EmissionFactor } from '../types';
import Modal from './Modal';

interface FactorConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFactorUpdated: () => void;
}

export default function FactorConfigModal({ isOpen, onClose, onFactorUpdated }: FactorConfigModalProps) {
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  // Fetch factors when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFactors();
    }
  }, [isOpen]);

  const fetchFactors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/environment/factors');
      if (!res.ok) throw new Error('Failed to load emission factors');
      const data = await res.json();
      setFactors(data);
      
      // Initialize edit values
      const initialValues: Record<string, string> = {};
      data.forEach((f: EmissionFactor) => {
        initialValues[f.id] = f.value.toString();
      });
      setEditValues(initialValues);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (id: string, val: string) => {
    setEditValues(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = async (id: string) => {
    const rawVal = editValues[id];
    if (!rawVal || isNaN(Number(rawVal)) || Number(rawVal) <= 0) {
      setError('Emission factor value must be a valid number greater than 0.');
      return;
    }

    setUpdatingId(id);
    setError('');
    try {
      const res = await fetch('/api/environment/factors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          value: Number(rawVal)
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update emission factor');
      }

      onFactorUpdated();
      // Reload local state
      fetchFactors();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Carbon Emission Factors">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <p className="text-zinc-400 text-xs">
            Edit carbon co-efficient multipliers used to convert raw energy and fuel consumption to CO2 equivalents.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
            <span className="text-xs text-zinc-500 font-medium">Fetching factor coefficients...</span>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {factors.map((factor) => (
              <div 
                key={factor.id}
                className="bg-zinc-950 border border-zinc-850 rounded-xl p-3.5 flex items-center justify-between gap-4 hover:border-zinc-800 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">{factor.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold border text-zinc-400 border-zinc-800 bg-zinc-900 uppercase">
                      {factor.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">key: {factor.key}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.001"
                      value={editValues[factor.id] || ''}
                      onChange={(e) => handleValueChange(factor.id, e.target.value)}
                      className="w-24 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 text-right pr-6"
                    />
                    <span className="text-[9px] text-zinc-500 absolute right-2 font-medium">val</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono w-16">{factor.unit.split('/')[1] || factor.unit}</span>
                  
                  <button
                    onClick={() => handleSave(factor.id)}
                    disabled={updatingId === factor.id}
                    className="p-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 disabled:opacity-40 transition-colors"
                    title="Save Changes"
                  >
                    {updatingId === factor.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Settings className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-zinc-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </Modal>
  );
}
