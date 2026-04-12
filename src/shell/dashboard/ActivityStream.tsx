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
          <div key={i} className="bg-white rounded-[20px] p-4 flex items-center gap-4 animate-pulse">
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 bg-muted rounded" />
              <div className="h-2 w-1/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[16px] font-extrabold text-[#1e232c]">Recent Transactions</h3>
        <Link href="/history" className="text-[13px] font-bold text-[#8391a1] hover:text-accent transition-colors">See All</Link>
      </div>

      <div className="flex flex-col gap-3 pb-24">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-[24px] py-12 text-center text-[#8391a1] border border-[#e8ecf4]">
            <p className="text-sm font-semibold">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between bg-white rounded-[24px] p-4 border border-[#e8ecf4] shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 transition-colors",
                  transaction.classification === 'income' 
                    ? "bg-[#d1fae5] text-[#059669]" 
                    : "bg-[#e0e7ff] text-[#4f46e5]"
                )}>
                  <TransactionIcon iconName={transaction.categoryIcon} classification={transaction.classification} />
                </div>
                
                <div className="flex flex-col">
                  <p className="text-[14px] font-extrabold text-[#1e232c] tracking-tight leading-none mb-1">
                    {transaction.memo || transaction.categoryName}
                  </p>
                  <p className="text-[12px] text-[#8391a1] font-bold leading-none">
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
                "font-extrabold text-[15px] tracking-tight",
                transaction.classification === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'
              )}>
                {formatCurrency(transaction.amount)}
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
