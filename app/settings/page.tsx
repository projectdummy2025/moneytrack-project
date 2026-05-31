"use client";

import React from "react";
import Link from "next/link";
import {
  Tag,
  Shield,
  Bell,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useProfile, useAuthVault } from "@core/hooks/AuthVault";

// Helper: extract up to 2 initials from a full name (e.g. "Ahmad Dedad" → "AD")
function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default function SettingsPage() {
  const { user, isLoading } = useProfile();
  const { actions } = useAuthVault();

  // ─── Menu group definitions ──────────────────────────────────────────────
  // Each group has a label and a list of menu items.
  // Items with href are rendered as links; items without href are buttons.

  const financeMenuItems = [
    {
      icon: Tag,
      label: "Categories",
      description: "Manage spending categories",
      colorClass: "text-[#35C2C1] bg-[#35C2C1]/10",
      href: "/categories",
    },
  ];

  const accountMenuItems = [
    {
      icon: Shield,
      label: "Account Security",
      description: "Password and security settings",
      colorClass: "text-blue-500 bg-blue-50",
      href: null,
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage alert preferences",
      colorClass: "text-orange-500 bg-orange-50",
      href: null,
    },
  ];

  const otherMenuItems = [
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs and contact",
      colorClass: "text-emerald-500 bg-emerald-50",
      href: null,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-['Urbanist',sans-serif]">

      {/* ── Profile Card ──────────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border/40 p-5 flex items-center gap-4 select-none">
        {/* Avatar circle showing user initials */}
        <div className="w-14 h-14 rounded-2xl bg-[#35C2C1] flex items-center justify-center text-white font-black text-lg shrink-0">
          {isLoading ? (
            <div className="w-full h-full bg-[#35C2C1]/80 animate-pulse rounded-2xl" />
          ) : (
            user?.name ? getInitials(user.name) : "MT"
          )}
        </div>
 
        {/* Name and email */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <>
              <div className="h-4 w-28 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-36 bg-muted animate-pulse rounded" />
            </>
          ) : (
            <>
              <p className="text-body font-black text-foreground truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider truncate mt-0.5">
                {user?.email || ""}
              </p>
            </>
          )}
        </div>
 
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
      </div>
 
      {/* ── KEUANGAN Group ─────────────────────────────────────────────────── */}
      <MenuGroup label="Keuangan" items={financeMenuItems} />
 
      {/* ── AKUN Group ─────────────────────────────────────────────────────── */}
      <MenuGroup label="Akun" items={accountMenuItems} />
 
      {/* ── LAINNYA Group ──────────────────────────────────────────────────── */}
      <MenuGroup label="Lainnya" items={otherMenuItems} />
 
      {/* ── Logout Button ──────────────────────────────────────────────────── */}
      <button
        onClick={actions.clearSession}
        className="w-full h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-meta font-black uppercase tracking-[0.16em] flex items-center justify-center active:scale-[0.97] transition-all cursor-pointer"
      >
        Log Out
      </button>

      {/* Bottom padding so last item clears the nav bar */}
      <div className="h-4" />
    </div>
  );
}

// ─── MenuGroup: renders a labeled section with a list of menu items ────────────

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description: string;
  colorClass: string;
  href: string | null;
}

function MenuGroup({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Section label */}
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground/50 px-4">
        {label}
      </p>
 
      {/* Card wrapping the list of items, divided by thin lines */}
      <div className="bg-card rounded-2xl border border-border/40 divide-y divide-border/30 overflow-hidden shadow-sm">
        {items.map((item, index) => {
          const rowContent = (
            <div className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-all cursor-pointer active:bg-secondary/50">
              {/* Label and description */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-body font-black text-foreground">{item.label}</p>
                <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider mt-0.5">
                  {item.description}
                </p>
              </div>
 
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            </div>
          );
 
          // Render as a link if href is provided, otherwise as a plain button
          if (item.href) {
            return (
              <Link key={index} href={item.href} className="block">
                {rowContent}
              </Link>
            );
          }
          return (
            <button key={index} className="w-full" type="button">
              {rowContent}
            </button>
          );
        })}
      </div>
    </div>
  );
}
