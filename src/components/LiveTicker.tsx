"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

const MOCK_EVENTS = [
  { id: 1, type: "success", text: "LOGISTICS SEC-4: Route optimization active. (-1.2 tCO2e/hr)" },
  { id: 2, type: "info", text: "WORKDAY API: Diversity metrics sync complete. (Delta: +0.4%)" },
  { id: 3, type: "warning", text: "FACILITY C: Energy spike detected in cooling systems." },
  { id: 4, type: "success", text: "SAP NODE: Supply chain audit verified." },
  { id: 5, type: "info", text: "NEURAL ENGINE: Compiling Q3 trajectory forecast..." },
];

export default function LiveTicker() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-card/95 backdrop-blur-md border-t border-border z-50 flex items-center overflow-hidden text-[10px] font-mono uppercase tracking-widest md:pl-72">
      <div className="flex items-center gap-2 px-4 bg-primary/10 text-primary border-r border-border h-full shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
        <Activity size={12} className="animate-pulse" />
        <span className="font-bold">LIVE TELEMETRY</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        {/* We use a simple CSS animation for the marquee effect */}
        <div className="whitespace-nowrap flex gap-12 animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] px-4 cursor-default">
          {[...MOCK_EVENTS, ...MOCK_EVENTS, ...MOCK_EVENTS].map((event, i) => (
            <div key={`${event.id}-${i}`} className="flex items-center gap-2">
              {event.type === "success" && <CheckCircle2 size={12} className="text-emerald-500" />}
              {event.type === "warning" && <AlertTriangle size={12} className="text-amber-500" />}
              {event.type === "info" && <Zap size={12} className="text-sky-500" />}
              <span className={
                event.type === "success" ? "text-emerald-600 dark:text-emerald-400" :
                event.type === "warning" ? "text-amber-600 dark:text-amber-500" :
                "text-sky-600 dark:text-sky-400"
              }>
                {event.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
