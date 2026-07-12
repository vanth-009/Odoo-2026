import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, Sparkles, Brain } from 'lucide-react';
import { EnvironmentalAlert } from '../types';

interface AlertsInsightsProps {
  alerts: EnvironmentalAlert[];
}

export default function AlertsInsights({ alerts }: AlertsInsightsProps) {
  // Natural-language AI Environmental Insights (AI Copilot style)
  const aiInsights = [
    {
      title: 'Boiler Load Anomalies',
      desc: 'Manufacturing emissions rose by 14% this month due to intensive boiler heating runcycles on Assembly Line A.',
      impact: 'High Impact',
      impactColor: 'text-rose-405 bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'IT Power Efficiency Gain',
      desc: 'Liquid immersion server rack cooling systems deployed at IT Data Centers reduced power overhead by 12.5%.',
      impact: 'Positive Shift',
      impactColor: 'text-emerald-405 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Logistics Fleet Electrification',
      desc: 'Logistics carbon outputs decreased by 8.4% MoM and remains projected to achieve targets ahead of schedule.',
      impact: 'Steady Progress',
      impactColor: 'text-blue-405 bg-blue-500/10 border-blue-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Real-time Incident Alerts (Col-span 7) */}
      <div className="lg:col-span-7 bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/10 transition-premium">
        <div>
          <div className="border-b border-[#1f1f23]/40 pb-4 mb-4">
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505 font-mono">Incident Ledger</span>
            <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Environmental Incidents</h3>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
            {alerts.map((alert) => {
              const SeverityIcon = 
                alert.severity === 'high' ? ShieldAlert :
                alert.severity === 'medium' ? AlertTriangle : Info;

              const severityClass = 
                alert.severity === 'high' ? 'text-rose-400 border-rose-500/25 bg-rose-955/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.01)]' :
                alert.severity === 'medium' ? 'text-amber-400 border-amber-500/25 bg-amber-955/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.01)]' :
                'text-blue-400 border-blue-500/25 bg-blue-955/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.01)]';

              return (
                <div 
                  key={alert.id}
                  className={`p-3.5 border rounded-xl flex items-start gap-3.5 transition-premium ${severityClass}`}
                >
                  <SeverityIcon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-200 leading-relaxed">{alert.message}</p>
                    <p className="text-[9.5px] text-zinc-450 leading-relaxed font-medium">
                      <span className="text-zinc-500 font-bold">Mitigation Action: </span>
                      {alert.action}
                    </p>
                    <span className="text-[8px] text-zinc-550 font-mono block mt-1">
                      Logged: {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Executive Insights Panel (Col-span 5) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#141417]/80 to-emerald-955/5 border border-[#27272a]/30 rounded-2xl p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/10 transition-premium">
        <div>
          <div className="border-b border-[#1f1f23]/40 pb-4 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505 font-mono">Cognitive Analysis</span>
              <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-emerald-400" />
                AI Environmental Insights
              </h3>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
            {aiInsights.map((insight, idx) => (
              <div 
                key={idx}
                className="bg-[#09090b]/60 border border-[#27272a]/20 rounded-xl p-3.5 space-y-1.5 hover:border-zinc-800 transition-premium"
              >
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs font-bold text-[#f4f4f5]">{insight.title}</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider shrink-0 ${insight.impactColor}`}>
                    {insight.impact}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
