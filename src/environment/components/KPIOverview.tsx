import React from 'react';
import { Leaf, Calendar, Award, Target, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { DashboardKPIs } from '../types';

interface KPIOverviewProps {
  kpis: DashboardKPIs;
}

export default function KPIOverview({ kpis }: KPIOverviewProps) {
  const cards = [
    {
      title: 'Total Carbon Emissions',
      value: `${kpis.totalEmissions.toLocaleString()} tCO2e`,
      subtitle: 'Cumulative emissions',
      icon: Leaf,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      trend: kpis.momChange < 0 ? 'down' : 'up',
      trendText: `${Math.abs(kpis.momChange)}% MoM`,
      tooltip: 'Total CO2 equivalent emissions registered across all operations.'
    },
    {
      title: 'Reporting Period (Current Month)',
      value: `${kpis.currentMonthEmissions.toLocaleString()} tCO2e`,
      subtitle: `Previous: ${kpis.prevMonthEmissions.toLocaleString()} tCO2e`,
      icon: Calendar,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      trend: kpis.momChange < 0 ? 'down' : 'up',
      trendText: `${Math.abs(kpis.momChange)}% MoM`,
      tooltip: 'Emissions generated during the current active calendar month.'
    },
    {
      title: 'Environmental Score',
      value: `${kpis.avgScore}/100`,
      subtitle: 'Org-wide average',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      trend: kpis.avgScore >= 80 ? 'up' : 'down',
      trendText: kpis.avgScore >= 80 ? 'Optimal' : 'Needs Action',
      tooltip: 'Weighted performance index calculated across all departments.'
    },
    {
      title: 'Active Sustainability Goals',
      value: `${kpis.activeGoals}`,
      subtitle: `${kpis.goalsAchieved} goals completed`,
      icon: Target,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      trend: 'up',
      trendText: 'Active tracking',
      tooltip: 'Number of active reduction and sustainability targets currently set.'
    },
    {
      title: 'Exceeding Targets',
      value: `${kpis.deptsExceedingTarget} Departments`,
      subtitle: `Saved: ${kpis.netCarbonSaved.toLocaleString()} tCO2e`,
      icon: AlertTriangle,
      color: kpis.deptsExceedingTarget > 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
      trend: kpis.deptsExceedingTarget > 0 ? 'up' : 'down',
      trendText: kpis.deptsExceedingTarget > 0 ? 'Action required' : 'All clear',
      tooltip: 'Departments whose current total emissions exceed their allocated targets.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-300"
            title={card.tooltip}
          >
            <div className="flex justify-between items-start">
              <div className={`p-2.5 rounded-lg border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                {card.trend === 'down' ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {card.trendText}
                  </span>
                ) : (
                  <span className={card.title === 'Exceeding Targets' && kpis.deptsExceedingTarget > 0 ? 'text-rose-400 flex items-center gap-0.5' : 'text-zinc-400 flex items-center gap-0.5'}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    {card.trendText}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-bold text-zinc-100 tracking-tight">{card.value}</span>
              <h4 className="text-zinc-400 text-xs font-medium mt-1">{card.title}</h4>
              <p className="text-zinc-500 text-[10px] mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
