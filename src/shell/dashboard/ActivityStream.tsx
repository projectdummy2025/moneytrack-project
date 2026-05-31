"use client";

import React from "react";
import Link from "next/link";
import { Coffee, ArrowUpRight, Bus, ShoppingBag, LucideIcon } from "lucide-react";
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
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-[24px] p-4 flex items-center gap-4 animate-pulse border border-border">
            <div className="h-10 w-10 bg-secondary rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 bg-secondary rounded" />
              <div className="h-2 w-1/4 bg-secondary rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-heading-sm font-black tracking-tight text-foreground">Recent Transactions</h3>
        <Link href="/reports" className="text-meta font-extrabold text-[#35C2C1] uppercase tracking-wider hover:opacity-85 transition-opacity">See All</Link>
      </div>

      <div className="flex flex-col gap-3 pb-24">
        {transactions.length === 0 ? (
          <div className="bg-card rounded-[2rem] py-12 text-center text-muted-foreground border border-border/40 shadow-sm">
            <p className="text-body-sm font-medium italic opacity-50">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between bg-card rounded-2xl p-5 border border-border/40 relative overflow-hidden active:scale-[0.98] transition-transform select-none"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Subtle Colored Dot Indicator */}
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full shrink-0",
                  transaction.classification === 'income' ? "bg-[#35C2C1]" : "bg-rose-500"
                )} />

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-body font-black tracking-tight text-foreground truncate">
                      {transaction.memo || transaction.categoryName}
                    </span>
                    {transaction.memo && (
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-secondary text-[8px] font-black text-muted-foreground/80 uppercase tracking-wider">
                        {transaction.categoryName}
                      </span>
                    )}
                  </div>
                  <p className="text-meta-xs font-medium text-muted-foreground/60 leading-none mt-1">
                    {new Date(transaction.transactedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <p className={cn(
                "text-body font-black tracking-tight shrink-0",
                transaction.classification === 'income' ? 'text-[#35C2C1]' : 'text-rose-600'
              )}>
                {transaction.classification === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </p>
            </motion.div>
          ))
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
  return <Icon className="w-5 h-5 stroke-[2.5px]" />;
}
