"use client";

import { useState, useEffect } from "react";
import { useWallets } from "./WalletVault";
import { useCategories } from "./TagMap";

interface RecordCoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useRecordCore({ isOpen, onClose, onSuccess }: RecordCoreProps) {
  const { wallets } = useWallets();
  const { categories } = useCategories();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  useEffect(() => {
    const filteredCategories = categories.filter(c => c.classification === type);
    if (filteredCategories.length > 0) {
      setSelectedCategoryId(filteredCategories[0].id);
    } else {
      setSelectedCategoryId("");
    }
  }, [type, categories]);

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

  const handleSubmit = async () => {
    if (!amount || !selectedWalletId || !selectedCategoryId) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          walletId: selectedWalletId,
          categoryId: selectedCategoryId,
          memo,
          transactedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      onSuccess?.();
      onClose();
      setAmount("");
      setMemo("");
    } catch (error) {
      console.error(error);
      alert("Error creating transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => c.classification === type);

  return {
    state: {
      amount,
      type,
      selectedWalletId,
      selectedCategoryId,
      memo,
      isSubmitting,
      wallets,
      filteredCategories,
    },
    actions: {
      setAmount,
      setType,
      setSelectedWalletId,
      setSelectedCategoryId,
      setMemo,
      handleSubmit,
    }
  };
}
