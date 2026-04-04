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
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-secondary rounded-2xl border border-border/50 self-center w-full max-w-[320px]">
        <button
          onClick={() => actions.setActiveTab("wallets")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300",
            state.activeTab === 'wallets' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Wallets
        </button>
        <button
          onClick={() => actions.setActiveTab("categories")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300",
            state.activeTab === 'categories' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Categories
        </button>
      </div>

      {/* List Section */}
      <div className="flex flex-col gap-6 pb-24">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground capitalize">
              {state.activeTab} 
            </h3>
            <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-bold">
              {state.itemCount}
            </span>
          </div>
          <button className="w-10 h-10 rounded-xl bg-accent text-white shadow-md shadow-accent/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, x: state.activeTab === 'wallets' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: state.activeTab === 'wallets' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
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
