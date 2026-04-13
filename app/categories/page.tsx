"use client";

import React from "react";
import { Plus } from "lucide-react";
import { MasterRegistry } from "@shell/manage/MasterRegistry";
import { useManageCore } from "@core/hooks/ManageCore";
import { StatusHub } from "@shell/manage/StatusHub";

export default function CategoriesPage() {
  const brain = useManageCore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <h1 className="text-heading-lg font-extrabold text-foreground">Categories</h1>
          <p className="text-meta font-semibold text-muted-foreground uppercase">Organize your spending</p>
        </div>
        <button
          onClick={() => brain.actions.setIsAddCategoryOpen(true)}
          className="w-12 h-12 rounded-2xl bg-[#35C2C1] text-white shadow-lg shadow-[#35C2C1]/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>

      <MasterRegistry
        items={brain.state.categoryItems}
        isLoading={brain.state.isLoading}
        onEdit={(id) => {
          const cat = brain.state.categoryItems.find(c => c.id === id);
          if (cat) brain.actions.handleEditCategory(id, cat.title, cat.subtitle, cat.icon_name, cat.color);
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
