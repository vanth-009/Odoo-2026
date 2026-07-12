import React from 'react';
import { prisma } from '@/lib/db';
import GoalsManager from '@/environment/components/GoalsManager';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';
import { Department } from '@/environment/types';

export const dynamic = 'force-dynamic';

export default async function SustainabilityGoalsPage() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });

    const typedDepts: Department[] = departments.map(d => ({
      ...d,
      currentEmissions: 0,
      status: d.status as 'On Track' | 'Warning' | 'Critical',
      trend: d.trend as 'up' | 'down'
    }));

    return (
      <GoalsManager 
        departments={typedDepts} 
      />
    );
  } catch (error: any) {
    console.error('Failed to load sustainability goals page dependencies:', error);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-200 p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-zinc-100">Database Connection Required</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The EcoSphere sustainability goals registry needs to connect to the MySQL database.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left space-y-2 font-mono text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5 font-sans font-semibold text-zinc-300 mb-1 border-b border-zinc-850 pb-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Initial Setup Instructions</span>
            </div>
            <div>
              <span className="text-emerald-400">1. Update database URL:</span>
              <p className="text-zinc-500 mt-0.5">Check DATABASE_URL in the `.env` file.</p>
            </div>
            <div>
              <span className="text-emerald-400">2. Run migrations & seed data:</span>
              <p className="text-zinc-500 mt-0.5">Execute: <code className="text-zinc-300">npx prisma db push</code> then <code className="text-zinc-300">node prisma/seed.js</code></p>
            </div>
          </div>

          <div className="pt-2">
            <a 
              href="/environment/goals" 
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold rounded-lg transition-colors border border-zinc-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </a>
          </div>
        </div>
      </div>
    );
  }
}
