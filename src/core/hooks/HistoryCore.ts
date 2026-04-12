"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "./FlowMaster";
import { useWallets } from "./WalletVault";
import { useCategories } from "./TagMap";
import { Transaction } from "@core/types/DataCore";

export function useHistoryCore() {
  const { transactions, isLoading, mutate: mutateTransactions } = useTransactions();
  const { wallets } = useWallets();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWallet, setFilterWallet] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string; amount: string; memo: string; walletId: string; categoryId: string; transactedAt: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; memo: string } | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch =
        !searchQuery ||
        t.memo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWallet = !filterWallet || t.walletName === filterWallet;
      const matchesCategory = !filterCategory || t.categoryName === filterCategory;

      let matchesDate = true;
      const transDate = new Date(t.transactedAt);
      if (filterDateFrom) {
        const from = new Date(filterDateFrom);
        if (transDate < from) matchesDate = false;
      }
      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (transDate > to) matchesDate = false;
      }

      return matchesSearch && matchesWallet && matchesCategory && matchesDate;
    });
  }, [transactions, searchQuery, filterWallet, filterCategory, filterDateFrom, filterDateTo]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.transactedAt).toLocaleDateString("id-ID", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return Object.entries(groups);
  }, [filteredTransactions]);

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.classification === 'income')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const expense = filteredTransactions
      .filter(t => t.classification === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    return {
      monthNet: income - expense,
      transCount: filteredTransactions.length,
      totalIncome: income,
      totalExpense: expense,
    };
  }, [filteredTransactions]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetch(`/api/transactions/${deleteConfirm.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      setDeleteConfirm(null);
      mutateTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleUpdate = async (data: { amount: string; memo: string; walletId?: string; categoryId?: string; transactedAt?: string }) => {
    if (!editingTransaction) return;
    try {
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
      mutateTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterWallet("");
    setFilterCategory("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const hasActiveFilters = !!(filterWallet || filterCategory || filterDateFrom || filterDateTo);

  return {
    state: {
      groupedTransactions,
      searchQuery,
      totals,
      isLoading,
      wallets,
      categories,
      filterWallet,
      filterCategory,
      filterDateFrom,
      filterDateTo,
      showFilters,
      hasActiveFilters,
      editingTransaction,
      deleteConfirm,
    },
    actions: {
      setSearchQuery,
      setFilterWallet,
      setFilterCategory,
      setFilterDateFrom,
      setFilterDateTo,
      setShowFilters,
      clearFilters,
      setEditingTransaction,
      handleUpdate,
      setDeleteConfirm,
      handleDelete,
    }
  };
}
