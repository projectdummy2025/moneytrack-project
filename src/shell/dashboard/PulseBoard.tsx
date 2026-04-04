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
    return <div className="animate-pulse flex flex-col gap-6">
      <div className="h-48 bg-muted rounded-[2.5rem]" />
      <div className="h-8 w-32 bg-muted rounded mx-2" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map(i => <div key={i} className="min-w-[200px] h-40 bg-muted rounded-[2rem]" />)}
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Total Balance */}
      <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-600 text-white shadow-2xl shadow-primary/30">
        <div className="relative z-10">
          <p className="text-primary-foreground/80 font-medium mb-1 tracking-wide">Total Balance</p>
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8"
          >
            {formatCurrency(totalBalance)}
          </motion.h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/15 p-3 rounded-2xl backdrop-blur-md">
              <div className="p-2 rounded-xl bg-green-400/20">
                <ArrowUpRight className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-white/70">Income</p>
                <p className="font-bold">{formatCompactNumber(totalIncome)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/15 p-3 rounded-2xl backdrop-blur-md">
              <div className="p-2 rounded-xl bg-red-400/20">
                <ArrowDownLeft className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-white/70">Expense</p>
                <p className="font-bold">{formatCompactNumber(totalExpense)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Background Decor */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" 
        />
        <div className="absolute top-1/2 -left-20 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl" />
      </div>

      {/* Wallet Section Header */}
      <div className="flex items-center justify-between px-2 mt-2">
        <h3 className="text-xl font-bold tracking-tight">Your Wallets</h3>
        <button className="text-primary font-semibold text-sm hover:underline">See All</button>
      </div>

      {/* Horizontal Wallet Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
        {wallets.map((wallet) => (
          <WalletItem 
            key={wallet.id} 
            name={wallet.walletName} 
            balance={formatCurrency(wallet.balance)} 
            type={wallet.walletType} 
            color={getWalletColor(wallet.walletType)} 
          />
        ))}
      </div>
    </div>
  );
}

function getWalletColor(type: string) {
  switch (type.toLowerCase()) {
    case 'bank': return 'bg-blue-500';
    case 'cash': return 'bg-amber-500';
    case 'e-wallet': return 'bg-emerald-500';
    default: return 'bg-primary';
  }
}

function WalletItem({ name, balance, type, color }: { name: string, balance: string, type: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="snap-start min-w-[200px] sm:min-w-[240px] p-6 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col gap-4 group transition-all"
    >
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        <Wallet className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium capitalize">{type}</p>
        <h4 className="font-bold text-lg leading-tight mb-1">{name}</h4>
      </div>
      <p className="text-xl font-extrabold tracking-tight mt-2">{balance}</p>
    </motion.div>
  );
}
