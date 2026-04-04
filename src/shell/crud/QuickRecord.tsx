"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { Wallet, Category } from "@core/types/DataCore";

interface QuickRecordProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    amount: string;
    type: "expense" | "income";
    selectedWalletId: string;
    selectedCategoryId: string;
    memo: string;
    isSubmitting: boolean;
    wallets: Wallet[];
    filteredCategories: Category[];
  };
  actions: {
    setAmount: (val: string) => void;
    setType: (val: "expense" | "income") => void;
    setSelectedWalletId: (val: string) => void;
    setSelectedCategoryId: (val: string) => void;
    setMemo: (val: string) => void;
    handleSubmit: () => void;
  };
}

export function QuickRecord({ isOpen, onClose, state, actions }: QuickRecordProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-card rounded-t-[2.5rem] border-t border-border shadow-2xl flex flex-col max-h-[95vh] w-full max-w-xl mx-auto"
          >
            {/* Minimal Handle */}
            <div className="w-full flex justify-center py-5">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            <div className="px-6 pb-10 flex flex-col gap-8 overflow-y-auto scrollbar-hide">
              {/* Type Switcher & Close */}
              <div className="flex items-center justify-between">
                <div className="flex bg-muted/50 p-1 rounded-2xl">
                  <button 
                    onClick={() => actions.setType("expense")}
                    className={cn(
                      "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      state.type === "expense" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/50"
                    )}
                  >
                    Expense
                  </button>
                  <button 
                    onClick={() => actions.setType("income")}
                    className={cn(
                      "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      state.type === "income" ? "bg-background text-emerald-500 shadow-sm" : "text-muted-foreground/50"
                    )}
                  >
                    Income
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              {/* Immersive Amount Input */}
              <div className="flex flex-col items-center py-6 gap-2">
                <div className="relative flex items-center justify-center w-full">
                  <span className="text-xl font-black text-muted-foreground/30 absolute left-2 opacity-50 uppercase tracking-widest">IDR</span>
                  <input 
                    type="number"
                    autoFocus
                    placeholder="0"
                    value={state.amount}
                    onChange={(e) => actions.setAmount(e.target.value)}
                    className="w-full bg-transparent text-center text-7xl font-black tracking-tighter outline-none placeholder:text-muted/20 py-2 selection:bg-primary/20"
                  />
                </div>
                <input 
                  type="text"
                  placeholder="Record note..."
                  value={state.memo}
                  onChange={(e) => actions.setMemo(e.target.value)}
                  className="w-full text-center text-sm font-bold text-muted-foreground outline-none bg-transparent"
                />
              </div>

              {/* Selector Sections */}
              <div className="flex flex-col gap-10">
                {/* Wallet Horizontal Pills */}
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Paid With</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {state.wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => actions.setSelectedWalletId(wallet.id)}
                        className={cn(
                          "px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-black",
                          state.selectedWalletId === wallet.id 
                            ? "bg-foreground text-background border-foreground shadow-lg" 
                            : "bg-muted/30 border-border/50 text-muted-foreground"
                        )}
                      >
                        {wallet.walletName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Horizontal Pills */}
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Category</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {state.filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => actions.setSelectedCategoryId(cat.id)}
                        className={cn(
                          "px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-black",
                          state.selectedCategoryId === cat.id 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-muted/30 border-border/50 text-muted-foreground"
                        )}
                      >
                        {cat.categoryName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky-like Action Button */}
              <button 
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting || !state.amount}
                className={cn(
                  "w-full py-6 rounded-3xl bg-foreground text-background text-lg font-black tracking-widest uppercase shadow-2xl active:scale-95 transition-all mt-4 mb-2 flex items-center justify-center gap-3",
                  (state.isSubmitting || !state.amount) && "opacity-20 cursor-not-allowed grayscale"
                )}
              >
                {state.isSubmitting ? "Saving..." : "Add Record"}
                {!state.isSubmitting && <ArrowRight className="w-6 h-6 stroke-[3px]" />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
