"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Wallet, 
  Tag, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  Banknote, 
  CreditCard, 
  Coins 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialWallets = [
  { id: 1, name: "Bank BCA", type: "Bank", balance: "Rp 8.200.000", icon: Banknote, color: "text-blue-500 bg-blue-50" },
  { id: 2, name: "Cash", type: "Physical", balance: "Rp 1.300.000", icon: Coins, color: "text-amber-500 bg-amber-50" },
  { id: 3, name: "GoPay", type: "E-Wallet", balance: "Rp 3.000.000", icon: CreditCard, color: "text-emerald-500 bg-emerald-50" },
];

const initialCategories = [
  { id: 1, name: "Food & Drink", type: "Expense", icon: Tag, color: "text-orange-500 bg-orange-50" },
  { id: 2, name: "Transportation", type: "Expense", icon: Tag, color: "text-blue-500 bg-blue-50" },
  { id: 3, name: "Income", type: "Income", icon: Tag, color: "text-emerald-500 bg-emerald-50" },
  { id: 4, name: "Groceries", type: "Expense", icon: Tag, color: "text-indigo-500 bg-indigo-50" },
];

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<"wallets" | "categories">("wallets");

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Tab Switcher */}
      <div className="flex p-1.5 bg-muted rounded-[2.5rem] self-center sm:self-start min-w-[300px] border border-border/50">
        <button
          onClick={() => setActiveTab("wallets")}
          className={cn(
            "flex-1 py-3 px-6 rounded-[2rem] text-sm font-bold transition-all duration-300",
            activeTab === 'wallets' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Wallets
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "flex-1 py-3 px-6 rounded-[2rem] text-sm font-bold transition-all duration-300",
            activeTab === 'categories' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Categories
        </button>
      </div>

      {/* 2. List Section */}
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black tracking-tight capitalize">
            {activeTab} 
            <span className="ml-2 text-sm font-medium text-muted-foreground">({activeTab === 'wallets' ? initialWallets.length : initialCategories.length})</span>
          </h3>
          <button className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {activeTab === "wallets" ? (
              initialWallets.map((wallet, idx) => (
                <ManagementItem 
                  key={wallet.id} 
                  title={wallet.name}
                  subtitle={wallet.type}
                  value={wallet.balance}
                  Icon={wallet.icon}
                  color={wallet.color}
                  delay={idx * 0.1}
                />
              ))
            ) : (
              initialCategories.map((cat, idx) => (
                <ManagementItem 
                  key={cat.id} 
                  title={cat.name}
                  subtitle={cat.type}
                  Icon={cat.icon}
                  color={cat.color}
                  delay={idx * 0.1}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ManagementItem({ 
  title, 
  subtitle, 
  value, 
  Icon, 
  color, 
  delay 
}: { 
  title: string, 
  subtitle: string, 
  value?: string, 
  Icon: React.ElementType, 
  color: string,
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", color)}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-lg tracking-tight mb-0.5 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{subtitle}</p>
      </div>
      
      {value && (
        <div className="text-right mr-4">
          <p className="font-black text-lg tracking-tight text-slate-900">{value}</p>
        </div>
      )}
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
          <Edit3 className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors sm:hidden" />
    </motion.div>
  );
}
