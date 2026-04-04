"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut
} from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { motion } from "framer-motion";
import { useAuthVault } from "@core/hooks/AuthVault";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Manage", href: "/manage" },
];

export function NavSider() {
  const pathname = usePathname();
  const { actions } = useAuthVault();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 px-6 py-2 flex items-center justify-between z-50 safe-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300",
              isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-6 h-6 mb-1", isActive ? "stroke-[2.5px]" : "stroke-2")} />
            <span className={cn("text-[10px] font-bold", isActive ? "opacity-100" : "opacity-70")}>{item.label}</span>
            
            {isActive && (
              <motion.div 
                layoutId="navIndicator"
                className="absolute bottom-0 w-10 h-1 bg-accent rounded-t-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
      
      <button 
        onClick={actions.clearSession}
        className="flex flex-col items-center justify-center py-2 px-4 text-muted-foreground hover:text-destructive transition-colors"
      >
        <LogOut className="w-6 h-6 mb-1 stroke-2" />
        <span className="text-[10px] font-bold opacity-70">Logout</span>
      </button>
    </nav>
  );
}
