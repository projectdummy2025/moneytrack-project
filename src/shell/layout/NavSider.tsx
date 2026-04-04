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
  PieChart,
  LogOut
} from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { motion } from "framer-motion";
import { useAuthVault } from "@core/hooks/AuthVault";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Manage", href: "/manage" },
];

export function NavSider() {
  const pathname = usePathname();
  const { actions } = useAuthVault();

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[min(90%,500px)] glass rounded-[2.5rem] border border-border shadow-2xl px-4 py-3 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center py-2 px-4 rounded-3xl transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground/50 hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "stroke-[3px]" : "stroke-2")} />
            
            {isActive && (
              <motion.div 
                layoutId="navIndicator"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
      
      <button 
        onClick={actions.clearSession}
        className="flex items-center justify-center p-2 text-muted-foreground/30 hover:text-destructive transition-colors ml-2"
      >
        <LogOut className="w-5 h-5 stroke-2" />
      </button>
    </nav>
  );
}
