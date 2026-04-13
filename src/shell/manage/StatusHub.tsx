"use client";

import React, { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@core/utils/HelperTool";
import { MasterRegistry } from "./MasterRegistry";

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

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={!!state.deleteConfirm}
          onClose={() => actions.setDeleteConfirm(null)}
          onConfirm={actions.handleDelete}
          item={state.deleteConfirm}
          isDeleting={state.isCreatingWallet || state.isCreatingCategory}
        />
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
                onEdit={(id) => {
                  const wallet = state.walletItems.find(w => w.id === id);
                  if (wallet) actions.handleEditWallet(id, wallet.title, wallet.subtitle);
                }}
                onDelete={(id) => {
                  const wallet = state.walletItems.find(w => w.id === id);
                  if (wallet) actions.setDeleteConfirm({ type: "wallet", id, name: wallet.title });
                }}
              />
            ) : (
              <MasterRegistry
                items={state.categoryItems}
                isLoading={state.isLoading}
                onEdit={(id) => {
                  const cat = state.categoryItems.find(c => c.id === id);
                  if (cat) actions.handleEditCategory(id, cat.title, cat.subtitle as "income" | "expense", cat.icon_name, cat.color);
                }}
                onDelete={(id) => {
                  const cat = state.categoryItems.find(c => c.id === id);
                  if (cat) actions.setDeleteConfirm({ type: "category", id, name: cat.title });
                }}
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
    </div>
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f1717]/80 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-extrabold text-foreground">Add New Wallet</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="e.g., Bank BCA, Cash, GoPay"
                  className="w-full h-[48px] bg-secondary border border-border rounded-xl px-4 outline-none focus:border-accent transition-colors text-body-sm font-medium"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Wallet Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["bank", "cash", "e-wallet"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWalletType(type)}
                      disabled={isCreating}
                      className={cn(
                        "h-[44px] rounded-xl text-meta font-bold capitalize transition-all border",
                        walletType === type
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-[48px] rounded-xl bg-foreground text-white text-body-sm font-bold flex items-center justify-center transition-all mt-2 active:scale-95 disabled:opacity-50"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Wallet"
                )}
              </button>
            </form>
          </motion.div>
        </>
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f1717]/80 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-extrabold text-foreground">Add New Category</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Food, Salary, Transport"
                  className="w-full h-[48px] bg-secondary border border-border rounded-xl px-4 outline-none focus:border-accent transition-colors text-body-sm font-medium"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Classification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["expense", "income"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setClassification(type)}
                      disabled={isCreating}
                      className={cn(
                        "h-[44px] rounded-xl text-meta font-bold capitalize transition-all border",
                        classification === type
                          ? type === "income"
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                            : "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-[48px] rounded-xl bg-foreground text-white text-body-sm font-bold flex items-center justify-center transition-all mt-2 active:scale-95 disabled:opacity-50"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Category"
                )}
              </button>
            </form>
          </motion.div>
        </>
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f1717]/80 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-extrabold text-foreground">Edit Wallet</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full h-[48px] bg-secondary border border-border rounded-xl px-4 outline-none focus:border-accent transition-colors text-body-sm font-medium"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Wallet Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["bank", "cash", "e-wallet"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWalletType(type)}
                      disabled={isUpdating}
                      className={cn(
                        "h-[44px] rounded-xl text-meta font-bold capitalize transition-all border",
                        walletType === type
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full h-[48px] rounded-xl bg-foreground text-white text-body-sm font-bold flex items-center justify-center transition-all mt-2 active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Wallet"
                )}
              </button>
            </form>
          </motion.div>
        </>
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f1717]/80 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading font-extrabold text-foreground">Edit Category</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full h-[48px] bg-secondary border border-border rounded-xl px-4 outline-none focus:border-accent transition-colors text-body-sm font-medium"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className="block text-meta font-semibold text-foreground mb-1.5">
                  Classification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["expense", "income"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setClassification(type)}
                      disabled={isUpdating}
                      className={cn(
                        "h-[44px] rounded-xl text-meta font-bold capitalize transition-all border",
                        classification === type
                          ? type === "income"
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                            : "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full h-[48px] rounded-xl bg-foreground text-white text-body-sm font-bold flex items-center justify-center transition-all mt-2 active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Category"
                )}
              </button>
            </form>
          </motion.div>
        </>
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f1717]/80 backdrop-blur-[2px] z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl z-50 p-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-heading font-extrabold text-foreground">Delete {item.type === "wallet" ? "Wallet" : "Category"}?</h2>
              <p className="text-body-sm font-medium text-muted-foreground mt-2">
                Are you sure you want to delete &quot;{item.name}&quot;? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 h-[48px] rounded-xl bg-secondary text-foreground font-bold text-sm flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 h-[48px] rounded-xl bg-rose-500 text-white font-bold text-sm flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
