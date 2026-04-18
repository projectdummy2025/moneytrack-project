"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MasterRegistry } from "@shell/manage/MasterRegistry";
import { useManageCore } from "@core/hooks/ManageCore";
import { StatusHub } from "@shell/manage/StatusHub";

export default function CategoriesPage() {
  const brain = useManageCore();

  return (
    <div className="flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-between"
      >
        <Link 
          href="/"
          className="size-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground active:scale-95 transition-all shadow-sm z-10"
        >
          <X className="size-5" />
        </Link>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <h1 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">Categories</h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Organize your spending</p>
        </div>
        <button
          onClick={() => brain.actions.setIsAddCategoryOpen(true)}
          className="relative z-10 w-10 h-10 rounded-xl bg-[#35C2C1] text-white shadow-sm flex items-center justify-center active:scale-95 transition-all"
        >
          <Plus className="size-5 stroke-[2.5px]" />
        </button>
      </motion.div>

      <MasterRegistry
        items={brain.state.categoryItems as any}
        isLoading={brain.state.isLoading}
        onEdit={(id) => {
          const cat = brain.state.categoryItems.find(c => c.id === id);
          if (cat) brain.actions.handleEditCategory(id, cat.title, cat.subtitle as any, cat.icon_name || undefined, cat.color || undefined);
        }}
        onDelete={(id) => {
          const cat = brain.state.categoryItems.find(c => c.id === id);
          if (cat) brain.actions.setDeleteConfirm({ type: "category", id, name: cat.title });
        }}
      />

      <StatusHub 
        state={{...brain.state, activeTab: "categories"}} 
        actions={brain.actions} 
        hideHeader={true}
      />
    </div>
  );
}
