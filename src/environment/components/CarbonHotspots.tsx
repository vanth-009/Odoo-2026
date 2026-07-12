import React from 'react';
import { ShieldAlert, Zap, Flame, Truck, ArrowUpRight } from 'lucide-react';
import { Hotspot } from '../types';

interface CarbonHotspotsProps {
  hotspots: Hotspot[];
  isLoading?: boolean;
}

export default function CarbonHotspots({ hotspots, isLoading }: CarbonHotspotsProps) {
  if (isLoading) {
    return (
      <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-5 animate-pulse h-full min-h-[350px]">
        <div className="h-6 bg-[#09090b] rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-14 bg-[#09090b] rounded"></div>
          <div className="h-14 bg-[#09090b] rounded"></div>
        </div>
      </div>
    );
  }

  // Pre-configured mitigation advisory recommendations based on source/product keyword
  const getAction = (op: string) => {
    const low = op.toLowerCase();
    if (low.includes('boiler') || low.includes('heat')) {
      return 'Upgrade to heat pump loops or induction furnace units.';
    }
    if (low.includes('fleet') || low.includes('route') || low.includes('delivery')) {
      return 'Optimize route sequences or transition logistics vehicles to BEV.';
    }
    if (low.includes('cooling') || low.includes('data')) {
      return 'Deploy liquid immersion cooling or schedule dynamic thermal profiles.';
    }
    return 'Execute localized energy audits and schedule load shedding.';
  };

  const getIcon = (op: string) => {
    const low = op.toLowerCase();
    if (low.includes('boiler') || low.includes('heat') || low.includes('gas')) {
      return Flame;
    }
    if (low.includes('fleet') || low.includes('route') || low.includes('delivery') || low.includes('travel')) {
      return Truck;
    }
    return Zap;
  };

  return (
    <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/10 transition-premium h-full flex flex-col justify-between">
      <div>
        <div className="border-b border-[#1f1f23]/40 pb-4 mb-4">
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505">Anomaly telemetry</span>
          <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Carbon Hotspots</h3>
        </div>

        <div className="space-y-3.5">
          {hotspots.map((spot, idx) => {
            const SpotIcon = getIcon(spot.operation);
            return (
              <div 
                key={idx}
                className="bg-[#09090b]/60 border border-[#27272a]/20 rounded-xl p-3.5 hover:border-zinc-800 transition-premium"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3">
                    <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg shrink-0 mt-0.5">
                      <SpotIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-zinc-205 text-xs font-bold leading-normal truncate">{spot.operation}</h5>
                      <span className="text-[8.5px] text-zinc-500 font-semibold block mt-0.5 font-mono">{spot.department}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-rose-400 flex items-center justify-end">
                      {spot.carbon} t
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-500 ml-0.5" />
                    </span>
                    <span className="text-[8px] text-zinc-550 block font-mono">+{spot.percentage}% share</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1f1f23]/20 text-[9.5px] text-zinc-450 leading-relaxed font-medium">
                  <span className="text-rose-400/90 font-bold uppercase tracking-wider block mb-0.5 text-[8.5px] font-mono">Correction Advisory</span>
                  {getAction(spot.operation)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[8.5px] font-bold text-zinc-300 uppercase tracking-widest block font-mono">Hotspot Threshold Alert</span>
          <p className="text-[9.5px] text-zinc-500 leading-normal font-medium">
            Mitigation advisory is recommended. Hotspots consume 42% of monthly organization carbon quotas.
          </p>
        </div>
      </div>
    </div>
  );
}
