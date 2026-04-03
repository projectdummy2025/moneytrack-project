"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  Settings2, 
  Plus 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AddTransactionDrawer } from "@/components/crud/AddTransactionDrawer";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: "/", label: "Home", Icon: LayoutDashboard },
  { href: "/history", label: "History", Icon: History },
  { href: "/manage", label: "Manage", Icon: Settings2 },
];

export function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <AddTransactionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border sm:hidden pb-safe">
        <div className="flex items-center justify-around h-16 px-4">
          {navItems.map(({ href, label, Icon }, index) => {
            const isActive = pathname === href;
            
            // Insert Add Button in the middle for mobile
            if (index === 1) {
              return (
                <React.Fragment key="mobile-nav-group">
                  <Link
                    href={href}
                    key={href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 transition-all duration-300 w-12 h-12",
                      isActive 
                        ? "text-primary scale-110" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </Link>
                  
                  <button 
                    key="add-button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center justify-center -translate-y-4 bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/30 active:scale-90 transition-all duration-200"
                    aria-label="Add Transaction"
                  >
                    <Plus className="w-8 h-8 stroke-[3px]" />
                  </button>
                </React.Fragment>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all duration-300 w-12 h-12",
                  isActive 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden sm:flex fixed top-0 left-0 bottom-0 w-20 lg:w-64 glass border-r border-border p-4 flex-col gap-8 transition-all duration-300">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="min-w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block overflow-hidden whitespace-nowrap">MoneyTrack</span>
        </div>

        <div className="flex flex-col gap-2">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                title={label}
              >
                <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive && "stroke-[2.5px]")} />
                <span className="font-semibold hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center lg:justify-start gap-3 w-full p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold group"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
            <span className="hidden lg:block whitespace-nowrap">New Record</span>
          </button>
        </div>
      </nav>
    </>
  );
}
