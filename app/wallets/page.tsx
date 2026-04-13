"use client";

import React from "react";
import { Plus } from "lucide-react";
import { MasterRegistry } from "@shell/manage/MasterRegistry";
import { useManageCore } from "@core/hooks/ManageCore";
import { StatusHub } from "@shell/manage/StatusHub";

export default function WalletsPage() {
  const brain = useManageCore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <h1 className="text-heading-lg font-extrabold text-foreground">My Wallets</h1>
          <p className="text-meta font-semibold text-muted-foreground uppercase">Manage your accounts</p>
        </div>
        <button
          onClick={() => brain.actions.setIsAddWalletOpen(true)}
          className="w-12 h-12 rounded-2xl bg-[#35C2C1] text-white shadow-lg shadow-[#35C2C1]/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>

      <MasterRegistry
        items={brain.state.walletItems}
        isLoading={brain.state.isLoading}
        onEdit={(id) => {
          const wallet = brain.state.walletItems.find(w => w.id === id);
          if (wallet) brain.actions.handleEditWallet(id, wallet.title, wallet.subtitle);
        }}
        onDelete={(id) => {
          const wallet = brain.state.walletItems.find(w => w.id === id);
          if (wallet) brain.actions.setDeleteConfirm({ type: "wallet", id, name: wallet.title });
        }}
      />

      {/* Reusing the Dialogs from StatusHub by providing the necessary props */}
      <StatusHub 
        state={{...brain.state, activeTab: "wallets"}} 
        actions={brain.actions} 
        hideHeader={true}
      />
    </div>
  );
}
