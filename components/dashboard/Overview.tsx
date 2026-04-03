"use client";

import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function BalanceCard() {
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
            Rp 12.500.000
          </motion.h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/15 p-3 rounded-2xl backdrop-blur-md">
              <div className="p-2 rounded-xl bg-green-400/20">
                <ArrowUpRight className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-white/70">Income</p>
                <p className="font-bold">Rp 8.0M</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/15 p-3 rounded-2xl backdrop-blur-md">
              <div className="p-2 rounded-xl bg-red-400/20">
                <ArrowDownLeft className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-white/70">Expense</p>
                <p className="font-bold">Rp 3.5M</p>
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
        <WalletItem name="Bank BCA" balance="Rp 8.200.000" type="Bank" color="bg-blue-500" />
        <WalletItem name="Cash" balance="Rp 1.300.000" type="Cash" color="bg-amber-500" />
        <WalletItem name="GoPay" balance="Rp 3.000.000" type="E-Wallet" color="bg-emerald-500" />
      </div>
    </div>
  );
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
        <p className="text-sm text-muted-foreground font-medium">{type}</p>
        <h4 className="font-bold text-lg leading-tight mb-1">{name}</h4>
      </div>
      <p className="text-xl font-extrabold tracking-tight mt-2">{balance}</p>
    </motion.div>
  );
}
