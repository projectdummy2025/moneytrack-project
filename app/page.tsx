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
    <div className="flex flex-col gap-8 pb-20">
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

      {/* Floating UI Elements */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => brain.actions.setIsDrawerOpen(true)}
         className="sm:hidden fixed bottom-24 right-6 z-40 bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/40 flex items-center justify-center"
      >
        <Plus className="w-6 h-6 stroke-[3px]" />
      </motion.button>

      <div className="hidden sm:block fixed bottom-8 right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => brain.actions.setIsDrawerOpen(true)}
          className="bg-primary text-white px-6 py-4 rounded-[2rem] shadow-xl shadow-primary/30 flex items-center gap-3 font-bold"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          New Transaction
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
