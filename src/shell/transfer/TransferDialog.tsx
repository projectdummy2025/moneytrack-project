"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
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
            className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] bg-[#121418] rounded-t-[24px] flex flex-col h-[88vh] w-full max-w-[430px] overflow-hidden font-['Inter',sans-serif]"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-0 shrink-0">
              <div className="bg-white/10 h-[4px] rounded-full w-[60px]" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between px-[15px] pt-[12px] pb-0 shrink-0">
              <p className="text-heading-sm font-extrabold text-white">Transfer</p>
              <button
                onClick={onClose}
                className="cursor-pointer flex items-center justify-center size-[38px] rounded-full bg-white/5 active:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Amount display */}
            <div className="shrink-0 px-[15px] pb-[20px] pt-[25px] text-center">
              <p className="text-meta font-medium text-white/50 mb-[5px]">Transfer Amount</p>
              <input
                type="number"
                placeholder="0.00"
                value={state.amount}
                onChange={(e) => actions.setAmount(e.target.value)}
                className="bg-transparent text-center text-display-xl font-black text-white outline-none w-full"
              />
            </div>

            <div className="bg-white/5 h-px w-full shrink-0" />

            {/* Scrollable form fields */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-[#121418]">
              {state.error && (
                <div className="mx-[15px] mt-[15px] bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                  {state.error}
                </div>
              )}

              {/* From Account Selection */}
              <div className="flex flex-col gap-3 p-[15px]">
                <p className="text-meta font-medium text-white/50">From Account</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {state.wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => actions.setSourceWalletId(wallet.id)}
                      className={cn(
                        "px-[15px] py-[10px] rounded-[35px] border transition-all whitespace-nowrap text-meta font-medium flex flex-col items-start",
                        state.sourceWalletId === wallet.id
                          ? "bg-[#6a66ff1a] border-[#6a66ff] text-white"
                          : "bg-transparent border-white/10 text-white/70"
                      )}
                    >
                      <span>{wallet.walletName}</span>
                      <span className="text-meta-2xs opacity-50">IDR {wallet.balance}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 h-px w-full" />

              {/* To Account Selection */}
              <div className="flex flex-col gap-3 p-[15px]">
                <p className="text-meta font-medium text-white/50">To Account</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {state.wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      disabled={wallet.id === state.sourceWalletId}
                      onClick={() => actions.setTargetWalletId(wallet.id)}
                      className={cn(
                        "px-[15px] py-[10px] rounded-[35px] border transition-all whitespace-nowrap text-meta font-medium flex flex-col items-start",
                        state.targetWalletId === wallet.id
                          ? "bg-[#00fc651a] border-[#00fc65] text-white"
                          : wallet.id === state.sourceWalletId
                            ? "opacity-30 grayscale cursor-not-allowed border-white/5"
                            : "bg-transparent border-white/10 text-white/70"
                      )}
                    >
                      <span>{wallet.walletName}</span>
                      <span className="text-meta-2xs opacity-50">IDR {wallet.balance}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 h-px w-full" />

              {/* Notes */}
              <div className="px-[15px] py-[15px]">
                <p className="text-meta font-medium text-white/50 mb-[5px]">Notes</p>
                <textarea
                  placeholder="Add a note..."
                  value={state.memo}
                  onChange={(e) => actions.setMemo(e.target.value)}
                  className="w-full bg-transparent text-body-sm font-medium text-white/80 outline-none resize-none h-20"
                />
              </div>
            </div>

            {/* Transfer Button */}
            <div className="shrink-0 px-[15px] pb-[30px] pt-[10px] bg-[#121418]">
              <button
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting || !state.amount || !state.sourceWalletId || !state.targetWalletId}
                className={cn(
                  "w-full bg-[#6a66ff] h-[48px] rounded-[10px] flex items-center justify-center active:opacity-90 transition-all",
                  (state.isSubmitting || !state.amount) && "opacity-50 grayscale cursor-not-allowed"
                )}
              >
                {state.isSubmitting ? (
                  <Loader2 className="animate-spin text-white" size={20} />
                ) : (
                  <p className="text-body-sm font-bold text-white">Transfer Now</p>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
