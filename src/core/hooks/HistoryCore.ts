"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "./FlowMaster";
import { Transaction } from "@core/types/DataCore";

export function useHistoryCore() {
  const { transactions, isLoading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      (t.memo?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       t.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [transactions, searchQuery]);

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
      transCount: filteredTransactions.length 
    };
  }, [filteredTransactions]);

  return {
    state: {
      groupedTransactions,
      searchQuery,
      totals,
      isLoading
    },
    actions: {
      setSearchQuery
    }
  };
}
