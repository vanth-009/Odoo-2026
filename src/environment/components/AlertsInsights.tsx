import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { EnvironmentalAlert } from '../types';

interface AlertsInsightsProps {
  alerts: EnvironmentalAlert[];
}

export default function AlertsInsights({ alerts }: AlertsInsightsProps) {
  // Static AI Environmental Insights (AI Copilot style)
  const aiInsights = [
    {
      title: 'Boiler Run Spike Detected',
      desc: 'Manufacturing emissions spiked by 18% during the second week of this month due to Assembly Line A boiler runs.',
      impact: 'High Impact',
      impactColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Fleet Electrification Progress',
      desc: 'Transitioning to hybrid trucks in Logistics & Fleet saved an estimated 14.5 tCO2e over the last 30 days.',
      impact: 'Positive Shift',
      impactColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Office Footprint Optimization',
      desc: 'Smart thermostats and HQ HVAC schedule modifications reduced electricity emissions for the fourth consecutive month.',
      impact: 'Steady Gain',
      impactColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Alerts */}
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-zinc-100">Environmental Incident Alerts</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Real-time target breaches and scheduling risks</p>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
          {alerts.map((alert) => {
            const SeverityIcon = 
              alert.severity === 'high' ? ShieldAlert :
              alert.severity === 'medium' ? AlertTriangle : Info;

            const severityClass = 
              alert.severity === 'high' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' :
              alert.severity === 'medium' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
              'text-blue-400 border-blue-500/20 bg-blue-500/5';

            return (
              <div 
                key={alert.id}
                className={`p-4 border rounded-xl flex items-start gap-3 transition-colors ${severityClass}`}
              >
                <SeverityIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-200 leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-zinc-400 font-semibold">
                    <span className="text-zinc-500 font-normal">Action Required: </span>
                    {alert.action}
                  </p>
                  <span className="text-[9px] text-zinc-650 font-mono block mt-1.5">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
            Executive Insights
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">AI-generated environmental intelligence</p>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto max-h-[260px] pr-1">
          {aiInsights.map((insight, idx) => (
            <div 
              key={idx}
              className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 space-y-2 hover:border-zinc-800 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-zinc-200">{insight.title}</span>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider shrink-0 ${insight.impactColor}`}>
                  {insight.impact}
                </span>
              </div>
              <p className="text-[10px] text-zinc-450 leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}
