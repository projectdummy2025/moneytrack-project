"use client";

import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
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
          <div className="h-4 w-24 bg-muted/20 rounded-full" />
          <div className="h-12 w-48 bg-muted/20 rounded-2xl" />
          <div className="h-4 w-32 bg-muted/20 rounded-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 bg-muted/20 rounded-full" />
          <div className="flex gap-4 overflow-hidden">
            <div className="min-w-[140px] h-32 bg-muted/10 rounded-3xl" />
            <div className="min-w-[140px] h-32 bg-muted/10 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Centered Hero Balance */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center py-6"
      >
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Total Balance</span>
        <h2 className="text-5xl font-black tracking-tighter text-foreground mb-4">
          {formatCurrency(totalBalance)}
        </h2>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {formatCompactNumber(totalIncome)}
            </span>
          </div>
          <div className="w-[1px] h-3 bg-border" />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {formatCompactNumber(totalExpense)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Wallets - Minimalist Horizontal Scroll */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Wallets</h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary/80">Manage</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
          {wallets.map((wallet) => (
            <motion.div 
              key={wallet.id}
              whileTap={{ scale: 0.95 }}
              className="snap-start min-w-[160px] p-5 rounded-[2rem] bg-card border border-border/50 flex flex-col gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground truncate mb-0.5">{wallet.walletName}</p>
                <p className="text-sm font-black tracking-tight">{formatCurrency(wallet.balance)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getWalletColor(type: string) {
  switch (type.toLowerCase()) {
    case 'bank': return 'bg-indigo-500';
    case 'cash': return 'bg-amber-500';
    case 'e-wallet': return 'bg-emerald-500';
    default: return 'bg-slate-700';
  }
}

function WalletItem({ name, balance, type, color }: { name: string, balance: string, type: string, color: string }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      className="snap-start min-w-[240px] p-6 rounded-[2.5rem] bg-card border border-border/50 shadow-sm flex flex-col gap-6 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl shadow-${type}/20`}>
          <Wallet className="w-6 h-6 stroke-[2.5px]" />
        </div>
        <div className="px-3 py-1 rounded-full bg-muted/50 border border-border/30">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{type}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-black text-lg tracking-tight mb-0.5 group-hover:text-primary transition-colors">{name}</h4>
        <p className="text-2xl font-black tracking-tighter text-foreground">{balance}</p>
      </div>
    </motion.div>
  );
}
