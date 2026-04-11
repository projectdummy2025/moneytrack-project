"use client";

import { useState, useMemo } from "react";
import { useWallets } from "./WalletVault";
import { useCategories } from "./TagMap";
import { Wallet as WalletIcon, Tag as TagIcon } from "lucide-react";

export function useManageCore() {
  const [activeTab, setActiveTab] = useState<"wallets" | "categories">("wallets");
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const { wallets, isLoading: isLoadingWallets, createWallet, isCreating: isCreatingWallet } = useWallets();
  const { categories, isLoading: isLoadingCategories, createCategory, isCreating: isCreatingCategory } = useCategories();

  const walletItems = useMemo(() => {
    return wallets.map((w, idx) => ({
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
      title: c.categoryName,
      subtitle: c.classification,
      icon: TagIcon,
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
    },
    actions: {
      setActiveTab,
      setIsAddWalletOpen,
      setIsAddCategoryOpen,
      handleAddClick,
      createWallet,
      createCategory,
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
