"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
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
      <div className="animate-pulse flex flex-col gap-6">
        <div className="h-40 bg-muted rounded-3xl" />
        <div className="h-24 bg-muted rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Balance Card Section */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-accent/20"
        style={{ background: "linear-gradient(135deg, #35c2c1 0%, #2aadac 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white opacity-20" />
        <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-white opacity-10" />
        
        <p className="text-meta-xs font-semibold text-white/80 uppercase tracking-wider mb-1">Total Balance</p>
        <h2 className="text-display-xl font-black text-white mb-6 tracking-tight">
          {formatCurrency(totalBalance)}
        </h2>

        <div className="flex items-center gap-6">
          {/* Income */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M9 0L18 16H0L9 0Z" fill="#13873D" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-meta-2xs font-semibold text-white/80 uppercase leading-none mb-0.5">Income</span>
              <span className="text-body-sm font-bold text-white leading-none">{formatCompactNumber(totalIncome)}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-white/20" />

          {/* Expenses */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M9 16L0 0H18L9 16Z" fill="#B90B0B" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-meta-2xs font-semibold text-white/80 uppercase leading-none mb-0.5">Expenses</span>
              <span className="text-body-sm font-bold text-white leading-none">{formatCompactNumber(totalExpense)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wallets Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-body-lg font-extrabold text-foreground">My Wallets</h3>
          <Link href="/wallets" className="text-body-xs font-bold text-accent hover:opacity-80 transition-opacity">View All</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
          {wallets.map((wallet) => (
            <motion.div
              key={wallet.id}
              whileTap={{ scale: 0.96 }}
              className="snap-start min-w-[140px] p-4 rounded-xl bg-card border border-border flex flex-col gap-3 shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border/50">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-meta-2xs font-semibold text-muted-foreground truncate mb-0.5 uppercase">{wallet.walletName}</p>
                <p className="text-body font-bold tracking-tight text-foreground">{formatCurrency(wallet.balance)}</p>
              </div>
            </motion.div>
          ))}
          {wallets.length === 0 && (
            <div className="w-full py-6 text-center text-muted-foreground bg-secondary rounded-2xl border border-dashed border-border">
              <p className="text-meta font-medium italic">No wallets added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
