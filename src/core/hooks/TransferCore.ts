"use client";

import { useState, useEffect } from "react";
import { useWallets } from "./WalletVault";

interface TransferCoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useTransferCore({ isOpen, onClose, onSuccess }: TransferCoreProps) {
  const { wallets } = useWallets();

  const [sourceWalletId, setSourceWalletId] = useState("");
  const [targetWalletId, setTargetWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (wallets.length > 0 && !sourceWalletId) {
      setSourceWalletId(wallets[0].id);
    }
  }, [wallets, sourceWalletId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setAmount("");
      setMemo("");
      setError("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    setError("");

    if (!amount || !sourceWalletId || !targetWalletId) {
      setError("Please fill all required fields");
      return;
    }

    if (sourceWalletId === targetWalletId) {
      setError("Source and target wallets must be different");
      return;
    }

    const sourceWallet = wallets.find(w => w.id === sourceWalletId);
    if (sourceWallet && parseFloat(sourceWallet.balance) < parseFloat(amount)) {
      setError("Insufficient balance");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/wallet-transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: sourceWalletId,
          targetId: targetWalletId,
          amount,
          memo,
          transactedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create transfer");
      }

      onSuccess?.();
      onClose();
      setAmount("");
      setMemo("");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to create transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      sourceWalletId,
      targetWalletId,
      amount,
      memo,
      isSubmitting,
      error,
      wallets,
    },
    actions: {
      setSourceWalletId,
      setTargetWalletId,
      setAmount,
      setMemo,
      handleSubmit,
    },
  };
}
