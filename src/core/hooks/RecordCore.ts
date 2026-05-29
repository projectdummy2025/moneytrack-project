"use client";

import { useState, useEffect } from "react";
import { useWallets } from "./WalletVault";
import { useCategories } from "./TagMap";

interface RecordCoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  // When provided, the drawer opens on this tab instead of the default "expense"
  initialType?: RecordType;
}

export type RecordType = "expense" | "income" | "swap";

export function useRecordCore({ isOpen, onClose, onSuccess, initialType }: RecordCoreProps) {
  const { wallets } = useWallets();
  const { categories } = useCategories();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<RecordType>("expense");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [targetWalletId, setTargetWalletId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
    if (wallets.length > 1 && !targetWalletId) {
      setTargetWalletId(wallets[1].id);
    }
  }, [wallets, selectedWalletId, targetWalletId]);

  useEffect(() => {
    if (type !== "swap") {
      const filteredCategories = categories.filter(c => c.classification === type);
      if (filteredCategories.length > 0) {
        setSelectedCategoryId(filteredCategories[0].id);
      } else {
        setSelectedCategoryId("");
      }
    } else {
      setSelectedCategoryId("");
    }
    setError("");
  }, [type, categories]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // If a specific type was requested (e.g. "swap" from Wallets page), apply it now
      if (initialType) setType(initialType);
    } else {
      document.body.style.overflow = "unset";
      setAmount("");
      setMemo("");
      setError("");
      // Reset to default so the next normal open always starts on "expense"
      setType("expense");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    setError("");
    if (!amount || !selectedWalletId) {
      setError("Please fill required fields");
      return;
    }

    if (type === "swap") {
      if (!targetWalletId) {
        setError("Please select destination wallet");
        return;
      }
      if (selectedWalletId === targetWalletId) {
        setError("Source and target wallets must be different");
        return;
      }
    } else {
      if (!selectedCategoryId) {
        setError("Please select a category");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let response;
      if (type === "swap") {
        response = await fetch("/api/wallet-transfers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: selectedWalletId,
            targetId: targetWalletId,
            amount,
            memo,
            transactedAt: new Date().toISOString(),
          }),
        });
      } else {
        response = await fetch("/api/transactions", {
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
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process request");
      }

      onSuccess?.();
      onClose();
      setAmount("");
      setMemo("");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Something went wrong");
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
      targetWalletId,
      selectedCategoryId,
      memo,
      isSubmitting,
      error,
      wallets,
      filteredCategories,
    },
    actions: {
      setAmount,
      setType,
      setSelectedWalletId,
      setTargetWalletId,
      setSelectedCategoryId,
      setMemo,
      handleSubmit,
    }
  };
}
