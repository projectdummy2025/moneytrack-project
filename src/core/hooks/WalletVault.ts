"use client";

import { useState, useEffect, useCallback } from "react";
import { Wallet } from "@core/types/DataCore";

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wallets");
      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }
      const data = await response.json();
      setWallets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const createWallet = async (walletName: string, walletType: string, currencyCode?: string) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/wallets", {
        method: "POST",
        body: JSON.stringify({ walletName, walletType, currencyCode: currencyCode || "IDR" }),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create wallet");
      }

      await fetchWallets();
      return await response.json();
    } finally {
      setIsCreating(false);
    }
  };

  const updateWallet = async (id: string, data: { walletName?: string; walletType?: string; balance?: string; currencyCode?: string }) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/wallets/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update wallet");
      }

      await fetchWallets();
      return await response.json();
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteWallet = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/wallets/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete wallet");
      }

      await fetchWallets();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    wallets,
    isLoading,
    error,
    mutate: fetchWallets,
    createWallet,
    isCreating,
    updateWallet,
    isUpdating,
    deleteWallet,
    isDeleting,
  };
}
