"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Loader2,
  Trash2,
  PieChart as PieIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@core/utils/HelperTool";
import { Transaction, Wallet, Category } from "@core/types/DataCore";

// ─── Prop types matching useReportsCore output ────────────────────────────────

interface CategoryData {
  name: string;
  value: number;
  color: string;
  count: number;
  percentage: number;
}

interface ReportsViewProps {
  state: {
    isLoading: boolean;
    monthDisplayName: string;
    chartStats: {
      totalIncome: number;
      totalExpense: number;
      netSavings: number;
      categoryData: CategoryData[];
    };
    groupedTransactions: [string, Transaction[]][];
    listTotals: { monthNet: number; transactionCount: number };
    searchQuery: string;
    filterWallet: string;
    filterCategory: string;
    showFilters: boolean;
    hasActiveFilters: boolean;
    wallets: Wallet[];
    categories: Category[];
    editingTransaction: {
      id: string; amount: string; memo: string;
      walletId: string; categoryId: string; transactedAt: string;
    } | null;
    deleteConfirm: { id: string; memo: string } | null;
  };
  actions: {
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
    setSearchQuery: (value: string) => void;
    setFilterWallet: (value: string) => void;
    setFilterCategory: (value: string) => void;
    setShowFilters: (value: boolean) => void;
    clearFilters: () => void;
    setEditingTransaction: (transaction: {
      id: string; amount: string; memo: string;
      walletId: string; categoryId: string; transactedAt: string;
    } | null) => void;
    handleUpdateTransaction: (data: {
      amount: string; memo: string;
      walletId?: string; categoryId?: string; transactedAt?: string;
    }) => Promise<void>;
    setDeleteConfirm: (confirm: { id: string; memo: string } | null) => void;
    handleDeleteTransaction: () => Promise<void>;
  };
}

// ─── Main component ────────────────────────────────────────────────────────────

type MainTab = "recap" | "history";
type HistoryTab = "all" | "income" | "expense";

