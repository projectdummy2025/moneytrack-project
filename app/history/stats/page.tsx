"use client";

import React from "react";
import { SpendingDetail } from "@shell/history/SpendingDetail";
import { useAnalyticsCore } from "@core/hooks/AnalyticsCore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SpendingStatsPage() {
  const brain = useAnalyticsCore();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 px-1">
        <Link 
          href="/"
          className="w-10 h-10 rounded-xl bg-white border border-border/50 flex items-center justify-center text-foreground hover:bg-secondary transition-colors shadow-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Spending Analysis</h1>
          <p className="text-sm text-muted-foreground font-bold">Detailed category breakdown</p>
        </div>
      </div>

      <SpendingDetail
        state={brain.state}
        actions={brain.actions}
      />
    </div>
  );
}
