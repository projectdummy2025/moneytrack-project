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
    <div className="flex flex-col gap-6 select-none">
      {/* Balance Card Section */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-[2rem] p-6 relative overflow-hidden border border-[#35c2c1]/20 shadow-lg shadow-[#35c2c1]/10"
        style={{ background: "linear-gradient(135deg, #35c2c1 0%, #2aadac 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white opacity-20" />
        <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-white opacity-10" />
        
        <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.18em] mb-1">Total Balance</p>
        <h2 className="text-display-xl font-black text-white mb-6 tracking-tighter">
          {formatCurrency(totalBalance)}
        </h2>

        <div className="flex items-center gap-6">
          {/* Income */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.16em] leading-none mb-1">Income</span>
              <span className="text-body-sm font-black text-white leading-none">{formatCompactNumber(totalIncome)}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-white/20" />

          {/* Expenses */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.16em] leading-none mb-1">Expenses</span>
              <span className="text-body-sm font-black text-white leading-none">{formatCompactNumber(totalExpense)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wallets Section */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-heading-sm font-black tracking-tight text-foreground">My Wallets</h3>
          <Link href="/wallets" className="text-meta font-extrabold text-[#35C2C1] uppercase tracking-wider hover:opacity-85 transition-opacity">View All</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
          {wallets.map((wallet) => (
            <motion.div
              key={wallet.id}
              whileTap={{ scale: 0.96 }}
              className="snap-start min-w-[145px] p-5 rounded-2xl bg-card border border-border/40 flex flex-col gap-2 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#35c2c1]/40" />
              
              <p className="text-meta-xs font-black text-muted-foreground/60 uppercase tracking-[0.16em] truncate mt-1">
                {wallet.walletName}
              </p>
              <p className="text-body font-black tracking-tight text-foreground">
                {formatCurrency(wallet.balance)}
              </p>
            </motion.div>
          ))}
          {wallets.length === 0 && (
            <div className="w-full py-8 text-center text-muted-foreground bg-secondary rounded-[2rem] border border-dashed border-border/50">
              <p className="text-meta font-medium italic opacity-60">No wallets added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
