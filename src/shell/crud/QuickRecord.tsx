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
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-[3rem] shadow-2xl p-8 pb-12 sm:max-w-2xl sm:mx-auto sm:bottom-12 sm:rounded-[3rem] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight">New Transaction</h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-all font-bold"
              >
                <X className="w-6 h-6 stroke-[3px]" />
              </button>
            </div>

            <div className="flex p-1 bg-muted rounded-2xl mb-8 border border-border/50">
              <button
                onClick={() => actions.setType("expense")}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  state.type === "expense" ? "bg-red-500 text-white shadow-lg shadow-red-200" : "text-muted-foreground"
                )}
              >
                Expense
              </button>
              <button
                onClick={() => actions.setType("income")}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  state.type === "income" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "text-muted-foreground"
                )}
              >
                Income
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Amount</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground group-focus-within:text-primary transition-colors">Rp</span>
                  <input 
                    type="number"
                    placeholder="0"
                    value={state.amount}
                    onChange={(e) => actions.setAmount(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-muted border-none text-3xl font-black tracking-tight focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Memo (Optional)</label>
                <input 
                  type="text"
                  placeholder="What was this for?"
                  value={state.memo}
                  onChange={(e) => actions.setMemo(e.target.value)}
                  className="w-full px-8 py-4 rounded-2xl bg-muted border-none text-base font-bold tracking-tight focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Wallet</label>
                  <select 
                    value={state.selectedWalletId}
                    onChange={(e) => actions.setSelectedWalletId(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-muted border-none font-bold text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
                  >
                    {state.wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.walletName}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Category</label>
                  <select 
                    value={state.selectedCategoryId}
                    onChange={(e) => actions.setSelectedCategoryId(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-muted border-none font-bold text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
                  >
                    {state.filteredCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting}
                className={cn(
                  "w-full mt-6 py-6 rounded-[2.5rem] bg-primary text-white text-xl font-black tracking-tight shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 group",
                  state.isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {state.isSubmitting ? "Recording..." : "Record Now"}
                {!state.isSubmitting && <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
