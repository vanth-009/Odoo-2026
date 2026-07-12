import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="glass border-b border-white/10 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search modules, reports, or employees..." 
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-200">Jane Doe</p>
            <p className="text-xs text-slate-400">ESG Director</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
