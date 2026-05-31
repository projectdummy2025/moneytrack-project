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
      <div className="relative sticky top-0 z-40 py-2">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg -mx-4 px-4 border-b border-border/10 pointer-events-none" />
        <div className="relative flex gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-accent group-focus-within:scale-110 transition-all duration-300" />
            <input
              type="text"
              placeholder="Search history..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/60 hover:bg-secondary/80 focus:bg-card border border-border/40 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all duration-300 outline-none text-body font-semibold tracking-tight shadow-sm focus:shadow-[0_4px_20px_rgba(53,194,193,0.08)]"
            />
          </div>
          <button
            onClick={() => actions.setShowFilters(!state.showFilters)}
            className={cn(
              "relative w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm",
              state.showFilters || state.hasActiveFilters
                ? "bg-gradient-to-tr from-[#35C2C1] to-[#4dd4d3] text-white border-transparent shadow-[#35C2C1]/20"
                : "bg-secondary/60 hover:bg-secondary/80 text-muted-foreground border-border/40 hover:text-foreground"
            )}
          >
            <Filter className="w-5 h-5 transition-transform duration-300" />
            {state.hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
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
        onDeleteRequest={() => {
          if (state.editingTransaction) {
            actions.setEditingTransaction(null);
            actions.setDeleteConfirm({ id: state.editingTransaction.id, memo: state.editingTransaction.memo || "Transaction" });
          }
        }}
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
      whileTap={{ scale: 0.98, backgroundColor: "rgba(0,0,0,0.03)" }}
      onClick={onEdit}
      className="flex items-center gap-4 p-4 cursor-pointer transition-colors relative"
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
          {item.memo ? `${item.categoryName} • ` : ""}{new Date(item.transactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

    </motion.div>
  );
}

function EditTransactionDialog({
  isOpen,
  onClose,
  onUpdate,
  transaction,
  onDeleteRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { amount: string; memo: string; walletId?: string; categoryId?: string; transactedAt?: string }) => Promise<void>;
  transaction: { id: string; amount: string; memo: string; walletId: string; categoryId: string; transactedAt: string } | null;
  onDeleteRequest: () => void;
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
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 w-full h-full bg-background z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-6">
            <button 
              type="button"
              onClick={onClose} 
              className="w-10 h-10 rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 active:scale-95 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body-lg font-extrabold text-foreground tracking-tight">Edit Transaction</h2>
            <div className="w-10 h-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between px-6 pb-6">
            <div className="flex flex-col gap-8 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-meta-xs font-bold text-muted-foreground uppercase tracking-widest">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pb-2 text-heading-lg font-bold bg-transparent border-b border-border outline-none focus:border-accent transition-all placeholder:text-muted-foreground/30 rounded-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-meta-xs font-bold text-muted-foreground uppercase tracking-widest">Note</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Lunch"
                  className="w-full pb-2 text-body-lg font-bold bg-transparent border-b border-border outline-none focus:border-accent transition-all placeholder:text-muted-foreground/30 rounded-none"
                />
              </div>

              <button
                type="button"
                onClick={onDeleteRequest}
                className="flex items-center gap-2 self-start mt-4 px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-body-sm active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete This Record</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full h-[56px] rounded-2xl bg-foreground text-background text-body font-extrabold flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50 mt-auto safe-bottom"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Transaction"
              )}
            </button>
          </form>
        </motion.div>
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
