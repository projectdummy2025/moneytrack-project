"use client";

import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Overview } from "@/components/dashboard/Overview";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { useWallets } from "@/hooks/use-wallets";
import { useTransactions } from "@/hooks/use-transactions";
import { AddTransactionDrawer } from "@/components/crud/AddTransactionDrawer";

export default function Dashboard() {
  const { wallets, isLoading: isLoadingWallets, mutate: mutateWallets } = useWallets();
  const { transactions, isLoading: isLoadingTransactions, mutate: mutateTransactions } = useTransactions();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
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

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* 1. Overview Section */}
      <Overview 
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        wallets={wallets}
        isLoading={isLoadingWallets}
      />

      {/* 2. Recent Activities Section */}
      <RecentActivities 
        transactions={transactions.slice(0, 5)}
        isLoading={isLoadingTransactions}
      />

      {/* Floating Add Button for Mobile */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setIsDrawerOpen(true)}
         className="sm:hidden fixed bottom-24 right-6 z-40 bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/40 flex items-center justify-center"
      >
        <Plus className="w-6 h-6 stroke-[3px]" />
      </motion.button>

      {/* Desktop Add Button */}
      <div className="hidden sm:block fixed bottom-8 right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDrawerOpen(true)}
          className="bg-primary text-white px-6 py-4 rounded-[2rem] shadow-xl shadow-primary/30 flex items-center gap-3 font-bold"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          New Transaction
        </motion.button>
      </div>

      <AddTransactionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
