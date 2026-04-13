"use client";

import React from "react";
import { PulseBoard } from "@shell/dashboard/PulseBoard";
import { ActivityStream } from "@shell/dashboard/ActivityStream";
import { MonthlyOverview } from "@shell/dashboard/MonthlyOverview";
import { ExpenseTrends } from "@shell/dashboard/ExpenseTrends";
import { useDashBrain } from "@core/hooks/DashBrain";

export default function DashboardPage() {
  const brain = useDashBrain();
  const [mounted, setMounted] = React.useState(false);

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
    </div>
  );
}
