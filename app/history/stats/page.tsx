"use client";

import React from "react";
import { SpendingDetail } from "@shell/history/SpendingDetail";
import { useAnalyticsCore } from "@core/hooks/AnalyticsCore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SpendingStatsPage() {
  const brain = useAnalyticsCore();

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 px-1"
      >
        <Link 
          href="/"
          className="w-12 h-12 rounded-2xl bg-white border border-border/50 flex items-center justify-center text-foreground hover:bg-secondary/10 transition-all shadow-sm active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground leading-none mb-1">Spending Analysis</h1>
          <p className="text-sm text-muted-foreground font-bold tracking-tight">Detailed category breakdown</p>
        </div>
      </motion.div>

      <SpendingDetail
        state={brain.state}
        actions={brain.actions}
      />
    </div>
  );
}
