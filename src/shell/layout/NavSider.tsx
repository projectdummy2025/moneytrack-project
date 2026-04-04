"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Plus, 
  Wallet,
  TrendingUp,
  PieChart
} from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Manage", href: "/manage" },
];

export function NavSider() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-card border-r border-border/50 z-50 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter text-foreground">MONEYTRACK</span>
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                <span className={cn("hidden lg:block font-bold tracking-tight", isActive ? "opacity-100" : "opacity-80")}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full lg:hidden"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50">
           <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">JD</div>
              <div className="hidden lg:block">
                <p className="text-sm font-bold text-foreground leading-none mb-1">John Doe</p>
                <p className="text-[10px] text-muted-foreground font-medium">Premium Plan</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 py-4 flex items-center justify-between z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
