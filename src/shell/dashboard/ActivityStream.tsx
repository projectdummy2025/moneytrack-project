"use client";

import React from "react";
import { Coffee, ArrowUpRight, Bus, ShoppingBag, LucideIcon, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Transaction } from "@core/types/DataCore";
import { formatCurrency } from "@core/utils/HelperTool";
import { cn } from "@core/utils/HelperTool";

interface RecentActivitiesProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function ActivityStream({ transactions, isLoading }: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-11 w-11 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 bg-muted rounded" />
              <div className="h-2 w-1/4 bg-muted rounded" />
            </div>
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
        <button className="text-[11px] font-bold text-accent uppercase tracking-wider">View All</button>
      </div>

      <div className="flex flex-col bg-card rounded-3xl border border-border overflow-hidden shadow-sm shadow-black/5">
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground px-6">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="text-[11px] mt-1 opacity-70">Start tracking your spending</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/50">
            {transactions.map((transaction, idx) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
              >
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-all border border-transparent",
                  transaction.classification === 'income' 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" 
                    : "bg-secondary text-primary border-border/50"
                )}>
                  <TransactionIcon iconName={transaction.categoryIcon} classification={transaction.classification} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[14px] tracking-tight truncate text-foreground">
                    {transaction.memo || transaction.categoryName}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    {transaction.categoryName}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    "font-bold text-[14px] tracking-tight",
                    transaction.classification === 'income' ? 'text-emerald-600' : 'text-foreground'
                  )}>
                    {transaction.classification === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">
                    {new Date(transaction.transactedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionIcon({ iconName, classification }: { iconName: string | null, classification: string | null }) {
  const icons: Record<string, LucideIcon> = {
    coffee: Coffee,
    bus: Bus,
    shopping: ShoppingBag,
    salary: ArrowUpRight,
  };

  const Icon = (iconName && icons[iconName.toLowerCase()]) || (classification === 'income' ? ArrowUpRight : ShoppingBag);
  return <Icon className="w-5 h-5 stroke-[2px]" />;
}
