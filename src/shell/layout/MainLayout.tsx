"use client";

import React from "react";
import { NavSider } from "./NavSider";
import { usePathname } from "next/navigation";
import { useProfile, useAuthVault } from "@core/hooks/AuthVault";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, isLoading: isProfileLoading } = useProfile();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  const [greeting, setGreeting] = React.useState("Welcome");

  React.useEffect(() => {
    // Dynamic greeting based on time, only runs on client
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 17) return "Good Afternoon";
      return "Good Evening";
    };
    setGreeting(getGreeting());
  }, []);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f9] flex flex-col transition-colors duration-500 overflow-x-hidden font-['Urbanist',sans-serif]">
      {/* Header - Reference NavBar Style */}
      <header className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border/50 max-w-[430px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center overflow-hidden border border-white/20 shadow-sm">
            {isProfileLoading ? (
              <div className="w-full h-full bg-muted animate-pulse" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name ? getInitials(user.name) : "MT"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider leading-none mb-1">
              {greeting}
            </span>
            <h1 className="text-[15px] font-extrabold tracking-tight text-[#1e232c] leading-none min-w-[80px]">
              {isProfileLoading ? (
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              ) : (
                user?.name || user?.email || "User"
              )}
            </h1>
          </div>
        </div>
        
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-border/50 shadow-sm transition-transform active:scale-95">
          <svg width="20" height="20" viewBox="0 0 17.5 20" fill="none">
            <path
              d="M8.75 0C8.06 0 7.5 0.56 7.5 1.25V2.06C4.71 2.57 2.5 5.03 2.5 8V13.75L0 16.25V17.5H17.5V16.25L15 13.75V8C15 5.03 12.79 2.57 10 2.06V1.25C10 0.56 9.44 0 8.75 0ZM8.75 20C9.86 20 10.75 19.1 10.75 18H6.75C6.75 19.1 7.64 20 8.75 20Z"
              fill="#1e232c"
            />
            <circle cx="12.5" cy="6.5" r="3.25" fill="#d41d3d" stroke="white" strokeWidth="1.5" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[430px] mx-auto px-5 pt-28 pb-32">
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
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50">
        <NavSider />
      </div>
      
      {/* Ambient Background Element */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 -z-10 h-[300px] w-full max-w-[430px] bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
    </div>
  );
}
