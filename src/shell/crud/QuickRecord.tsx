"use client";
 
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ArrowUpRight, TrendingUp, TrendingDown, Target } from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { Wallet, Category } from "@core/types/DataCore";
import { RecordType } from "@core/hooks/RecordCore";
import { useWallets } from "@core/hooks/WalletVault";
import { useCategories } from "@core/hooks/TagMap";
 
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
  
  // Custom hooks for inline creation
  const { createWallet } = useWallets();
  const { createCategory } = useCategories();
 
  // Inline Wallet Creation State
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletType, setNewWalletType] = useState("Cash");
  const [isWalletSubmitting, setIsWalletSubmitting] = useState(false);
  const [walletError, setWalletError] = useState("");
 
  // Inline Category Creation State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState("");
 
  const handleInlineCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) return;
    setIsWalletSubmitting(true);
    setWalletError("");
    try {
      const created = await createWallet(newWalletName, newWalletType);
      if (created && created.id) {
        actions.setSelectedWalletId(created.id);
      }
      setNewWalletName("");
      setIsAddingWallet(false);
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : "Failed to create wallet");
    } finally {
      setIsWalletSubmitting(false);
    }
  };
 
  const handleInlineCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsCategorySubmitting(true);
    setCategoryError("");
    try {
      // Classification matches current drawer transaction type (expense or income)
      const classification = state.type === "income" ? "income" : "expense";
      // Pick a default color or random pastel color
      const defaultColors = ["#35C2C1", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
      const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];
      
      const created = await createCategory(
        newCategoryName, 
        classification, 
        state.type === "income" ? "salary" : "shopping", 
        randomColor
      );
      if (created && created.id) {
        actions.setSelectedCategoryId(created.id);
      }
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsCategorySubmitting(false);
    }
  };
 
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />
 
          {/* Main Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[70] bg-[#162424] rounded-t-[2rem] flex flex-col h-[88vh] w-full max-w-[430px] overflow-hidden font-['Urbanist',sans-serif] border-t border-white/5 shadow-2xl"
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 shrink-0">
              <div className="bg-white/10 h-[4px] rounded-full w-[45px]" />
            </div>
 
            {/* Header Title */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0">
              <h2 className="text-heading-lg font-black text-white tracking-tight">Add Record</h2>
              <button
                onClick={onClose}
                className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-white/5 active:scale-90 transition-transform"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
 
            {/* Segmented Tab Switcher (Modern Underlined Slider Style) */}
            <div className="flex px-5 mt-2 shrink-0 border-b border-white/5 relative">
              {(["expense", "income", "swap"] as const).map((tab) => {
                const isActive = state.type === tab;
                const tabColor = tab === "expense" ? "#ef4444" : tab === "income" ? "#35C2C1" : "#3b82f6";
                return (
                  <button
                    key={tab}
                    onClick={() => actions.setType(tab)}
                    className="flex-1 py-3 text-meta font-black uppercase tracking-[0.16em] relative z-10 transition-colors cursor-pointer text-center"
                    style={{ color: isActive ? tabColor : "rgba(255,255,255,0.4)" }}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        layoutId="activeRecordTabBg"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px]"
                        style={{ backgroundColor: tabColor }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
 
            {/* Amount input Display */}
            <div className="shrink-0 px-5 pb-5 pt-4 text-center select-none">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.18em] mb-1">
                {state.type} amount
              </p>
              <div className="flex items-center justify-center gap-1.5">
                {state.type === "expense" && <span className="text-rose-500 text-display-xl font-black">-</span>}
                <input
                  type="number"
                  placeholder="0"
                  value={state.amount}
                  onChange={(e) => actions.setAmount(e.target.value)}
                  className={cn(
                    "bg-transparent text-center text-display-xl font-black outline-none w-full max-w-[280px] tracking-tighter rounded-none",
                    state.type === "expense" ? "text-rose-500" : state.type === "income" ? "text-[#35C2C1]" : "text-blue-500"
                  )}
                  autoFocus
                />
              </div>
            </div>
 
            <div className="bg-white/5 h-px w-full shrink-0" />
 
            {/* Scrollable form fields */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-[#162424] scrollbar-hide pb-6">
              {state.error && (
                <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-meta-xs font-black text-center uppercase tracking-wider">
                  {state.error}
                </div>
              )}
 
              {/* Account Selection */}
              <div className="flex flex-col gap-3.5 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.16em]">
                    {isSwap ? "Source Account" : "Account"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddingWallet(true)}
                    className="text-[9px] font-black text-[#35C2C1] uppercase tracking-[0.16em] active:scale-95 transition-transform cursor-pointer"
                  >
                    + New Wallet
                  </button>
                </div>
                
                {/* Horizontal Scroll Grid of Accounts */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1.5 flex-nowrap -mx-1 px-1">
                  {state.wallets.map((wallet) => {
                    const isSelected = state.selectedWalletId === wallet.id;
                    return (
                      <button
                        key={wallet.id}
                        onClick={() => actions.setSelectedWalletId(wallet.id)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap text-meta font-extrabold uppercase tracking-wider active:scale-95 cursor-pointer shrink-0",
                          isSelected
                            ? "bg-[#35C2C1]/15 border-[#35C2C1] text-[#35C2C1] font-black shadow-sm"
                            : "bg-white/5 border-transparent text-white/40 hover:text-white/60"
                        )}
                      >
                        {wallet.walletName}
                      </button>
                    );
                  })}
                </div>
              </div>
 
              {isSwap && (
                <>
                  <div className="bg-white/5 h-px w-full" />
                  {/* Destination Account Selection */}
                  <div className="flex flex-col gap-3.5 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.16em]">Destination Account</p>
                      <button
                        type="button"
                        onClick={() => setIsAddingWallet(true)}
                        className="text-[9px] font-black text-[#35C2C1] uppercase tracking-[0.16em] active:scale-95 transition-transform cursor-pointer"
                      >
                        + New Wallet
                      </button>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1.5 flex-nowrap -mx-1 px-1">
                      {state.wallets.map((wallet) => {
                        const isSelected = state.targetWalletId === wallet.id;
                        return (
                          <button
                            key={wallet.id}
                            onClick={() => actions.setTargetWalletId(wallet.id)}
                            className={cn(
                              "px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap text-meta font-extrabold uppercase tracking-wider active:scale-95 cursor-pointer shrink-0",
                              isSelected
                                ? "bg-blue-500/15 border-blue-500 text-blue-400 font-black shadow-sm"
                                : "bg-white/5 border-transparent text-white/40 hover:text-white/60"
                            )}
                          >
                            {wallet.walletName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
 
              {!isSwap && (
                <>
                  <div className="bg-white/5 h-px w-full" />
                  {/* Category Selection */}
                  <div className="flex flex-col gap-3.5 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.16em]">Category</p>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        className="text-[9px] font-black text-[#35C2C1] uppercase tracking-[0.16em] active:scale-95 transition-transform cursor-pointer"
                      >
                        + New Category
                      </button>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1.5 flex-nowrap -mx-1 px-1">
                      {state.filteredCategories.map((cat) => {
                        const isSelected = state.selectedCategoryId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => actions.setSelectedCategoryId(cat.id)}
                            className={cn(
                              "px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap text-meta font-extrabold uppercase tracking-wider active:scale-95 cursor-pointer shrink-0",
                              isSelected
                                ? "bg-[#35C2C1]/15 border-[#35C2C1] text-[#35C2C1] font-black shadow-sm"
                                : "bg-white/5 border-transparent text-white/40 hover:text-white/60"
                            )}
                          >
                            {cat.categoryName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
 
              <div className="bg-white/5 h-px w-full" />
 
              {/* Notes */}
              <div className="p-5 flex flex-col gap-3">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.16em]">Notes</p>
                <textarea
                  placeholder="What was this for?..."
                  value={state.memo}
                  onChange={(e) => actions.setMemo(e.target.value)}
                  className="w-full bg-white/5 rounded-2xl p-4 text-body font-bold text-white/80 outline-none resize-none h-24 border border-white/5 focus:border-[#35C2C1]/30 transition-all placeholder:text-white/20"
                />
              </div>
            </div>
 
            {/* Add Record Button */}
            <div className="shrink-0 px-5 pb-[40px] pt-4 bg-[#162424] border-t border-white/5">
              <button
                onClick={actions.handleSubmit}
                disabled={state.isSubmitting || !state.amount || !state.selectedWalletId || (!isSwap && !state.selectedCategoryId) || (isSwap && !state.targetWalletId)}
                className={cn(
                  "w-full bg-[#35C2C1] h-14 rounded-2xl flex items-center justify-center active:scale-[0.97] transition-all shadow-lg shadow-[#35C2C1]/20 cursor-pointer text-white",
                  (state.isSubmitting || !state.amount) && "opacity-50 grayscale cursor-not-allowed"
                )}
              >
                <p className="text-meta font-black uppercase tracking-[0.18em]">
                  {state.isSubmitting ? "Processing..." : isSwap ? "Confirm Swap" : "Record " + state.type}
                </p>
              </button>
            </div>
          </motion.div>
 
          {/* Inline Wallet Creation Modal */}
          <AnimatePresence>
            {isAddingWallet && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAddingWallet(false)}
                  className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-[1px]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-[360px] bg-[#1a2d2d] rounded-3xl border border-white/5 shadow-2xl p-6 font-['Urbanist',sans-serif]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-body font-black text-white uppercase tracking-wider">New Wallet</h3>
                    <button
                      onClick={() => setIsAddingWallet(false)}
                      className="text-white/50 hover:text-white cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleInlineCreateWallet} className="flex flex-col gap-4">
                    {walletError && (
                      <p className="text-rose-400 text-meta-xs font-black uppercase text-center bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">{walletError}</p>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Wallet Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Bank BCA"
                        value={newWalletName}
                        onChange={(e) => setNewWalletName(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-body font-bold text-white outline-none focus:border-[#35C2C1]/30"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Wallet Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Cash", "Bank", "E-Wallet"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewWalletType(type)}
                            className={cn(
                              "py-2 rounded-xl text-meta-xs font-black uppercase tracking-wider border active:scale-95 transition-all cursor-pointer",
                              newWalletType === type
                                ? "bg-[#35C2C1]/15 border-[#35C2C1] text-[#35C2C1]"
                                : "bg-white/5 border-transparent text-white/40"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isWalletSubmitting || !newWalletName.trim()}
                      className="w-full h-12 bg-[#35C2C1] rounded-xl text-meta font-black uppercase tracking-[0.16em] active:scale-[0.97] transition-all text-white mt-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isWalletSubmitting ? "Creating..." : "Create Wallet"}
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
 
          {/* Inline Category Creation Modal */}
          <AnimatePresence>
            {isAddingCategory && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAddingCategory(false)}
                  className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-[1px]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-[360px] bg-[#1a2d2d] rounded-3xl border border-white/5 shadow-2xl p-6 font-['Urbanist',sans-serif]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-body font-black text-white uppercase tracking-wider">New Category</h3>
                    <button
                      onClick={() => setIsAddingCategory(false)}
                      className="text-white/50 hover:text-white cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleInlineCreateCategory} className="flex flex-col gap-4">
                    {categoryError && (
                      <p className="text-rose-400 text-meta-xs font-black uppercase text-center bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">{categoryError}</p>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Category Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Coffee / Salary"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-body font-bold text-white outline-none focus:border-[#35C2C1]/30"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">
                        Classification: {state.type === "income" ? "INCOME ONLY" : "EXPENSE ONLY"}
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isCategorySubmitting || !newCategoryName.trim()}
                      className="w-full h-12 bg-[#35C2C1] rounded-xl text-meta font-black uppercase tracking-[0.16em] active:scale-[0.97] transition-all text-white mt-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isCategorySubmitting ? "Creating..." : "Create Category"}
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
