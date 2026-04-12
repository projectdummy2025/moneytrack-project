"use client";

import { useMemo, useState } from "react";
import { useWallets } from "./WalletVault";
import { useTransactions } from "./FlowMaster";

export function useDashBrain() {
  const { wallets, isLoading: isLoadingWallets, mutate: mutateWallets } = useWallets();
  const { transactions, isLoading: isLoadingTransactions, mutate: mutateTransactions } = useTransactions();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const stats = useMemo(() => {
    let totalBalance = 0;
    wallets.forEach(w => totalBalance += parseFloat(w.balance));

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, { name: string; value: number; color: string }> = {};
    const colors = ["#ef4444", "#3b82f6", "#ffb95a", "#84cc16", "#10b981", "#6366f1"];

    // Grouping weekly data shell
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString(undefined, { weekday: 'short' }),
        fullDate: d.toISOString().split('T')[0],
        amount: 0
      };
    });

    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      if (t.classification === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;

        // Stats for Pie
        const catId = t.categoryName || "other";
        if (!categoryMap[catId]) {
          categoryMap[catId] = {
            name: t.categoryName || "Other",
            value: 0,
            color: colors[Object.keys(categoryMap).length % colors.length]
          };
        }
        categoryMap[catId].value += amount;

        // Stats for Chart
        const dateStr = new Date(t.transactedAt).toISOString().split('T')[0];
        const dayData = last7Days.find(d => d.fullDate === dateStr);
        if (dayData) dayData.amount += amount;
      }
    });

    const categoryData = Object.values(categoryMap).sort((a, b) => b.value - a.value);

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      categoryData,
      weeklyData: last7Days
    };
  }, [wallets, transactions]);

  const handleTransactionSuccess = () => {
    mutateWallets();
    mutateTransactions();
  };

  return {
    state: {
      wallets,
      transactions: transactions.slice(0, 5),
      isLoading: isLoadingWallets || isLoadingTransactions,
      isDrawerOpen,
      isTransferOpen,
      totals: {
        totalBalance: stats.totalBalance,
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense
      },
      categoryData: stats.categoryData,
      weeklyData: stats.weeklyData
    },
    actions: {
      setIsDrawerOpen,
      setIsTransferOpen,
      handleTransactionSuccess,
    }
  };
}
