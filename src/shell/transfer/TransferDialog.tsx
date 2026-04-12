"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, Loader2 } from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { Wallet } from "@core/types/DataCore";

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    sourceWalletId: string;
    targetWalletId: string;
    amount: string;
    memo: string;
    isSubmitting: boolean;
    error: string;
    wallets: Wallet[];
  };
  actions: {
    setSourceWalletId: (val: string) => void;
    setTargetWalletId: (val: string) => void;
    setAmount: (val: string) => void;
    setMemo: (val: string) => void;
    handleSubmit: () => void;
  };
}

export function TransferDialog({ isOpen, onClose, state, actions }: TransferDialogProps) {
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
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] bg-background rounded-t-[2rem] shadow-2xl flex flex-col max-h-[85vh] w-full max-w-[430px] overflow-hidden font-['Urbanist',sans-serif]"
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
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-foreground">Transfer</h3>
              </div>
              <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-8">
              {state.error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {state.error}
                </div>
              )}

              {/* Source Wallet */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-bold text-foreground ml-1">From</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                  {state.wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => actions.setSourceWalletId(wallet.id)}
                      className={cn(
                        "px-4 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold",
                        state.sourceWalletId === wallet.id
                          ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-secondary border-transparent text-muted-foreground"
                      )}
                    >
                      <div>{wallet.walletName}</div>
                      <div className="text-[10px] opacity-70">IDR {wallet.balance}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-accent" />
                </div>
              </div>

              {/* Target Wallet */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-bold text-foreground ml-1">To</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                  {state.wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => actions.setTargetWalletId(wallet.id)}
                      disabled={wallet.id === state.sourceWalletId}
                      className={cn(
                        "px-4 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold",
                        state.targetWalletId === wallet.id
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : wallet.id === state.sourceWalletId
                            ? "bg-secondary/50 border-transparent text-muted-foreground/30 cursor-not-allowed"
                            : "bg-secondary border-transparent text-muted-foreground"
                      )}
                    >
                      <div>{wallet.walletName}</div>
                      <div className="text-[10px] opacity-70">IDR {wallet.balance}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <div className="w-full relative flex items-baseline justify-center">
                  <span className="text-2xl font-bold text-muted-foreground/40 mr-2">IDR</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={state.amount}
                    onChange={(e) => actions.setAmount(e.target.value)}
                    className="bg-transparent text-center text-5xl font-extrabold tracking-tight outline-none placeholder:text-muted w-[200px]"
                  />
                </div>
              </div>

              {/* Memo */}
              <div className="w-full bg-secondary rounded-2xl p-4">
                <input
                  type="text"
                  placeholder="Add a note (optional)..."
                  value={state.memo}
                  onChange={(e) => actions.setMemo(e.target.value)}
                  className="w-full bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting || !state.amount || !state.sourceWalletId || !state.targetWalletId}
                className={cn(
                  "w-full py-4 rounded-2xl bg-accent text-white text-[15px] font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                  (state.isSubmitting || !state.amount || !state.sourceWalletId || !state.targetWalletId) && "opacity-50 grayscale cursor-not-allowed"
                )}
              >
                {state.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight size={20} />
                    Transfer Now
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
