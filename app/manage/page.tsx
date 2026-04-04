"use client";

import React, { useState, useMemo } from "react";
import { Plus, Wallet, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWallets } from "@/hooks/use-wallets";
import { useCategories } from "@/hooks/use-categories";
import { ManagementList } from "@/components/manage/ManagementList";

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<"wallets" | "categories">("wallets");
  const { wallets, isLoading: isLoadingWallets } = useWallets();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const walletItems = useMemo(() => {
    return wallets.map((w, idx) => ({
      title: w.walletName,
      subtitle: w.walletType,
      value: w.balance,
      icon: Wallet,
      colorClass: getWalletColor(w.walletType),
      delay: idx * 0.05
    }));
  }, [wallets]);

  const categoryItems = useMemo(() => {
    return categories.map((c, idx) => ({
      title: c.categoryName,
      subtitle: c.classification,
      icon: Tag,
      colorClass: c.classification === 'income' ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50',
      delay: idx * 0.05
    }));
  }, [categories]);

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
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              ({activeTab === 'wallets' ? wallets.length : categories.length})
            </span>
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
          >
            {activeTab === "wallets" ? (
              <ManagementList items={walletItems} isLoading={isLoadingWallets} />
            ) : (
              <ManagementList items={categoryItems} isLoading={isLoadingCategories} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function getWalletColor(type: string) {
  switch (type.toLowerCase()) {
    case 'bank': return 'text-blue-500 bg-blue-50';
    case 'cash': return 'text-amber-500 bg-amber-50';
    case 'e-wallet': return 'text-emerald-500 bg-emerald-50';
    default: return 'text-primary bg-primary/10';
  }
}
