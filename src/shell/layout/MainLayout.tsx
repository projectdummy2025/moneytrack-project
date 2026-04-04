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
  "/history": "History",
  "/manage": "Manage",
};

export function MainLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const title = pageTitles[pathname] || "MoneyTrack";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-500 overflow-x-hidden font-['Urbanist',sans-serif]">
      {/* Header - Mobile App Style */}
      <header className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
            JD
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-24 pb-32">
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

      {/* Navigation */}
      <NavSider />
      
      {/* Ambient Background Element */}
      <div className="fixed bottom-0 left-0 right-0 -z-10 h-[300px] bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
    </div>
  );
}
