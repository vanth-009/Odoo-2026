"use client";

import { ReactNode } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

export interface Column {
  key: string;
  label: string;
  render?: (val: any, item: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  actions?: ReactNode;
}

export default function DataTable({ columns, data, title, actions }: DataTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      {(title || actions) && (
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-900/30">
          {title && <h3 className="font-semibold text-slate-100">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/50 text-slate-400">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-200">
                    {col.label}
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-slate-300">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-slate-400 hover:text-white rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400 bg-slate-900/30">
        <span>Showing 1 to {data.length} of {data.length} entries</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors" disabled>Prev</button>
          <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
