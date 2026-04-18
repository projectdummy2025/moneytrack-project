"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Edit3,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@core/utils/HelperTool";
import { Transaction, Wallet, Category } from "@core/types/DataCore";

interface TraceLineProps {
  state: {
    groupedTransactions: [string, Transaction[]][];
    searchQuery: string;
    totals: { monthNet: number; transCount: number; totalIncome: number; totalExpense: number };
    isLoading: boolean;
    wallets: Wallet[];
    categories: Category[];
    filterWallet: string;
    filterCategory: string;
    filterDateFrom: string;
    filterDateTo: string;
    showFilters: boolean;
    hasActiveFilters: boolean;
    editingTransaction: { id: string; amount: string; memo: string; walletId: string; categoryId: string; transactedAt: string } | null;
    deleteConfirm: { id: string; memo: string } | null;
  };
  actions: {
    setSearchQuery: (val: string) => void;
    setFilterWallet: (val: string) => void;
    setFilterCategory: (val: string) => void;
    setFilterDateFrom: (val: string) => void;
    setFilterDateTo: (val: string) => void;
    setShowFilters: (val: boolean) => void;
    clearFilters: () => void;
    setEditingTransaction: (txn: { id: string; amount: string; memo: string; walletId: string; categoryId: string; transactedAt: string } | null) => void;
    handleUpdate: (data: { amount: string; memo: string; walletId?: string; categoryId?: string; transactedAt?: string }) => Promise<void>;
    setDeleteConfirm: (confirm: { id: string; memo: string } | null) => void;
    handleDelete: () => Promise<void>;
  };
}

