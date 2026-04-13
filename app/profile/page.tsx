"use client";

import React from "react";
import { useProfile, useAuthVault } from "@core/hooks/AuthVault";
import Link from "next/link";
import { User, Mail, LogOut, Shield, Bell, HelpCircle, ChevronRight, Tag } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useProfile();
  const { actions } = useAuthVault();
  const logout = actions.clearSession;

  if (isLoading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  const menuItems = [
    { icon: Tag, label: "Categories Management", color: "text-[#35C2C1] bg-[#35C2C1]/10", href: "/categories" },
    { icon: Shield, label: "Account Security", color: "text-blue-500 bg-blue-50" },
    { icon: Bell, label: "Notifications", color: "text-orange-500 bg-orange-50" },
    { icon: HelpCircle, label: "Help & Support", color: "text-emerald-500 bg-emerald-50" },
  ];

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">


      {/* Info Cards - Profile Fields */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card p-6 rounded-[2rem] border border-border flex items-center gap-4 shadow-sm hover:border-[#35C2C1]/40 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-[#35C2C1]/10 flex items-center justify-center text-[#35C2C1]">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-meta-2xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</p>
            <p className="text-body font-bold">{user?.name || "Not set"}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-[#35C2C1] transition-colors" />
        </div>

        <div className="bg-card p-6 rounded-[2rem] border border-border flex items-center gap-4 shadow-sm hover:border-[#35C2C1]/40 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-[#35C2C1]/10 flex items-center justify-center text-[#35C2C1]">
            <Mail className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-meta-2xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</p>
            <p className="text-body font-bold">{user?.email || "Not set"}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-[#35C2C1] transition-colors" />
        </div>
      </div>

      {/* Settings Menu */}
      <div className="flex flex-col gap-3">
        <p className="text-meta-xs font-semibold text-muted-foreground uppercase ml-4">Settings</p>
        <div className="bg-card rounded-[2rem] border border-border divide-y divide-border overflow-hidden shadow-sm">
          {menuItems.map((item, idx) => {
            const content = (
              <div className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-all group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="flex-1 text-left text-body-sm font-bold text-foreground">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            );

            if (item.href) {
              return (
                <Link key={idx} href={item.href} className="block">
                  {content}
                </Link>
              );
            }

            return (
              <button key={idx} className="w-full">
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full h-16 rounded-[2rem] bg-rose-50 border border-rose-100 text-rose-500 font-extrabold flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
      >
        <LogOut className="w-6 h-6" />
        Log Out
      </button>
    </div>
  );
}
