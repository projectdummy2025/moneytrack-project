"use client";

import React, { useState } from "react";
import { Plus, X, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@core/utils/HelperTool";
import { MasterRegistry } from "./MasterRegistry";
import { ManagementItemDetail } from "./ManagementItemDetail";

interface WalletItem {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  color?: string;
}

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon_name?: string;
  color?: string;
}

interface StatusHubProps {
  state: {
    activeTab: "wallets" | "categories";
    walletItems: WalletItem[];
    categoryItems: CategoryItem[];
    isLoading: boolean;
    itemCount: number;
    isAddWalletOpen: boolean;
    isAddCategoryOpen: boolean;
    isCreatingWallet: boolean;
    isCreatingCategory: boolean;
    editingWallet: { id: string; name: string; type: string } | null;
    editingCategory: { id: string; name: string; classification: "income" | "expense"; icon?: string; color?: string } | null;
    deleteConfirm: { type: "wallet" | "category"; id: string; name: string } | null;
    selectedItem: { type: "wallet" | "category"; id: string } | null;
  };
  actions: {
    setActiveTab: (tab: "wallets" | "categories") => void;
    setIsAddWalletOpen: (open: boolean) => void;
    setIsAddCategoryOpen: (open: boolean) => void;
    handleAddClick: () => void;
    createWallet: (name: string, type: string, currencyCode?: string) => Promise<void>;
    createCategory: (name: string, classification: "income" | "expense", icon?: string, color?: string) => Promise<void>;
    handleEditWallet: (id: string, name: string, type: string) => void;
    handleUpdateWallet: (name: string, type: string) => Promise<void>;
    setEditingWallet: (wallet: { id: string; name: string; type: string } | null) => void;
    handleEditCategory: (id: string, name: string, classification: "income" | "expense", icon?: string, color?: string) => void;
    handleUpdateCategory: (name: string, classification: "income" | "expense", icon?: string, color?: string) => Promise<void>;
    setEditingCategory: (category: { id: string; name: string; classification: "income" | "expense"; icon?: string; color?: string } | null) => void;
    setDeleteConfirm: (confirm: { type: "wallet" | "category"; id: string; name: string } | null) => void;
    handleDelete: () => Promise<void>;
    setSelectedItem: (item: { type: "wallet" | "category"; id: string } | null) => void;
  };
}