export function TraceLine({ state, actions }: TraceLineProps) {
  if (state.isLoading) {
    return <div className="animate-pulse flex flex-col gap-8 px-1 font-['Urbanist',sans-serif]">
      <div className="h-14 bg-muted rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-muted rounded-3xl" />
        <div className="h-24 bg-muted rounded-3xl" />
      </div>
      {[1, 2].map(i => <div key={i} className="h-48 bg-muted rounded-3xl opacity-50" />)}
    </div>;
  }

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">
      {/* Search Bar */}
      <div className="relative group sticky top-0 z-40">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md -mx-4 px-4 pointer-events-none" />
        <div className="relative flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search history..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary border border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all outline-none text-body font-medium"
            />
          </div>
          <button
            onClick={() => actions.setShowFilters(!state.showFilters)}
            className={cn(
              "w-12 h-12 rounded-2xl border border-border/50 flex items-center justify-center transition-all relative",
              state.showFilters || state.hasActiveFilters
                ? "bg-accent/10 text-accent border-accent/30"
                : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent"
            )}
          >
            <Filter className="w-5 h-5" />
            {state.hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {state.showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl border border-border p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body font-bold text-foreground">Filters</h3>
              <button
                onClick={actions.clearFilters}
                className="text-meta-xs font-bold text-accent hover:underline uppercase tracking-wide"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Wallet Filter */}
              <div>
                <label className="text-meta-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">Wallet</label>
                <select
                  value={state.filterWallet}
                  onChange={(e) => actions.setFilterWallet(e.target.value)}
                  className="w-full h-[40px] bg-secondary border border-border/50 rounded-xl px-3 text-body-sm font-medium outline-none focus:border-accent transition-colors"
                >
                  <option value="">All Wallets</option>
                  {state.wallets.map(w => (
                    <option key={w.id} value={w.walletName}>{w.walletName}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-meta-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">Category</label>
                <select
                  value={state.filterCategory}
                  onChange={(e) => actions.setFilterCategory(e.target.value)}
                  className="w-full h-[40px] bg-secondary border border-border/50 rounded-xl px-3 text-body-sm font-medium outline-none focus:border-accent transition-colors"
                >
                  <option value="">All Categories</option>
                  {state.categories.map(c => (
                    <option key={c.id} value={c.categoryName}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="text-meta-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">From Date</label>
                <input
                  type="date"
                  value={state.filterDateFrom}
                  onChange={(e) => actions.setFilterDateFrom(e.target.value)}
                  className="w-full h-[40px] bg-secondary border border-border/50 rounded-xl px-3 text-body-sm font-medium outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="text-meta-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">To Date</label>
                <input
                  type="date"
                  value={state.filterDateTo}
                  onChange={(e) => actions.setFilterDateTo(e.target.value)}
                  className="w-full h-[40px] bg-secondary border border-border/50 rounded-xl px-3 text-body-sm font-medium outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm shadow-black/5 flex flex-col gap-1">
          <p className="text-meta-xs font-bold text-muted-foreground uppercase tracking-wider">Net Balance</p>
          <p className={cn(
            "text-display-md font-black tracking-tight",
            state.totals.monthNet >= 0 ? "text-emerald-600" : "text-rose-600"
          )}>
            {formatCurrency(state.totals.monthNet)}
          </p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm shadow-black/5 flex flex-col gap-1">
          <p className="text-meta-xs font-bold text-muted-foreground uppercase tracking-wider">Records</p>
          <p className="text-display-md font-black tracking-tight text-foreground">{state.totals.transCount}</p>
        </div>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-8 pb-20">
        {state.groupedTransactions.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-sm font-medium italic opacity-50">No transactions found</p>
          </div>
        ) : (
          state.groupedTransactions.map(([date, items], gIdx) => (
            <div key={date} className="flex flex-col gap-3">
              <div className="flex items-center px-1">
                <h3 className="text-meta-xs font-semibold text-muted-foreground uppercase">
                  {date}
                </h3>
              </div>

              <div className="flex flex-col bg-card rounded-2xl border border-border divide-y divide-border/50 shadow-sm shadow-black/5 overflow-hidden">
                {items.map((item, iIdx) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    delay={(gIdx * 0.04) + (iIdx * 0.02)}
                    onEdit={() => {
                      const wallet = state.wallets.find(w => w.walletName === item.walletName);
                      const category = state.categories.find(c => c.categoryName === item.categoryName);
                      actions.setEditingTransaction({
                        id: item.id,
                        amount: item.amount,
                        memo: item.memo || "",
                        walletId: wallet?.id || "",
                        categoryId: category?.id || "",
                        transactedAt: item.transactedAt,
                      });
                    }}
                    onDelete={() => actions.setDeleteConfirm({ id: item.id, memo: item.memo || item.categoryName || "Transaction" })}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <EditTransactionDialog
        isOpen={!!state.editingTransaction}
        onClose={() => actions.setEditingTransaction(null)}
        onUpdate={actions.handleUpdate}
        transaction={state.editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTransactionDialog
        isOpen={!!state.deleteConfirm}
        onClose={() => actions.setDeleteConfirm(null)}
        onConfirm={actions.handleDelete}
        item={state.deleteConfirm}
      />
    </div>
  );
}

function HistoryItem({
  item,
  delay,
  onEdit,
  onDelete,
}: {
  item: Transaction;
  delay: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="flex items-center gap-4 p-4 cursor-pointer transition-colors group relative"
    >
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
        item.classification === 'income'
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
          : "bg-secondary text-primary border border-border/50"
      )}>
        {item.classification === 'income' ? (
          <ArrowUpRight className="w-5 h-5 stroke-[2px]" />
        ) : (
          <ArrowDownLeft className="w-5 h-5 stroke-[2px]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-body-sm font-bold tracking-tight truncate text-foreground">
          {item.memo || item.categoryName}
        </h4>
        <p className="text-meta-xs font-medium text-muted-foreground mt-0.5">
          {item.categoryName} • {new Date(item.transactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="text-right">
        <p className={cn(
          "text-body-sm font-bold tracking-tight",
          item.classification === 'income' ? 'text-emerald-600' : 'text-rose-600'
        )}>
          {formatCurrency(item.amount)}
        </p>
      </div>

      {/* Absolute positioning ensures the buttons don't push the amount to the left, keeping margins balanced */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all bg-card/60 backdrop-blur-sm pl-4 pr-1 py-1 rounded-xl">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-primary flex items-center justify-center transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-rose-500 flex items-center justify-center transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function EditTransactionDialog({
  isOpen,
  onClose,
  onUpdate,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { amount: string; memo: string; walletId?: string; categoryId?: string; transactedAt?: string }) => Promise<void>;
  transaction: { id: string; amount: string; memo: string; walletId: string; categoryId: string; transactedAt: string } | null;
}) {
  const [amount, setAmount] = useState(transaction?.amount || "");
  const [memo, setMemo] = useState(transaction?.memo || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setMemo(transaction.memo || "");
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setIsSubmitting(true);
    try {
      await onUpdate({ amount, memo });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-extrabold text-foreground">Edit Transaction</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-[48px] bg-secondary border border-border rounded-xl px-4 outline-none focus:border-accent transition-colors text-body-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">Note</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full h-[48px] bg-secondary border border-border rounded-xl px-4 outline-none focus:border-accent transition-colors text-body-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !amount}
                className="w-full h-[48px] rounded-xl bg-foreground text-white text-body-sm font-bold flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Transaction"
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DeleteTransactionDialog({
  isOpen,
  onClose,
  onConfirm,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: { id: string; memo: string } | null;
}) {
  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-heading font-extrabold text-foreground">Delete Transaction?</h2>
              <p className="text-body-sm font-medium text-muted-foreground mt-2">
                Are you sure you want to delete &quot;{item.memo}&quot;? The wallet balance will be restored.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-[48px] rounded-xl bg-secondary text-foreground text-body-sm font-bold flex items-center justify-center transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 h-[48px] rounded-xl bg-rose-500 text-white text-body-sm font-bold flex items-center justify-center transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
