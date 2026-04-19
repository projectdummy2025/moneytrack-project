"use client";

import React from "react";
import { SpendingDetail } from "@shell/history/SpendingDetail";
import { useAnalyticsCore } from "@core/hooks/AnalyticsCore";
import { X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SpendingStatsPage() {
  const brain = useAnalyticsCore();

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header with Back Button and Title */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-between"
      >
        <Link 
          href="/history"
          className="size-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary/10 transition-all shadow-sm active:scale-95 z-10"
        >
          <X className="size-5" />
        </Link>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <h1 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">Spending Analysis</h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Statistical Overview</p>
        </div>
        <div className="size-10" />
      </motion.div>

      <SpendingDetail
        state={brain.state}
        actions={brain.actions}
      />
    </div>
  );
}
