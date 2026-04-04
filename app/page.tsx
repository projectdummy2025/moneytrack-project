"use client";

import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { PulseBoard } from "@shell/dashboard/PulseBoard";
import { ActivityStream } from "@shell/dashboard/ActivityStream";
import { QuickRecord } from "@shell/crud/QuickRecord";
import { useDashBrain } from "@core/hooks/DashBrain";
import { useRecordCore } from "@core/hooks/RecordCore";

export default function DashboardPage() {
  const brain = useDashBrain();
  const recordCore = useRecordCore({
    isOpen: brain.state.isDrawerOpen,
    onClose: () => brain.actions.setIsDrawerOpen(false),
    onSuccess: brain.actions.handleTransactionSuccess,
  });

  return (
    <div className="flex flex-col gap-2 font-['Urbanist',sans-serif]">
      <PulseBoard 
        totalBalance={brain.state.totals.totalBalance}
        totalIncome={brain.state.totals.totalIncome}
        totalExpense={brain.state.totals.totalExpense}
        wallets={brain.state.wallets}
        isLoading={brain.state.isLoading}
      />

      <ActivityStream 
        transactions={brain.state.transactions}
        isLoading={brain.state.isLoading}
      />

      {/* Floating Action Button - Mobile App Style */}
      <div className="fixed bottom-24 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => brain.actions.setIsDrawerOpen(true)}
          className="w-14 h-14 bg-accent text-white rounded-2xl shadow-lg shadow-accent/20 flex items-center justify-center transition-all active:bg-accent/90 border border-white/20"
        >
          <Plus className="w-7 h-7 stroke-[3px]" />
        </motion.button>
      </div>

      <QuickRecord 
        isOpen={brain.state.isDrawerOpen} 
        onClose={() => brain.actions.setIsDrawerOpen(false)} 
        state={recordCore.state}
        actions={recordCore.actions}
      />
    </div>
  );
}