export function StatusHub({ state, actions, hideHeader = false }: StatusHubProps & { hideHeader?: boolean }) {
  if (hideHeader) {
    return (
      <>
        {/* Add Wallet Dialog */}
        <AddWalletDialog
          isOpen={state.isAddWalletOpen}
          onClose={() => actions.setIsAddWalletOpen(false)}
          onCreate={actions.createWallet}
          isCreating={state.isCreatingWallet}
        />

        {/* Edit Wallet Dialog */}
        <EditWalletDialog
          isOpen={!!state.editingWallet}
          onClose={() => actions.setEditingWallet(null)}
          onUpdate={actions.handleUpdateWallet}
          wallet={state.editingWallet}
          isUpdating={state.isCreatingWallet}
        />

        {/* Add Category Dialog */}
        <AddCategoryDialog
          isOpen={state.isAddCategoryOpen}
          onClose={() => actions.setIsAddCategoryOpen(false)}
          onCreate={actions.createCategory}
          isCreating={state.isCreatingCategory}
        />

        {/* Edit Category Dialog */}
        <EditCategoryDialog
          isOpen={!!state.editingCategory}
          onClose={() => actions.setEditingCategory(null)}
          onUpdate={actions.handleUpdateCategory}
          category={state.editingCategory}
          isUpdating={state.isCreatingCategory}
        />

        <DeleteConfirmDialog
          isOpen={!!state.deleteConfirm}
          onClose={() => actions.setDeleteConfirm(null)}
          onConfirm={actions.handleDelete}
          item={state.deleteConfirm}
          isDeleting={state.isCreatingWallet || state.isCreatingCategory}
        />

        {<DetailView state={state} actions={actions} />}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-secondary rounded-xl border border-border/50 self-center w-full max-w-[320px]">
        <button
          onClick={() => actions.setActiveTab("wallets")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-meta font-bold transition-all duration-300",
            state.activeTab === 'wallets' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Wallets
        </button>
        <button
          onClick={() => actions.setActiveTab("categories")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-meta font-bold transition-all duration-300",
            state.activeTab === 'categories' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Categories
        </button>
      </div>

      {/* List Section */}
      <div className="flex flex-col gap-6 pb-24">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground capitalize">
              {state.activeTab}
            </h3>
            <span className="text-meta-2xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-bold">
              {state.activeTab === "wallets" ? state.walletItems.length : state.categoryItems.length}
            </span>
          </div>
          <button
            onClick={actions.handleAddClick}
            className="w-10 h-10 rounded-xl bg-accent text-white shadow-md shadow-accent/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, x: state.activeTab === 'wallets' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: state.activeTab === 'wallets' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {state.activeTab === "wallets" ? (
              <MasterRegistry
                items={state.walletItems}
                isLoading={state.isLoading}
                onEdit={(id) => actions.setSelectedItem({ type: "wallet", id })}
              />
            ) : (
              <MasterRegistry
                items={state.categoryItems}
                isLoading={state.isLoading}
                onEdit={(id) => actions.setSelectedItem({ type: "category", id })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Wallet Dialog */}
      <AddWalletDialog
        isOpen={state.isAddWalletOpen}
        onClose={() => actions.setIsAddWalletOpen(false)}
        onCreate={actions.createWallet}
        isCreating={state.isCreatingWallet}
      />

      {/* Edit Wallet Dialog */}
      <EditWalletDialog
        isOpen={!!state.editingWallet}
        onClose={() => actions.setEditingWallet(null)}
        onUpdate={actions.handleUpdateWallet}
        wallet={state.editingWallet}
        isUpdating={state.isCreatingWallet}
      />

      {/* Add Category Dialog */}
      <AddCategoryDialog
        isOpen={state.isAddCategoryOpen}
        onClose={() => actions.setIsAddCategoryOpen(false)}
        onCreate={actions.createCategory}
        isCreating={state.isCreatingCategory}
      />

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        isOpen={!!state.editingCategory}
        onClose={() => actions.setEditingCategory(null)}
        onUpdate={actions.handleUpdateCategory}
        category={state.editingCategory}
        isUpdating={state.isCreatingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!state.deleteConfirm}
        onClose={() => actions.setDeleteConfirm(null)}
        onConfirm={actions.handleDelete}
        item={state.deleteConfirm}
        isDeleting={state.isCreatingWallet || state.isCreatingCategory}
      />

      {/* Management Item Detail View */}
      <DetailView state={state} actions={actions} />
    </div>
  );
}

function DetailView({ state, actions }: { state: StatusHubProps['state'], actions: StatusHubProps['actions'] }) {
  const item = state.selectedItem 
    ? state.selectedItem.type === "wallet" 
      ? { ...state.walletItems.find(w => w.id === state.selectedItem?.id)!, type: "wallet" as const }
      : { ...state.categoryItems.find(c => c.id === state.selectedItem?.id)!, type: "category" as const }
    : null;

  return (
    <ManagementItemDetail
      isOpen={!!state.selectedItem}
      onClose={() => actions.setSelectedItem(null)}
      item={item}
      onEdit={() => {
        if (!item) return;
        if (state.selectedItem?.type === "wallet") {
          actions.handleEditWallet(item.id!, item.title, item.subtitle);
        } else {
          const cat = item as CategoryItem;
          actions.handleEditCategory(item.id!, item.title, item.subtitle as "income" | "expense", cat.icon_name, item.color);
        }
      }}
      onDelete={() => {
        if (!item) return;
        actions.setDeleteConfirm({ type: state.selectedItem!.type, id: item.id!, name: item.title });
      }}
    />
  );
}

function AddWalletDialog({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, type: string, currencyCode?: string) => Promise<void>;
  isCreating: boolean;
}) {
  const [walletName, setWalletName] = useState("");
  const [walletType, setWalletType] = useState<"bank" | "cash" | "e-wallet">("bank");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!walletName.trim()) {
      setError("Wallet name is required");
      return;
    }

    try {
      await onCreate(walletName.trim(), walletType, "IDR");
      setWalletName("");
      setWalletType("bank");
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create wallet");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-background z-[150] flex flex-col font-['Urbanist',sans-serif]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body font-bold text-foreground">Add New Wallet</h2>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 max-w-lg mx-auto w-full">
            <div className="flex-1 flex flex-col gap-12 pt-16 pb-12">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  What should we call it?
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    autoFocus
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    placeholder="e.g. My Savings, Daily Pocket"
                    className="w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/20 text-foreground"
                    disabled={isCreating}
                  />
                  <div className="h-[2px] w-full bg-border rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: walletName ? "100%" : "0%" }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Wallet Type
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {(["bank", "cash", "e-wallet"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWalletType(type)}
                      disabled={isCreating}
                      className={cn(
                        "h-[76px] px-6 rounded-2xl text-body font-bold capitalize transition-all border flex items-center justify-between group",
                        walletType === type
                          ? "bg-accent/10 border-accent text-accent shadow-sm"
                          : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>{type}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        walletType === type ? "border-accent bg-accent" : "border-border"
                      )}>
                        {walletType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="h-16 rounded-2xl bg-foreground text-white text-body font-black flex items-center justify-center transition-all mb-8 shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving Wallet...</span>
                </div>
              ) : (
                "Create Wallet"
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AddCategoryDialog({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, classification: "income" | "expense", icon?: string, color?: string) => Promise<void>;
  isCreating: boolean;
}) {
  const [categoryName, setCategoryName] = useState("");
  const [classification, setClassification] = useState<"income" | "expense">("expense");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      await onCreate(categoryName.trim(), classification);
      setCategoryName("");
      setClassification("expense");
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update category");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-background z-[150] flex flex-col font-['Urbanist',sans-serif]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body font-bold text-foreground">Add New Category</h2>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 max-w-lg mx-auto w-full">
            <div className="flex-1 flex flex-col gap-12 pt-16 pb-12">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Category Name
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    autoFocus
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Food, Salary, Rent"
                    className="w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/20 text-foreground"
                    disabled={isCreating}
                  />
                  <div className="h-[2px] w-full bg-border rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: categoryName ? "100%" : "0%" }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Classification
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(["expense", "income"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setClassification(type)}
                      disabled={isCreating}
                      className={cn(
                        "h-[76px] px-6 rounded-2xl text-body font-bold capitalize transition-all border flex items-center justify-between group",
                        classification === type
                          ? type === "income"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                            : "bg-orange-500/10 border-orange-500 text-orange-600"
                          : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>{type}</span>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        classification === type 
                          ? type === "income" ? "border-emerald-500 bg-emerald-500" : "border-orange-500 bg-orange-500"
                          : "border-border"
                      )}>
                        {classification === type && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="h-16 rounded-2xl bg-foreground text-white text-body font-black flex items-center justify-center transition-all mb-8 shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving Category...</span>
                </div>
              ) : (
                "Create Category"
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditWalletDialog({
  isOpen,
  onClose,
  onUpdate,
  wallet,
  isUpdating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string, type: string) => Promise<void>;
  wallet: { id: string; name: string; type: string } | null;
  isUpdating: boolean;
}) {
  const [walletName, setWalletName] = useState(wallet?.name || "");
  const [walletType, setWalletType] = useState<"bank" | "cash" | "e-wallet">((wallet?.type as "bank" | "cash" | "e-wallet") || "bank");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (wallet) {
      setWalletName(wallet.name);
      setWalletType(wallet.type as "bank" | "cash" | "e-wallet");
    }
  }, [wallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!walletName.trim()) {
      setError("Wallet name is required");
      return;
    }

    try {
      await onUpdate(walletName.trim(), walletType);
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update wallet");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && wallet && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-background z-[160] flex flex-col font-['Urbanist',sans-serif]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body font-bold text-foreground">Edit Wallet</h2>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 max-w-lg mx-auto w-full">
            <div className="flex-1 flex flex-col gap-12 pt-16 pb-12">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Wallet Name
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    autoFocus
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    className="w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-0 text-foreground"
                    disabled={isUpdating}
                  />
                  <div className="h-[2px] w-full bg-border rounded-full" />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Wallet Type
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {(["bank", "cash", "e-wallet"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWalletType(type)}
                      disabled={isUpdating}
                      className={cn(
                        "h-[76px] px-6 rounded-2xl text-body font-bold capitalize transition-all border flex items-center justify-between group",
                        walletType === type
                          ? "bg-accent/10 border-accent text-accent shadow-sm"
                          : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>{type}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        walletType === type ? "border-accent bg-accent" : "border-border"
                      )}>
                        {walletType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="h-16 rounded-2xl bg-foreground text-white text-body font-black flex items-center justify-center transition-all mb-8 shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Updating...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditCategoryDialog({
  isOpen,
  onClose,
  onUpdate,
  category,
  isUpdating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string, classification: "income" | "expense", icon?: string, color?: string) => Promise<void>;
  category: { id: string; name: string; classification: "income" | "expense"; icon?: string; color?: string } | null;
  isUpdating: boolean;
}) {
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [classification, setClassification] = useState<"income" | "expense">(category?.classification || "expense");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setClassification(category.classification);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      await onUpdate(categoryName.trim(), classification);
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update category");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-background z-[160] flex flex-col font-['Urbanist',sans-serif]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body font-bold text-foreground">Edit Category</h2>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 max-w-lg mx-auto w-full">
            <div className="flex-1 flex flex-col gap-12 pt-16 pb-12">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Category Name
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    autoFocus
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-0 text-foreground"
                    disabled={isUpdating}
                  />
                  <div className="h-[2px] w-full bg-border rounded-full" />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-meta-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Classification
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(["expense", "income"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setClassification(type)}
                      disabled={isUpdating}
                      className={cn(
                        "h-[76px] px-6 rounded-2xl text-body font-bold capitalize transition-all border flex items-center justify-between group",
                        classification === type
                          ? type === "income"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                            : "bg-orange-500/10 border-orange-500 text-orange-600"
                          : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>{type}</span>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        classification === type 
                          ? type === "income" ? "border-emerald-500 bg-emerald-500" : "border-orange-500 bg-orange-500"
                          : "border-border"
                      )}>
                        {classification === type && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="h-16 rounded-2xl bg-foreground text-white text-body font-black flex items-center justify-center transition-all mb-8 shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Updating...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  item,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: { type: "wallet" | "category"; id: string; name: string } | null;
  isDeleting: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-background z-[200] flex flex-col font-['Urbanist',sans-serif]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-body font-bold text-foreground">Confirm Deletion</h2>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full items-center justify-center text-center">
            <div className="w-24 h-24 rounded-[32px] bg-rose-500/10 text-rose-500 flex items-center justify-center mb-8 border border-rose-500/20">
              <Trash2 className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-black text-foreground tracking-tight mb-4">
              Delete {item.type === "wallet" ? "Wallet" : "Category"}?
            </h1>
            <p className="text-lg font-bold text-muted-foreground/60 leading-relaxed max-w-xs">
              Are you sure you want to permanently delete <span className="text-foreground">&quot;{item.name}&quot;</span>? This action cannot be undone.
            </p>

            <div className="w-full flex flex-col gap-4 mt-12">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="w-full h-16 rounded-2xl bg-rose-500 text-white font-black text-body flex items-center justify-center transition-all shadow-xl shadow-rose-500/20 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  `Delete ${item.type === "wallet" ? "Wallet" : "Category"}`
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="w-full h-16 rounded-2xl bg-secondary text-foreground font-black text-body flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
