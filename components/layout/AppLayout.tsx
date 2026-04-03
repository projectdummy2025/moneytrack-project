"use client";

import React from "react";
import { Navbar } from "./Navbar";
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

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "MoneyTrack";

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      {/* Main Content Area */}
      <main className="sm:ml-20 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="sm:hidden glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">JD</span>
          </div>
        </header>

        {/* Content Wrapper with animation */}
        <div className="flex-1 px-4 sm:px-8 py-4 sm:py-8 pb-32 sm:pb-8 max-w-5xl mx-auto w-full scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Background Decorator */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none sm:left-64" />
    </div>
  );
}
