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
      {/* 1. Tab Switcher - Premium Segmented Control */}
      <div className="flex p-1 bg-muted/40 rounded-[2rem] border border-border/40 backdrop-blur-sm self-center w-full max-w-sm">
        <button
          onClick={() => actions.setActiveTab("wallets")}
          className={cn(
            "flex-1 py-3 px-6 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all duration-500",
            state.activeTab === 'wallets' ? "bg-background text-primary shadow-xl shadow-black/5" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Wallets
        </button>
        <button
          onClick={() => actions.setActiveTab("categories")}
          className={cn(
            "flex-1 py-3 px-6 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all duration-500",
            state.activeTab === 'categories' ? "bg-background text-primary shadow-xl shadow-black/5" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Categories
        </button>
      </div>

      {/* 2. List Section */}
      <div className="flex flex-col gap-6 pb-28 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
            {state.activeTab} 
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
              {state.itemCount}
            </span>
          </h3>
          <button className="w-12 h-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
