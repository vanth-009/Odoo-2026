"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";

const tabs = [
  { label: "Overview", href: "/social" },
  { label: "CSR Activities", href: "/social/csr-activities" },
  { label: "Participation", href: "/social/participation" },
  { label: "Diversity", href: "/social/diversity" },
  { label: "Engagement & Training", href: "/social/engagement" },
];

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/social") return pathname === "/social";
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Users size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Social Module</h1>
          <p className="text-sm text-slate-400">
            Track CSR activities, participation, diversity &amp; engagement
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none border-b border-white/[0.06]">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  relative whitespace-nowrap px-4 py-2.5 text-sm font-medium
                  transition-all duration-300 rounded-t-lg
                  ${
                    active
                      ? "text-emerald-400 bg-white/[0.02]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.01]"
                  }
                `}
              >
                {tab.label}

                {/* Active indicator */}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div>{children}</div>
    </div>
  );
}
