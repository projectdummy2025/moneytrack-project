"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Wallet as WalletType } from "@core/types/DataCore";
import { formatCurrency, formatCompactNumber } from "@core/utils/HelperTool";

interface OverviewProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  wallets: WalletType[];
  isLoading?: boolean;
}

export function PulseBoard({ 
  totalBalance, 
  totalIncome, 
  totalExpense, 
  wallets, 
  isLoading 
}: OverviewProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-4 w-24 bg-muted rounded-full" />
          <div className="h-12 w-48 bg-muted rounded-2xl" />
          <div className="h-4 w-32 bg-muted rounded-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 bg-muted rounded-full" />
          <div className="flex gap-4 overflow-hidden">
            <div className="min-w-[140px] h-32 bg-muted rounded-3xl" />
            <div className="min-w-[140px] h-32 bg-muted rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Balance Section */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center py-4"
      >
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Available Balance</span>
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-6">
          {formatCurrency(totalBalance)}
        </h2>
        
        <div className="flex items-center gap-4 w-full max-w-[300px]">
          <div className="flex-1 flex flex-col items-center p-3 rounded-2xl bg-emerald-50 border border-emerald-100/50">
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Income</span>
            <span className="text-sm font-bold text-emerald-700">{formatCompactNumber(totalIncome)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center p-3 rounded-2xl bg-rose-50 border border-rose-100/50">
            <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mb-1">Expense</span>
            <span className="text-sm font-bold text-rose-700">{formatCompactNumber(totalExpense)}</span>
          </div>
        </div>
      </motion.div>

      {/* Wallets Horizontal Scroll */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-foreground">My Wallets</h3>
          <button className="text-[11px] font-bold text-accent uppercase tracking-wider">Manage</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
          {wallets.map((wallet) => (
            <motion.div 
              key={wallet.id}
              whileTap={{ scale: 0.96 }}
              className="snap-start min-w-[150px] p-4 rounded-2xl bg-card border border-border flex flex-col gap-3 shadow-sm shadow-black/5"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary border border-border/50">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground truncate mb-0.5">{wallet.walletName}</p>
                <p className="text-[15px] font-bold tracking-tight">{formatCurrency(wallet.balance)}</p>
              </div>
            </motion.div>
          ))}
          {wallets.length === 0 && (
            <div className="w-full py-8 text-center text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-border/60">
              <p className="text-[11px] font-medium italic">No wallets added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
