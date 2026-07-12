"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DiversityData = {
  overallIndex: number;
  totalEmployees: number;
  gender: { name: string; value: number }[];
  age: { range: string; count: number }[];
  ethnicity: { group: string; count: number }[];
  department: { name: string; diversityScore: number }[];
};

const COLORS_PIE = ["#10b981", "#14b8a6", "#8b5cf6", "#3b82f6", "#f59e0b"];
const COLOR_BAR = "#14b8a6";

export default function DiversityMetricsPage() {
  const [data, setData] = useState<DiversityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/social/diversity");
        if (!response.ok) {
          throw new Error("Failed to fetch diversity metrics data.");
        }
        const json = await response.json();
        const apiData = json.data;
        setData({
          overallIndex: Math.round(apiData.diversityIndex * 100),
          totalEmployees: apiData.totalEmployees,
          gender: apiData.genderDistribution.map((g: any) => ({ name: g.gender, value: g.count })),
          age: apiData.ageDistribution,
          ethnicity: apiData.ethnicityDistribution.map((e: any) => ({ group: e.ethnicity, count: e.count })),
          department: apiData.departmentDistribution.map((d: any) => ({ name: d.department, diversityScore: d.count })),
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <div className="text-red-400">Error: {error || "No data available."}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      <div>
        <h3 className="text-xl font-bold text-white">Diversity Metrics</h3>
        <p className="text-slate-400 text-sm mt-1">Monitor employee gender, age, ethnicity, and department distributions.</p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="border border-white/10 bg-white/5 rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Overall Diversity Index
          </h4>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {data.overallIndex}/100
          </div>
          <p className="text-xs text-slate-500 mt-1">Shannon Index representation</p>
        </div>

        <div className="border border-white/10 bg-white/5 rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Headcount
          </h4>
          <div className="text-3xl font-extrabold text-teal-400 mt-2">
            {data.totalEmployees}
          </div>
          <p className="text-xs text-slate-500 mt-1">Active full-time workforce</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gender Distribution */}
        <div className="border border-white/10 bg-white/5 flex min-h-[350px] flex-col rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h4 className="mb-4 text-base font-semibold text-slate-200">
            Gender Distribution
          </h4>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.gender.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_PIE[index % COLORS_PIE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap mt-2">
            {data.gender.map((g, index) => (
              <div key={g.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS_PIE[index % COLORS_PIE.length] }} />
                <span>{g.name}: {g.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="border border-white/10 bg-white/5 flex min-h-[350px] flex-col rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h4 className="mb-4 text-base font-semibold text-slate-200">
            Age Distribution
          </h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.age} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="count" fill={COLOR_BAR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ethnicity Distribution */}
        <div className="border border-white/10 bg-white/5 flex min-h-[350px] flex-col rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h4 className="mb-4 text-base font-semibold text-slate-200">
            Ethnicity Distribution
          </h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.ethnicity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="border border-white/10 bg-white/5 flex min-h-[350px] flex-col rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h4 className="mb-4 text-base font-semibold text-slate-200">
            Department Headcount Distribution
          </h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.department} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={110} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="diversityScore" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
