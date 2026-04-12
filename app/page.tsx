"use client";

import React from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { PulseBoard } from "@shell/dashboard/PulseBoard";
import { ActivityStream } from "@shell/dashboard/ActivityStream";
import { MonthlyOverview } from "@shell/dashboard/MonthlyOverview";
import { ExpenseTrends } from "@shell/dashboard/ExpenseTrends";
import { QuickRecord } from "@shell/crud/QuickRecord";
import { TransferDialog } from "@shell/transfer/TransferDialog";
import { useDashBrain } from "@core/hooks/DashBrain";
import { useRecordCore } from "@core/hooks/RecordCore";
import { useTransferCore } from "@core/hooks/TransferCore";

export default function DashboardPage() {
  const brain = useDashBrain();
  const [mounted, setMounted] = React.useState(false);

  const recordCore = useRecordCore({
    isOpen: brain.state.isDrawerOpen,
    onClose: () => brain.actions.setIsDrawerOpen(false),
    onSuccess: brain.actions.handleTransactionSuccess,
  });

  const transferCore = useTransferCore({
    isOpen: brain.state.isTransferOpen,
    onClose: () => brain.actions.setIsTransferOpen(false),
    onSuccess: brain.actions.handleTransactionSuccess,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">
      <PulseBoard
        totalBalance={brain.state.totals.totalBalance}
        totalIncome={brain.state.totals.totalIncome}
        totalExpense={brain.state.totals.totalExpense}
        wallets={brain.state.wallets}
        isLoading={brain.state.isLoading}
      />

      <MonthlyOverview
        data={brain.state.categoryData}
        isLoading={brain.state.isLoading}
      />

      <ExpenseTrends
        data={brain.state.weeklyData}
        isLoading={brain.state.isLoading}
      />

      <ActivityStream
        transactions={brain.state.transactions}
        isLoading={brain.state.isLoading}
      />

      {/* Floating Action Buttons - Mobile App Style */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-none">
        {/* Transfer Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => brain.actions.setIsTransferOpen(true)}
          className="absolute bottom-0 left-6 w-12 h-12 bg-secondary text-foreground rounded-2xl shadow-lg border border-border/50 flex items-center justify-center transition-all active:bg-secondary/80 pointer-events-auto"
        >
          <ArrowLeftRight className="w-5 h-5 stroke-[2.5px]" />
        </motion.button>

        {/* Record Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => brain.actions.setIsDrawerOpen(true)}
          className="absolute bottom-0 right-6 w-14 h-14 bg-accent text-white rounded-2xl shadow-lg shadow-accent/20 flex items-center justify-center transition-all active:bg-accent/90 border border-white/20 pointer-events-auto"
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

      <TransferDialog
        isOpen={brain.state.isTransferOpen}
        onClose={() => brain.actions.setIsTransferOpen(false)}
        state={transferCore.state}
        actions={transferCore.actions}
      />
    </div>
  );
}
