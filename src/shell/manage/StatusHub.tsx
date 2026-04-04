"use client";

import React from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@core/utils/HelperTool";
import { MasterRegistry } from "./MasterRegistry";

interface StatusHubProps {
  state: {
    activeTab: "wallets" | "categories";
    walletItems: any[];
    categoryItems: any[];
    isLoading: boolean;
    itemCount: number;
  };
  actions: {
    setActiveTab: (tab: "wallets" | "categories") => void;
  };
}

export function StatusHub({ state, actions }: StatusHubProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Tab Switcher */}
      <div className="flex p-1.5 bg-muted rounded-[2.5rem] self-center sm:self-start min-w-[300px] border border-border/50">
        <button
          onClick={() => actions.setActiveTab("wallets")}
          className={cn(
            "flex-1 py-3 px-6 rounded-[2rem] text-sm font-bold transition-all duration-300",
            state.activeTab === 'wallets' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Wallets
        </button>
        <button
          onClick={() => actions.setActiveTab("categories")}
          className={cn(
            "flex-1 py-3 px-6 rounded-[2rem] text-sm font-bold transition-all duration-300",
            state.activeTab === 'categories' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Categories
        </button>
      </div>

      {/* 2. List Section */}
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black tracking-tight capitalize">
            {state.activeTab} 
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              ({state.itemCount})
            </span>
          </h3>
          <button className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {state.activeTab === "wallets" ? (
              <MasterRegistry items={state.walletItems} isLoading={state.isLoading} />
            ) : (
              <MasterRegistry items={state.categoryItems} isLoading={state.isLoading} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
