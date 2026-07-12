"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Gamepad2, 
  FileText, 
  Settings 
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Environmental", href: "/environmental", icon: Leaf },
  { name: "Social", href: "/social", icon: Users },
  { name: "Governance", href: "/governance", icon: ShieldCheck },
  { name: "Gamification", href: "/gamification", icon: Gamepad2 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass border-r min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-emerald-400">Eco</span>
          <span className="text-slate-100">Sphere</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-slate-500 text-center">
        Odoo Hackathon 2026
      </div>
    </aside>
  );
}
