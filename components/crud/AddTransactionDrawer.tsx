"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Wallet, Tag, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AddTransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionDrawer({ isOpen, onClose }: AddTransactionDrawerProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");

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
            className="fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-[3rem] shadow-2xl p-8 pb-12 sm:max-w-2xl sm:mx-auto sm:bottom-12 sm:rounded-[3rem]"
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

              {/* Specific Field Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <SelectButton icon={Wallet} label="Source Wallet" value="Bank BCA" />
                <SelectButton icon={Tag} label="Category" value="Food & Drink" />
                <SelectButton icon={CalendarIcon} label="Date" value="Today, 04 April" />
              </div>

              {/* Submit Button */}
              <button 
                onClick={onClose}
                className="w-full mt-6 py-6 rounded-[2.5rem] bg-primary text-white text-xl font-black tracking-tight shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Record Now
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SelectButton({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <button className="flex flex-col items-start gap-1 p-5 rounded-[2rem] bg-muted hover:bg-muted/80 transition-all text-left border border-transparent hover:border-primary/20 group">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-bold text-base tracking-tight truncate w-full">{value}</p>
    </button>
  );
}
