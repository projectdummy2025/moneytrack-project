"use client";

import React from "react";
import { ChevronLeft, Edit3, Trash2, Wallet as WalletIcon, Tag as TagIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency } from "@core/utils/HelperTool";

interface ManagementItemDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    subtitle: string;
    value?: string | number;
    type: "wallet" | "category";
    colorClass?: string;
    icon_name?: string;
  } | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ManagementItemDetail({
  isOpen,
  onClose,
  item,
  onEdit,
  onDelete,
}: ManagementItemDetailProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-background z-[100] flex flex-col font-['Urbanist',sans-serif]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-body font-bold text-foreground">Detail Details</h2>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center">
            {/* Massive Icon Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 border border-border/50 shadow-2xl shadow-black/5",
                item.colorClass || "bg-secondary text-primary"
              )}
            >
              {item.type === "wallet" ? (
                <WalletIcon className="w-12 h-12 stroke-[2px]" />
              ) : (
                <TagIcon className="w-12 h-12 stroke-[2px]" />
              )}
            </motion.div>

            {/* Title & Subtitle */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
                {item.title}
              </h1>
              <p className="text-body font-bold text-muted-foreground uppercase tracking-widest text-sm">
                {item.subtitle}
              </p>
            </motion.div>

            {/* Value Display (for wallets mostly) */}
            {item.value !== undefined && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-card w-full p-8 rounded-[32px] border border-border flex flex-col items-center mb-12"
              >
                <p className="text-meta-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Current Balance</p>
                <p className="text-4xl font-black text-foreground tracking-tighter">
                  {typeof item.value === 'number' ? formatCurrency(item.value) : item.value}
                </p>
              </motion.div>
            )}

            {/* Actions Section */}
            <div className="w-full flex flex-col gap-4 mt-auto max-w-sm">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onEdit}
                className="w-full h-16 rounded-2xl bg-accent text-white flex items-center justify-center gap-3 font-bold text-body shadow-lg shadow-accent/20 active:scale-95 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit {item.type === 'wallet' ? 'Wallet' : 'Category'}</span>
              </motion.button>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onDelete}
                className="w-full h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center gap-3 font-bold text-body border border-rose-500/20 active:scale-95 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete {item.type === 'wallet' ? 'Wallet' : 'Category'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
