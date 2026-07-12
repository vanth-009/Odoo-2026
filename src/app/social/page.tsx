"use client";

import { Users, Heart, Share2, Calendar } from "lucide-react";

export default function Social() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" /> Social & CSR
          </h2>
          <p className="text-slate-400 mt-1">Manage CSR activities and track employee participation.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-colors">
          Host Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Beach Cleanup Drive", date: "Aug 15, 2026", participants: 45, status: "Upcoming", image: "bg-blue-900/30" },
          { title: "Local Food Bank Volunteering", date: "Aug 20, 2026", participants: 12, status: "Open", image: "bg-emerald-900/30" },
          { title: "Mentorship Program Q3", date: "Sep 01, 2026", participants: 120, status: "Open", image: "bg-purple-900/30" },
        ].map((event, i) => (
          <div key={i} className="glass-card overflow-hidden flex flex-col">
            <div className={`h-32 w-full ${event.image} border-b border-white/5 relative flex items-center justify-center`}>
              <Heart className="w-12 h-12 text-white/20" />
              <div className="absolute top-3 right-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-xs font-medium text-blue-400 border border-blue-500/20">
                {event.status}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-100">{event.title}</h3>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.participants} Joined</span>
              </div>
              <div className="mt-auto pt-5 flex gap-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                  Details
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                  Join
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                  <Share2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
