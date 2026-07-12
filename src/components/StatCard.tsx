import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple";
}

const colorMap = {
  blue: "text-blue-400 border-blue-500/30",
  emerald: "text-emerald-400 border-emerald-500/30",
  amber: "text-amber-400 border-amber-500/30",
  rose: "text-rose-400 border-rose-500/30",
  purple: "text-purple-400 border-purple-500/30",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "blue",
}: StatCardProps) {
  return (
    <div className={`glass-card p-6 border-t-4 ${colorMap[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
          
          {trendValue && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-slate-900/50 ${
                trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400"
              }`}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </span>
              {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-slate-900/50 ${colorMap[color].split(' ')[0]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
