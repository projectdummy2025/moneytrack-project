"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] bg-background rounded-t-[2rem] shadow-2xl flex flex-col max-h-[92vh] w-full max-w-[430px] overflow-hidden font-['Urbanist',sans-serif]"
          >
            {/* Handle */}
            <div className="w-full flex justify-center py-3">
              <div className="w-12 h-1.5 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="px-6 py-2 flex items-center justify-between border-b border-border/50">
              <button 
                onClick={onClose}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-bold text-foreground">New Record</h3>
              <button 
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting || !state.amount}
                className="p-2 -mr-2 text-accent disabled:opacity-30 transition-all"
              >
                <Check className="w-6 h-6 stroke-[3px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-12">
              {/* Type Switcher */}
              <div className="flex bg-secondary p-1 rounded-2xl w-full">
                <button 
                  onClick={() => actions.setType("expense")}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                    state.type === "expense" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Expense
                </button>
                <button 
                  onClick={() => actions.setType("income")}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                    state.type === "income" ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Income
                </button>
              </div>

              {/* Amount Input Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full relative flex items-baseline justify-center">
                  <span className="text-2xl font-bold text-muted-foreground/40 mr-2">IDR</span>
                  <input 
                    type="number"
                    autoFocus
                    placeholder="0"
                    value={state.amount}
                    onChange={(e) => actions.setAmount(e.target.value)}
                    className="bg-transparent text-center text-6xl font-extrabold tracking-tight outline-none placeholder:text-muted w-[200px]"
                  />
                </div>
                <div className="w-full bg-secondary rounded-2xl p-4">
                  <input 
                    type="text"
                    placeholder="Add a note (optional)..."
                    value={state.memo}
                    onChange={(e) => actions.setMemo(e.target.value)}
                    className="w-full bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {/* Selector Sections */}
              <div className="flex flex-col gap-8">
                {/* Wallet Selection */}
                <div className="flex flex-col gap-3">
                  <p className="text-[13px] font-bold text-foreground ml-1">Wallet</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                    {state.wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => actions.setSelectedWalletId(wallet.id)}
                        className={cn(
                          "px-5 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold",
                          state.selectedWalletId === wallet.id 
                            ? "bg-accent border-accent text-white shadow-md shadow-accent/20" 
                            : "bg-secondary border-transparent text-muted-foreground"
                        )}
                      >
                        {wallet.walletName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-3">
                  <p className="text-[13px] font-bold text-foreground ml-1">Category</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                    {state.filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => actions.setSelectedCategoryId(cat.id)}
                        className={cn(
                          "px-5 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold",
                          state.selectedCategoryId === cat.id 
                            ? "bg-primary border-primary text-white shadow-md" 
                            : "bg-secondary border-transparent text-muted-foreground"
                        )}
                      >
                        {cat.categoryName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button (Mobile Style) */}
              <div className="mt-4 safe-bottom">
                <button 
                  onClick={actions.handleSubmit}
                  disabled={state.isSubmitting || !state.amount}
                  className={cn(
                    "w-full py-4 rounded-2xl bg-primary text-primary-foreground text-[15px] font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                    (state.isSubmitting || !state.amount) && "opacity-50 grayscale cursor-not-allowed"
                  )}
                >
                  {state.isSubmitting ? "Processing..." : "Save Transaction"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
