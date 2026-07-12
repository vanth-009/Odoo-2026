import React from 'react';
import { prisma } from '@/lib/db';
import AnalyticsManager from '@/environment/components/AnalyticsManager';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DepartmentAnalyticsPage() {
  try {
    // 1. Fetch departments to pass initial layout dependencies
    const dbDepartments = await prisma.department.findMany({
      select: {
        id: true,
        name: true
      }
    });

    return <AnalyticsManager initialDepartments={dbDepartments} />;
  } catch (error: any) {
    console.error('Failed to load department analytics on server:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-200 p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-zinc-100">Database Connection Required</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The EcoSphere Analytics Console needs to connect to the MySQL database. 
              Please verify that your database URL in `.env` is correct.
            </p>
          </div>

          <div className="pt-2">
            <a 
              href="/environment/analytics" 
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
