"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "./FlowMaster";

export function useAnalyticsCore() {
  const { transactions, isLoading } = useTransactions();
  
  // Default to current month and year
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const stats = useMemo(() => {
    const targetMonth = currentDate.getMonth();
    const targetYear = currentDate.getFullYear();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, { name: string; value: number; color: string; count: number }> = {};
    
    // Modern harmonious color palette
    const colors = [
      "#35c2c1", // Teal/Accent
      "#6366f1", // Indigo
      "#ec4899", // Pink
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#8b5cf6", // Violet
      "#ef4444", // Red
      "#3b82f6", // Blue
    ];

    // Filter transactions for the selected month
    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.transactedAt);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });

    monthlyTransactions.forEach(t => {
      const amount = parseFloat(t.amount);
      if (t.classification === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;

        const catId = t.categoryName || "Other";
        if (!categoryMap[catId]) {
          categoryMap[catId] = {
            name: catId,
            value: 0,
            count: 0,
            color: colors[Object.keys(categoryMap).length % colors.length]
          };
        }
        categoryMap[catId].value += amount;
        categoryMap[catId].count += 1;
      }
    });

    const categoryData = Object.values(categoryMap)
      .sort((a, b) => b.value - a.value)
      .map(cat => ({
        ...cat,
        percentage: totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0
      }));

    return {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      categoryData,
      transactionCount: monthlyTransactions.length,
      monthlyTransactions
    };
  }, [transactions, currentDate]);

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const monthName = currentDate.toLocaleDateString("id-ID", { month: 'long', year: 'numeric' });

  return {
    state: {
      isLoading,
      currentDate,
      monthName,
      ...stats
    },
    actions: {
      nextMonth,
      prevMonth,
      setCurrentDate
    }
  };
}
