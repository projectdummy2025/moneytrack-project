"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "@core/types/DataCore";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCategories = useCallback(async () => {
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

  return { categories, isLoading, error, mutate: fetchCategories, createCategory, isCreating };
}
