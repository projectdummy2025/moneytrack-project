"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Wallet, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallets } from "@/hooks/use-wallets";
import { useCategories } from "@/hooks/use-categories";

interface AddTransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddTransactionDrawer({ isOpen, onClose, onSuccess }: AddTransactionDrawerProps) {
  const { wallets, isLoading: isLoadingWallets } = useWallets();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default wallet and category when loaded
  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  useEffect(() => {
    const filteredCategories = categories.filter(c => c.classification === type);
    if (filteredCategories.length > 0) {
      setSelectedCategoryId(filteredCategories[0].id);
    } else {
      setSelectedCategoryId("");
    }
  }, [type, categories]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!amount || !selectedWalletId || !selectedCategoryId) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          walletId: selectedWalletId,
          categoryId: selectedCategoryId,
          memo,
          transactedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      onSuccess?.();
      onClose();
      // Reset form
      setAmount("");
      setMemo("");
    } catch (error) {
      console.error(error);
      alert("Error creating transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => c.classification === type);
  const selectedWallet = wallets.find(w => w.id === selectedWalletId);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer/Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-[3rem] shadow-2xl p-8 pb-12 sm:max-w-2xl sm:mx-auto sm:bottom-12 sm:rounded-[3rem] max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight">New Transaction</h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-all font-bold"
              >
                <X className="w-6 h-6 stroke-[3px]" />
              </button>
            </div>

            {/* Type Switcher */}
            <div className="flex p-1 bg-muted rounded-2xl mb-8 border border-border/50">
              <button
                onClick={() => setType("expense")}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  type === "expense" ? "bg-red-500 text-white shadow-lg shadow-red-200" : "text-muted-foreground"
                )}
              >
                Expense
              </button>
              <button
                onClick={() => setType("income")}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  type === "income" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "text-muted-foreground"
                )}
              >
                Income
              </button>
            </div>

            {/* Main Form */}
            <div className="flex flex-col gap-6">
              {/* Amount Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Amount</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground group-focus-within:text-primary transition-colors">Rp</span>
                  <input 
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-muted border-none text-3xl font-black tracking-tight focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Memo Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Memo (Optional)</label>
                <input 
                  type="text"
                  placeholder="What was this for?"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-8 py-4 rounded-2xl bg-muted border-none text-base font-bold tracking-tight focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              {/* Specific Field Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Wallet</label>
                  <select 
                    value={selectedWalletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-muted border-none font-bold text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.walletName}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Category</label>
                  <select 
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-muted border-none font-bold text-sm focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
                  >
                    {filteredCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "w-full mt-6 py-6 rounded-[2.5rem] bg-primary text-white text-xl font-black tracking-tight shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 group",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Recording..." : "Record Now"}
                {!isSubmitting && <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
