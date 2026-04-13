"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { Wallet, Category } from "@core/types/DataCore";
import { RecordType } from "@core/hooks/RecordCore";

interface QuickRecordProps {
  isOpen: boolean;
  onClose: () => void;
  state: {
    amount: string;
    type: RecordType;
    selectedWalletId: string;
    targetWalletId: string;
    selectedCategoryId: string;
    memo: string;
    isSubmitting: boolean;
    error: string;
    wallets: Wallet[];
    filteredCategories: Category[];
  };
  actions: {
    setAmount: (val: string) => void;
    setType: (val: RecordType) => void;
    setSelectedWalletId: (val: string) => void;
    setTargetWalletId: (val: string) => void;
    setSelectedCategoryId: (val: string) => void;
    setMemo: (val: string) => void;
    handleSubmit: () => void;
  };
}

export function QuickRecord({ isOpen, onClose, state, actions }: QuickRecordProps) {
  const isSwap = state.type === "swap";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#0f1717]/80 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] bg-[#162424] rounded-t-[24px] flex flex-col h-[88vh] w-full max-w-[430px] overflow-hidden font-['Urbanist',sans-serif]"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-0 shrink-0">
              <div className="bg-white/10 h-[4px] rounded-full w-[60px]" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between px-[15px] pt-[12px] pb-0 shrink-0">
              <p className="text-heading-sm font-extrabold text-white tracking-tight">Add Record</p>
              <button
                onClick={onClose}
                className="cursor-pointer flex items-center justify-center size-[38px] rounded-full bg-white/5 active:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex items-start shrink-0 px-0 mt-[10px]">
              {(["expense", "income", "swap"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => actions.setType(tab)}
                  className="flex flex-1 flex-col items-center gap-[16px] cursor-pointer"
                >
                  <span
                    className={cn(
                      "text-body font-bold capitalize transition-colors",
                      state.type === tab
                        ? tab === "expense" ? "text-[#db3c3c]" : tab === "income" ? "text-[#35C2C1]" : "text-[#3b82f6]"
                        : "text-white/40"
                    )}
                  >
                    {tab}
                  </span>
                  <div
                    className={cn(
                      "w-full h-[2px] transition-colors",
                      state.type === tab 
                        ? tab === "expense" ? "bg-[#db3c3c]" : tab === "income" ? "bg-[#35C2C1]" : "bg-[#3b82f6]"
                        : "bg-white/5"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Amount display */}
            <div className="shrink-0 px-[15px] pb-[20px] pt-[15px] text-center">
              <p className="text-meta-xs font-bold text-white/40 uppercase tracking-widest mb-[5px]">
                {state.type} amount
              </p>
              <div className="flex items-center justify-center gap-2">
                {state.type === "expense" && <span className="text-[#db3c3c] text-display-xl font-black">-</span>}
                <input
                  type="number"
                  placeholder="0"
                  value={state.amount}
                  onChange={(e) => actions.setAmount(e.target.value)}
                  className={cn(
                    "bg-transparent text-center text-display-xl font-black outline-none w-full max-w-[300px]",
                    state.type === "expense" ? "text-[#db3c3c]" : state.type === "income" ? "text-[#35C2C1]" : "text-[#3b82f6]"
                  )}
                />
              </div>
            </div>

            <div className="bg-white/5 h-px w-full shrink-0" />

            {/* Scrollable form fields */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-[#162424]">
              {state.error && (
                <div className="mx-[15px] mt-[15px] p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-meta-xs font-bold text-center uppercase tracking-wide">
                  {state.error}
                </div>
              )}

              {/* Account Selection */}
              <div className="flex flex-col gap-3 p-[15px]">
                <p className="text-meta-xs font-bold text-white/40 uppercase tracking-widest">
                  {isSwap ? "Source Account" : "Account"}
                </p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {state.wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => actions.setSelectedWalletId(wallet.id)}
                      className={cn(
                        "px-[18px] py-[10px] rounded-[35px] border transition-all whitespace-nowrap text-body-sm font-bold",
                        state.selectedWalletId === wallet.id
                          ? "bg-[#35C2C1]/10 border-[#35C2C1] text-[#35C2C1]"
                          : "bg-white/5 border-white/5 text-white/40"
                      )}
                    >
                      {wallet.walletName}
                    </button>
                  ))}
                </div>
              </div>

              {isSwap && (
                <>
                  <div className="bg-white/5 h-px w-full" />
                  {/* Destination Account Selection */}
                  <div className="flex flex-col gap-3 p-[15px]">
                    <p className="text-meta-xs font-bold text-white/40 uppercase tracking-widest">Destination Account</p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                      {state.wallets.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => actions.setTargetWalletId(wallet.id)}
                          className={cn(
                            "px-[18px] py-[10px] rounded-[35px] border transition-all whitespace-nowrap text-body-sm font-bold",
                            state.targetWalletId === wallet.id
                              ? "bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6]"
                              : "bg-white/5 border-white/5 text-white/40"
                          )}
                        >
                          {wallet.walletName}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!isSwap && (
                <>
                  <div className="bg-white/5 h-px w-full" />
                  {/* Category Selection */}
                  <div className="flex flex-col gap-3 p-[15px]">
                    <p className="text-meta-xs font-bold text-white/40 uppercase tracking-widest">Category</p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                      {state.filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => actions.setSelectedCategoryId(cat.id)}
                          className={cn(
                            "px-[18px] py-[10px] rounded-[35px] border transition-all whitespace-nowrap text-body-sm font-bold",
                            state.selectedCategoryId === cat.id
                              ? "bg-[#35C2C1]/10 border-[#35C2C1] text-[#35C2C1]"
                              : "bg-white/5 border-white/5 text-white/40"
                          )}
                        >
                          {cat.categoryName}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="bg-white/5 h-px w-full" />

              {/* Notes */}
              <div className="px-[15px] py-[15px]">
                <p className="text-meta-xs font-bold text-white/40 uppercase tracking-widest mb-[10px]">Notes</p>
                <textarea
                  placeholder="What was this for?..."
                  value={state.memo}
                  onChange={(e) => actions.setMemo(e.target.value)}
                  className="w-full bg-white/5 rounded-2xl p-4 text-body font-medium text-white/80 outline-none resize-none h-24 border border-white/5 focus:border-[#35C2C1]/30 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Add Record Button */}
            <div className="shrink-0 px-[15px] pb-[40px] pt-[15px] bg-[#162424]">
              <button
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting || !state.amount || !state.selectedWalletId || (!isSwap && !state.selectedCategoryId) || (isSwap && !state.targetWalletId)}
                className={cn(
                  "w-full bg-[#35C2C1] h-[54px] rounded-2xl flex items-center justify-center active:scale-[0.98] transition-all shadow-lg shadow-[#35C2C1]/20",
                  (state.isSubmitting || !state.amount) && "opacity-50 grayscale cursor-not-allowed"
                )}
              >
                <p className="text-heading-sm font-bold text-white">
                  {state.isSubmitting ? "Processing..." : isSwap ? "Confirm Swap" : "Record " + state.type}
                </p>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
