"use client";

import { useMemo, useState } from "react";
import { useWallets } from "./WalletVault";
import { useTransactions } from "./FlowMaster";

export function useDashBrain() {
  const { wallets, isLoading: isLoadingWallets, mutate: mutateWallets } = useWallets();
  const { transactions, isLoading: isLoadingTransactions, mutate: mutateTransactions } = useTransactions();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totals = useMemo(() => {
    const balance = wallets.reduce((acc, w) => acc + parseFloat(w.balance), 0);
    
    const income = transactions
      .filter(t => t.classification === 'income')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const expense = transactions
      .filter(t => t.classification === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
    
    return { 
      totalBalance: balance, 
      totalIncome: income, 
      totalExpense: expense 
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
      totals,
    },
    actions: {
      setIsDrawerOpen,
      handleTransactionSuccess,
    }
  };
}
