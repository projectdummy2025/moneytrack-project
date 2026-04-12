"use client";

import { useState, useMemo } from "react";
import { useWallets } from "./WalletVault";
import { useCategories } from "./TagMap";
import { Wallet as WalletIcon, Tag as TagIcon } from "lucide-react";

export function useManageCore() {
  const [activeTab, setActiveTab] = useState<"wallets" | "categories">("wallets");
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<{ id: string; name: string; type: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; classification: "income" | "expense"; icon?: string; color?: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "wallet" | "category"; id: string; name: string } | null>(null);
  const { wallets, isLoading: isLoadingWallets, createWallet, isCreating: isCreatingWallet, updateWallet, deleteWallet } = useWallets();
  const { categories, isLoading: isLoadingCategories, createCategory, isCreating: isCreatingCategory, updateCategory, deleteCategory } = useCategories();

  const walletItems = useMemo(() => {
    return wallets.map((w, idx) => ({
      id: w.id,
      title: w.walletName,
      subtitle: w.walletType,
      value: w.balance,
      icon: WalletIcon,
      colorClass: getWalletColor(w.walletType),
      delay: idx * 0.05
    }));
  }, [wallets]);

  const categoryItems = useMemo(() => {
    return categories.map((c, idx) => ({
      id: c.id,
      title: c.categoryName,
      subtitle: c.classification,
      icon: TagIcon,
      color: c.color,
      icon_name: c.icon,
      colorClass: c.classification === 'income' ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50',
      delay: idx * 0.05
    }));
  }, [categories]);

  const handleAddClick = () => {
    if (activeTab === "wallets") {
      setIsAddWalletOpen(true);
    } else {
      setIsAddCategoryOpen(true);
    }
  };

  const handleEditWallet = (id: string, name: string, type: string) => {
    setEditingWallet({ id, name, type });
  };

  const handleUpdateWallet = async (name: string, type: string) => {
    if (!editingWallet) return;
    await updateWallet(editingWallet.id, { walletName: name, walletType: type });
    setEditingWallet(null);
  };

  const handleEditCategory = (id: string, name: string, classification: "income" | "expense", icon?: string, color?: string) => {
    setEditingCategory({ id, name, classification, icon, color });
  };

  const handleUpdateCategory = async (name: string, classification: "income" | "expense", icon?: string, color?: string) => {
    if (!editingCategory) return;
    await updateCategory(editingCategory.id, { categoryName: name, classification, icon, color });
    setEditingCategory(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "wallet") {
      await deleteWallet(deleteConfirm.id);
    } else {
      await deleteCategory(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  return {
    state: {
      activeTab,
      walletItems,
      categoryItems,
      isLoading: isLoadingWallets || isLoadingCategories,
      itemCount: activeTab === 'wallets' ? wallets.length : categories.length,
      isAddWalletOpen,
      isAddCategoryOpen,
      isCreatingWallet,
      isCreatingCategory,
      editingWallet,
      editingCategory,
      deleteConfirm,
    },
    actions: {
      setActiveTab,
      setIsAddWalletOpen,
      setIsAddCategoryOpen,
      handleAddClick,
      createWallet,
      createCategory,
      handleEditWallet,
      handleUpdateWallet,
      setEditingWallet,
      handleEditCategory,
      handleUpdateCategory,
      setEditingCategory,
      setDeleteConfirm,
      handleDelete,
    }
  };
}

function getWalletColor(type: string) {
  switch (type.toLowerCase()) {
    case 'bank': return 'text-blue-500 bg-blue-50';
    case 'cash': return 'text-amber-500 bg-amber-50';
    case 'e-wallet': return 'text-emerald-500 bg-emerald-50';
    default: return 'text-primary bg-primary/10';
  }
}
