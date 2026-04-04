"use client";

import React from "react";
import { Filter, Coffee, ArrowUpRight, Bus, ShoppingBag, LucideIcon } from "lucide-react";
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
            <div className="h-10 w-10 bg-muted/20 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 bg-muted/20 rounded" />
              <div className="h-2 w-1/4 bg-muted/20 rounded" />
            </div>
            <div className="h-4 w-16 bg-muted/20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Recent Activity</h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary/80">Filter</button>
      </div>

      <div className="flex flex-col">
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground bg-muted/5 rounded-[2rem] border border-dashed border-border/40">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No moves yet</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/30">
            {transactions.map((transaction, idx) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 py-4 group cursor-pointer transition-colors active:bg-muted/5"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  transaction.classification === 'income' 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  <TransactionIcon iconName={transaction.categoryIcon} classification={transaction.classification} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm tracking-tight truncate">{transaction.memo || transaction.categoryName}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
                    {transaction.categoryName}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    "font-black text-sm tracking-tighter",
                    transaction.classification === 'income' ? 'text-emerald-500' : 'text-foreground'
                  )}>
                    {transaction.classification === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracing-widest mt-0.5">
                    {new Date(transaction.transactedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {transactions.length > 0 && (
        <button className="w-full py-4 text-primary/80 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all">
          View All History
        </button>
      )}
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
  return <Icon className="w-4 h-4 stroke-[2.5px]" />;
}