export function ReportsView({ state, actions }: ReportsViewProps) {
  const [activePieIndex, setActivePieIndex] = useState(-1);
  const [mainTab, setMainTab] = useState<MainTab>("recap");
  const [historyTab, setHistoryTab] = useState<HistoryTab>("all");

  if (state.isLoading) return <LoadingSkeleton />;

  const { totalIncome, totalExpense, netSavings, categoryData } = state.chartStats;
  const hasCategoryData = categoryData.length > 0;

  const filteredGroupedTransactions = historyTab === "all"
    ? state.groupedTransactions
    : state.groupedTransactions
        .map(([dateLabel, items]) => [
          dateLabel,
          items.filter((tx) =>
            historyTab === "income"
              ? tx.classification === "income"
              : tx.classification !== "income"
          ),
        ] as [string, Transaction[]])
        .filter(([, items]) => items.length > 0);

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif] pb-28">

      {/* ── Section 1: Month Selector ───────────────────────────────────────── */}
      <MonthSelector
        monthDisplayName={state.monthDisplayName}
        onPrev={actions.goToPrevMonth}
        onNext={actions.goToNextMonth}
      />

      {/* ── Section 2: Main Tab — Recap / History ──────────────────────────── */}
      <div className="flex gap-2 p-1 bg-secondary rounded-2xl">
        {(["recap", "history"] as MainTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all",
              mainTab === tab
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Recap ─────────────────────────────────────────────────────── */}
      {mainTab === "recap" && (
        <div className="flex flex-col gap-8">

      {/* ── Summary Cards — Income / Expense / Savings ──────────── */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Income"  value={totalIncome}  icon={TrendingUp}   colorClass="text-white bg-[#35C2C1]" />
        <SummaryCard label="Expense" value={totalExpense} icon={TrendingDown}  colorClass="text-white bg-rose-500" />
        <SummaryCard label="Savings" value={netSavings}   icon={Target}        colorClass="text-white bg-blue-500" />
      </div>

      {/* ── Section 3: Pie Chart — Expense Distribution ────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">
              Expense Distribution
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">
              Monthly Breakdown
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/50">
            <PieIcon className="w-5 h-5 text-accent" />
          </div>
        </div>

        {!hasCategoryData ? (
          // Empty state when no expense transactions recorded
          <div className="h-[220px] flex flex-col items-center justify-center text-muted-foreground gap-3">
            <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center border border-border rotate-12">
              <TrendingDown className="w-8 h-8 opacity-20 -rotate-12" />
            </div>
            <p className="text-body-sm font-medium opacity-60">No expenses this month</p>
          </div>
        ) : (
          // Donut chart with hoverable slices
          <div className="h-[260px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={95}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationBegin={0}
                  animationDuration={1000}
                  stroke="none"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(-1)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className={cn(
                        "transition-opacity cursor-pointer outline-none",
                        activePieIndex === -1 || activePieIndex === index
                          ? "opacity-100"
                          : "opacity-30"
                      )}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center info — shows total or hovered category */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-[170px]">
              <AnimatePresence mode="wait">
                {activePieIndex === -1 ? (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-1">
                      Total Spent
                    </p>
                    <p className="text-[26px] font-black tracking-tighter text-foreground leading-none">
                      {formatCurrency(totalExpense)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="category"
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryData[activePieIndex].color }}
                    />
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wide line-clamp-1">
                      {categoryData[activePieIndex].name}
                    </p>
                    <p className="text-[22px] font-black tracking-tighter text-foreground leading-none">
                      {formatCurrency(categoryData[activePieIndex].value)}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      {Math.round(categoryData[activePieIndex].percentage)}% of total
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 4: Category Breakdown List ─────────────────────────────── */}
      {hasCategoryData && (
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">
              Categories
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">
              Monthly Distribution
            </p>
          </div>
          {categoryData.map((category) => (
            <div
              key={category.name}
              className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center justify-between"
            >
              {/* Color dot + name + transaction count */}
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="text-body-sm font-bold text-foreground">{category.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    {category.count} {category.count === 1 ? "transaction" : "transactions"}
                  </p>
                </div>
              </div>
              {/* Spending amount + percentage bar */}
              <div className="text-right">
                <p className="text-body font-bold tracking-tighter text-foreground">
                  {formatCurrency(category.value)}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground/60">
                  {Math.round(category.percentage)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

        </div>
      )}

      {/* ── Tab: History ───────────────────────────────────────────────────── */}
      {mainTab === "history" && (
        <div className="flex flex-col gap-6">

      {/* ── Search Bar + Filter Toggle ──────────────────────────── */}
      <div className="flex gap-3 sticky top-0 z-40">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md -mx-4 pointer-events-none" />

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={state.searchQuery}
            onChange={(event) => actions.setSearchQuery(event.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary border border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all outline-none text-body font-medium"
          />
        </div>

        <button
          onClick={() => actions.setShowFilters(!state.showFilters)}
          className={cn(
            "relative w-12 h-12 rounded-2xl border border-border/50 flex items-center justify-center transition-all",
            state.showFilters || state.hasActiveFilters
              ? "bg-accent/10 text-accent border-accent/30"
              : "bg-secondary text-muted-foreground"
          )}
        >
          <Filter className="w-5 h-5" />
          {state.hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
          )}
        </button>
      </div>

      {/* ── Collapsible Filter Panel ────────────────────────────── */}
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
              <div>
                <label className="text-meta-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">
                  Wallet
                </label>
                <select
                  value={state.filterWallet}
                  onChange={(event) => actions.setFilterWallet(event.target.value)}
                  className="w-full h-[40px] bg-secondary border border-border/50 rounded-xl px-3 text-body-sm font-medium outline-none focus:border-accent transition-colors"
                >
                  <option value="">All Wallets</option>
                  {state.wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.walletName}>
                      {wallet.walletName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-meta-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">
                  Category
                </label>
                <select
                  value={state.filterCategory}
                  onChange={(event) => actions.setFilterCategory(event.target.value)}
                  className="w-full h-[40px] bg-secondary border border-border/50 rounded-xl px-3 text-body-sm font-medium outline-none focus:border-accent transition-colors"
                >
                  <option value="">All Categories</option>
                  {state.categories.map((category) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── History Sub-Tabs: All / Income / Expense ───────────── */}
      <div className="flex gap-2 p-1 bg-secondary rounded-2xl">
        {(["all", "income", "expense"] as HistoryTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setHistoryTab(tab)}
            className={cn(
              "flex-1 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
              historyTab === tab
                ? tab === "income"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : tab === "expense"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Transaction List Grouped by Date ───────────────────── */}
      <div className="flex flex-col gap-6">
        {filteredGroupedTransactions.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-body-sm font-medium italic opacity-50">
              No transactions found
            </p>
          </div>
        ) : (
          filteredGroupedTransactions.map(([dateLabel, items], groupIndex) => (
            <div key={dateLabel} className="flex flex-col gap-2">
              <p className="text-meta-xs font-semibold text-muted-foreground uppercase px-1">
                {dateLabel}
              </p>

              <div className="flex flex-col bg-card rounded-2xl border border-border divide-y divide-border/50 shadow-sm overflow-hidden">
                {items.map((transaction, itemIndex) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    animationDelay={groupIndex * 0.04 + itemIndex * 0.02}
                    onEdit={() => {
                      const matchedWallet = state.wallets.find(
                        (wallet) => wallet.walletName === transaction.walletName
                      );
                      const matchedCategory = state.categories.find(
                        (category) => category.categoryName === transaction.categoryName
                      );
                      actions.setEditingTransaction({
                        id: transaction.id,
                        amount: transaction.amount,
                        memo: transaction.memo || "",
                        walletId: matchedWallet?.id || "",
                        categoryId: matchedCategory?.id || "",
                        transactedAt: transaction.transactedAt,
                      });
                    }}
                    onDelete={() =>
                      actions.setDeleteConfirm({
                        id: transaction.id,
                        memo: transaction.memo || transaction.categoryName || "Transaction",
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

        </div>
      )}

      {/* ── Dialogs ────────────────────────────────────────────────────────── */}
      <EditTransactionDialog
        isOpen={!!state.editingTransaction}
        transaction={state.editingTransaction}
        onClose={() => actions.setEditingTransaction(null)}
        onUpdate={actions.handleUpdateTransaction}
        onDeleteRequest={() => {
          if (state.editingTransaction) {
            actions.setEditingTransaction(null);
            actions.setDeleteConfirm({
              id: state.editingTransaction.id,
              memo: state.editingTransaction.memo || "Transaction",
            });
          }
        }}
      />

      <DeleteConfirmDialog
        isOpen={!!state.deleteConfirm}
        deleteTarget={state.deleteConfirm}
        onClose={() => actions.setDeleteConfirm(null)}
        onConfirm={actions.handleDeleteTransaction}
      />
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

// Shows prev/next arrows and the current month name
function MonthSelector({
  monthDisplayName,
  onPrev,
  onNext,
}: {
  monthDisplayName: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center justify-between">
      <button
        onClick={onPrev}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] leading-none mb-1.5">
          Reporting Period
        </span>
        <h2 className="text-body-lg font-bold text-foreground leading-none capitalize">
          {monthDisplayName}
        </h2>
      </div>

      <button
        onClick={onNext}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// One of the three metric cards: Income, Expense, or Savings
function SummaryCard({
  label,
  value,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <div className="bg-card rounded-3xl p-4 border border-border flex flex-col gap-3 shadow-sm relative overflow-hidden">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-meta-2xs font-semibold uppercase text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-body-sm font-bold tracking-tighter text-foreground truncate">
          {formatCurrency(Math.abs(value))}
        </p>
      </div>
    </div>
  );
}

// A single row in the transaction history list
function TransactionItem({
  transaction,
  animationDelay,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  animationDelay: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isIncome = transaction.classification === "income";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: animationDelay }}
      onClick={onEdit}
      className="flex items-center gap-4 p-4 cursor-pointer active:bg-secondary/50 transition-colors"
    >
      {/* Direction icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
          isIncome
            ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
            : "bg-secondary text-primary border border-border/50"
        )}
      >
        {isIncome ? (
          <ArrowUpRight className="w-5 h-5 stroke-[2px]" />
        ) : (
          <ArrowDownLeft className="w-5 h-5 stroke-[2px]" />
        )}
      </div>

      {/* Memo and category info */}
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-bold tracking-tight truncate text-foreground">
          {transaction.memo || transaction.categoryName}
        </p>
        <p className="text-meta-xs font-medium text-muted-foreground mt-0.5">
          {transaction.categoryName} •{" "}
          {new Date(transaction.transactedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Amount colored by income/expense */}
      <p
        className={cn(
          "text-body-sm font-bold tracking-tight shrink-0",
          isIncome ? "text-emerald-600" : "text-rose-600"
        )}
      >
        {formatCurrency(transaction.amount)}
      </p>
    </motion.div>
  );
}

// Full-screen slide-up dialog for editing a transaction
function EditTransactionDialog({
  isOpen,
  transaction,
  onClose,
  onUpdate,
  onDeleteRequest,
}: {
  isOpen: boolean;
  transaction: { id: string; amount: string; memo: string } | null;
  onClose: () => void;
  onUpdate: (data: { amount: string; memo: string }) => Promise<void>;
  onDeleteRequest: () => void;
}) {
  const [amount, setAmount] = useState(transaction?.amount || "");
  const [memo, setMemo] = useState(transaction?.memo || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync fields whenever a different transaction is opened for editing
  React.useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setMemo(transaction.memo || "");
    }
  }, [transaction]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount) return;
    setIsSubmitting(true);
    try {
      await onUpdate({ amount, memo });
      onClose();
    } catch (error) {
      console.error(error);
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
          {/* Header row with close button and title */}
          <div className="flex items-center justify-between p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-secondary text-foreground flex items-center justify-center active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body-lg font-extrabold text-foreground tracking-tight">
              Edit Transaction
            </h2>
            <div className="w-10 h-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between px-6 pb-6">
            <div className="flex flex-col gap-8 mt-4">
              {/* Amount field */}
              <div className="flex flex-col gap-2">
                <label className="text-meta-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className="w-full pb-2 text-heading-lg font-bold bg-transparent border-b border-border outline-none focus:border-accent transition-all placeholder:text-muted-foreground/30 rounded-none"
                  required
                />
              </div>

              {/* Memo / note field */}
              <div className="flex flex-col gap-2">
                <label className="text-meta-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Note
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  placeholder="e.g. Lunch"
                  className="w-full pb-2 text-body-lg font-bold bg-transparent border-b border-border outline-none focus:border-accent transition-all placeholder:text-muted-foreground/30 rounded-none"
                />
              </div>

              {/* Delete button — triggers confirmation dialog */}
              <button
                type="button"
                onClick={onDeleteRequest}
                className="flex items-center gap-2 self-start mt-4 px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-body-sm active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete This Record</span>
              </button>
            </div>

            {/* Save button at the bottom */}
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full h-[56px] rounded-2xl bg-foreground text-background text-body font-extrabold flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50 mt-auto"
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

// Centered modal overlay asking user to confirm deletion
function DeleteConfirmDialog({
  isOpen,
  deleteTarget,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  deleteTarget: { id: string; memo: string } | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <AnimatePresence>
      {isOpen && deleteTarget && (
        <>
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Confirmation card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-background rounded-2xl shadow-xl z-50 p-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-heading font-extrabold text-foreground">
                Delete Transaction?
              </h2>
              <p className="text-body-sm font-medium text-muted-foreground mt-2">
                Are you sure you want to delete &quot;{deleteTarget.memo}&quot;?
                The wallet balance will be restored.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-[48px] rounded-xl bg-secondary text-foreground text-body-sm font-bold flex items-center justify-center active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 h-[48px] rounded-xl bg-rose-500 text-white text-body-sm font-bold flex items-center justify-center active:scale-95 transition-all"
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

// Animated skeleton shown while data is loading
function LoadingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8 font-['Urbanist',sans-serif]">
      <div className="h-14 bg-muted rounded-2xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-24 bg-muted rounded-3xl" />
        <div className="h-24 bg-muted rounded-3xl" />
        <div className="h-24 bg-muted rounded-3xl" />
      </div>
      <div className="h-[260px] bg-muted rounded-3xl" />
      {[1, 2].map((index) => (
        <div key={index} className="h-32 bg-muted rounded-2xl opacity-60" />
      ))}
    </div>
  );
}
