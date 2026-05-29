"use client";

import React from "react";
import { PulseBoard } from "@shell/dashboard/PulseBoard";
import { ActivityStream } from "@shell/dashboard/ActivityStream";
import { useDashBrain } from "@core/hooks/DashBrain";

// Dashboard: shows balance overview, wallet list, and 5 recent transactions.
// Charts and full history have moved to the Reports page.
export default function DashboardPage() {
  const dashData = useDashBrain();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">
      {/* Section 1: Total balance card + wallet cards */}
      <PulseBoard
        totalBalance={dashData.state.totals.totalBalance}
        totalIncome={dashData.state.totals.totalIncome}
        totalExpense={dashData.state.totals.totalExpense}
        wallets={dashData.state.wallets}
        isLoading={dashData.state.isLoading}
      />

      {/* Section 2: Latest 5 transactions */}
      <ActivityStream
        transactions={dashData.state.transactions}
        isLoading={dashData.state.isLoading}
      />
    </div>
  );
}
