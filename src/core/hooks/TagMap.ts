"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "@core/types/DataCore";
import Cookies from "js-cookie";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    const session = Cookies.get("moneytrack_session");
    if (!session) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (categoryName: string, classification: "income" | "expense", icon?: string, color?: string) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ categoryName, classification, icon, color }),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create category");
      }

      await fetchCategories();
      return await response.json();
    } finally {
      setIsCreating(false);
    }
  };

  const updateCategory = async (id: string, data: { categoryName?: string; classification?: "income" | "expense"; icon?: string; color?: string }) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update category");
      }

      await fetchCategories();
      return await response.json();
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete category");
      }

      await fetchCategories();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    mutate: fetchCategories,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
  };
}
