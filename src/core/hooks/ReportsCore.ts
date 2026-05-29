"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "./FlowMaster";
import { useWallets } from "./WalletVault";
import { useCategories } from "./TagMap";
import { Transaction } from "@core/types/DataCore";

export function useReportsCore() {
  // Fetch raw data — single source, shared by chart + transaction list
  const { transactions, isLoading, mutate: refreshTransactions } = useTransactions();
  const { wallets } = useWallets();
  const { categories } = useCategories();

  // --- Month navigation state ---
  // Start from the first day of current month
  const currentTime = new Date();
  const [selectedDate, setSelectedDate] = useState(
    new Date(currentTime.getFullYear(), currentTime.getMonth(), 1)
  );

  // --- Transaction list UI state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWallet, setFilterWallet] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // --- Edit and delete dialog state ---
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    amount: string;
    memo: string;
    walletId: string;
    categoryId: string;
    transactedAt: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    memo: string;
  } | null>(null);

  // --- Chart analytics: computed from selected month only ---
  const chartStats = useMemo(() => {
    const targetMonth = selectedDate.getMonth();
    const targetYear = selectedDate.getFullYear();

    // Color palette for pie chart slices
    const colorPalette = [
      "#35c2c1", "#6366f1", "#ec4899", "#f59e0b",
      "#10b981", "#8b5cf6", "#ef4444", "#3b82f6",
    ];

    // Step 1: Keep only transactions from the selected month
    const monthTransactions = transactions.filter((transaction) => {
      const parsedDate = new Date(transaction.transactedAt);
      return (
        parsedDate.getMonth() === targetMonth &&
        parsedDate.getFullYear() === targetYear
      );
    });

    // Step 2: Tally income and expense, build category spending map
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<
      string,
      { name: string; value: number; color: string; count: number }
    > = {};

    monthTransactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.classification === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        // Group expense transactions by category for the pie chart
        const categoryKey = transaction.categoryName || "Other";
        if (!categoryMap[categoryKey]) {
          categoryMap[categoryKey] = {
            name: categoryKey,
            value: 0,
            count: 0,
            color: colorPalette[Object.keys(categoryMap).length % colorPalette.length],
          };
        }
        categoryMap[categoryKey].value += amount;
        categoryMap[categoryKey].count += 1;
      }
    });

    // Step 3: Sort categories by highest spending, attach percentage
    const categoryData = Object.values(categoryMap)
      .sort((first, second) => second.value - first.value)
      .map((category) => ({
        ...category,
        percentage: totalExpense > 0 ? (category.value / totalExpense) * 100 : 0,
      }));

    return { totalIncome, totalExpense, netSavings: totalIncome - totalExpense, categoryData };
  }, [transactions, selectedDate]);

  // --- Transaction list: month + search + wallet + category filters combined ---
  const filteredTransactions = useMemo(() => {
    const targetMonth = selectedDate.getMonth();
    const targetYear = selectedDate.getFullYear();

    return transactions.filter((transaction) => {
      // Step 1: Only show transactions from the currently selected month
      const parsedDate = new Date(transaction.transactedAt);
      const isInSelectedMonth =
        parsedDate.getMonth() === targetMonth &&
        parsedDate.getFullYear() === targetYear;
      if (!isInSelectedMonth) return false;

      // Step 2: Match text search against memo or category name
      const matchesSearch =
        !searchQuery ||
        transaction.memo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Step 3: Match wallet filter (empty = all wallets pass)
      const matchesWallet = !filterWallet || transaction.walletName === filterWallet;

      // Step 4: Match category filter (empty = all categories pass)
      const matchesCategory = !filterCategory || transaction.categoryName === filterCategory;

      return matchesSearch && matchesWallet && matchesCategory;
    });
  }, [transactions, selectedDate, searchQuery, filterWallet, filterCategory]);

  // --- Group filtered transactions by formatted date label ---
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((transaction) => {
      const dateLabel = new Date(transaction.transactedAt).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(transaction);
    });
    return Object.entries(groups);
  }, [filteredTransactions]);

  // --- Totals for the transaction list section ---
  const listTotals = useMemo(() => {
    const income = filteredTransactions
      .filter((transaction) => transaction.classification === "income")
      .reduce((runningTotal, transaction) => runningTotal + parseFloat(transaction.amount), 0);
    const expense = filteredTransactions
      .filter((transaction) => transaction.classification === "expense")
      .reduce((runningTotal, transaction) => runningTotal + parseFloat(transaction.amount), 0);
    return {
      monthNet: income - expense,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // --- Month navigation helpers ---
  const goToPrevMonth = () =>
    setSelectedDate((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setSelectedDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
  const monthDisplayName = selectedDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // --- Delete a transaction and restore the wallet balance ---
  const handleDeleteTransaction = async () => {
    if (!deleteConfirm) return;
    const response = await fetch(`/api/transactions/${deleteConfirm.id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete transaction");
    setDeleteConfirm(null);
    refreshTransactions();
  };

  // --- Update transaction amount and memo ---
  const handleUpdateTransaction = async (data: {
    amount: string;
    memo: string;
    walletId?: string;
    categoryId?: string;
    transactedAt?: string;
  }) => {
    if (!editingTransaction) return;
    const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: data.amount || editingTransaction.amount,
        memo: data.memo,
        walletId: data.walletId || editingTransaction.walletId,
        categoryId: data.categoryId || editingTransaction.categoryId,
        transactedAt: data.transactedAt || editingTransaction.transactedAt,
      }),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    setEditingTransaction(null);
    refreshTransactions();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterWallet("");
    setFilterCategory("");
  };

  // True when at least one dropdown filter is active — used to show badge indicator
  const hasActiveFilters = !!(filterWallet || filterCategory);

  return {
    state: {
      isLoading,
      selectedDate,
      monthDisplayName,
      chartStats,
      groupedTransactions,
      listTotals,
      searchQuery,
      filterWallet,
      filterCategory,
      showFilters,
      hasActiveFilters,
      wallets,
      categories,
      editingTransaction,
      deleteConfirm,
    },
    actions: {
      goToPrevMonth,
      goToNextMonth,
      setSearchQuery,
      setFilterWallet,
      setFilterCategory,
      setShowFilters,
      clearFilters,
      setEditingTransaction,
      handleUpdateTransaction,
      setDeleteConfirm,
      handleDeleteTransaction,
    },
  };
}
