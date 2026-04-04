"use client";

import React from "react";
import { NavSider } from "./NavSider";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/history": "Transaction History",
  "/manage": "Manage Accounts",
};

export function MainLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "MoneyTrack";

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-500 overflow-x-hidden">
      {/* Header - Fixed & Immersive */}
      <header className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-auto">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-primary tracking-[0.2em] uppercase opacity-80">MoneyTrack</span>
          <h1 className="text-xl font-black tracking-tight text-foreground">{title}</h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-primary font-black text-sm">
            JD
          </div>
        </div>
      </header>

      {/* Main Content Area - Responsive Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-6 pt-24 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Nav - Viewport Fixed */}
      <NavSider />
      
      {/* Ambient background glow */}
      <div className="fixed top-0 right-0 -z-10 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
