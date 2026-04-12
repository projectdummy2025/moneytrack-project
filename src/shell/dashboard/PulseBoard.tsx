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
        className="rounded-[24px] p-6 relative overflow-hidden shadow-lg shadow-accent/20"
        style={{ background: "linear-gradient(135deg, #35c2c1 0%, #2aadac 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white opacity-20" />
        <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-white opacity-10" />
        
        <p className="text-white/90 text-[13px] font-semibold mb-1">Total Balance</p>
        <h2 className="text-white text-3xl font-extrabold mb-6 tracking-tight">
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
              <span className="text-white/80 text-[10px] font-bold uppercase leading-none mb-0.5">Income</span>
              <span className="text-white text-[14px] font-bold leading-none">{formatCompactNumber(totalIncome)}</span>
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
              <span className="text-white/80 text-[10px] font-bold uppercase leading-none mb-0.5">Expenses</span>
              <span className="text-white text-[14px] font-bold leading-none">{formatCompactNumber(totalExpense)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wallets Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[16px] font-extrabold text-[#1e232c]">My Wallets</h3>
          <Link href="/manage" className="text-[13px] font-bold text-accent hover:opacity-80 transition-opacity">Manage</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
          {wallets.map((wallet) => (
            <motion.div 
              key={wallet.id}
              whileTap={{ scale: 0.96 }}
              className="snap-start min-w-[140px] p-4 rounded-[20px] bg-white border border-[#e8ecf4] flex flex-col gap-3 shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-[#f7f8f9] flex items-center justify-center text-[#1e232c] border border-[#e8ecf4]/50">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8391a1] truncate mb-0.5 uppercase tracking-wider">{wallet.walletName}</p>
                <p className="text-[15px] font-extrabold tracking-tight text-[#1e232c]">{formatCurrency(wallet.balance)}</p>
              </div>
            </motion.div>
          ))}
          {wallets.length === 0 && (
            <div className="w-full py-6 text-center text-[#8391a1] bg-[#f7f8f9] rounded-2xl border border-dashed border-[#e8ecf4]">
              <p className="text-[12px] font-semibold italic">No wallets added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
