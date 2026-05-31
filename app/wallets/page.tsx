"use client";

import React from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { MasterRegistry } from "@shell/manage/MasterRegistry";
import { useManageCore } from "@core/hooks/ManageCore";
import { StatusHub } from "@shell/manage/StatusHub";
import { useDashBrain } from "@core/hooks/DashBrain";

export default function WalletsPage() {
  const brain = useManageCore();
  // Access global drawer to open transfer directly from this page
  const dashData = useDashBrain();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <h1 className="text-heading-lg font-black tracking-tight text-foreground">My Wallets</h1>
          <p className="text-meta font-extrabold uppercase tracking-[0.16em] text-muted-foreground/60">Manage your accounts</p>
        </div>

        {/* Action buttons: Transfer (opens swap drawer) + Add New Wallet */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dashData.actions.openTransferDrawer()}
            className="w-10 h-10 rounded-xl bg-secondary border border-border text-foreground shadow-sm flex items-center justify-center active:scale-95 transition-all"
            title="Transfer between wallets"
          >
            <ArrowLeftRight className="size-4" />
          </button>
          <button
            onClick={() => brain.actions.setIsAddWalletOpen(true)}
            className="w-10 h-10 rounded-xl bg-[#35C2C1] text-white shadow-sm flex items-center justify-center active:scale-95 transition-all"
          >
            <Plus className="size-5 stroke-[2.5px]" />
          </button>
        </div>
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
