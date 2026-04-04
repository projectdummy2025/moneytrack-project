"use client";

import React from "react";
import { Filter, Coffee, ArrowUpRight, Bus, ShoppingBag, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface RecentActivitiesProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function RecentActivities({ transactions, isLoading }: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-40 bg-muted rounded mx-2 animate-pulse" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-muted rounded-[2rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
        <button className="flex items-center gap-1 text-muted-foreground font-medium text-sm hover:text-foreground transition-colors group">
          Filter <Filter className="w-4 h-4 transition-transform group-hover:rotate-180" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card rounded-[2rem] border border-dashed">
            No recent activities found.
          </div>
        ) : (
          transactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-4 p-5 rounded-[2rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getTransactionColor(transaction)} group-hover:scale-110 transition-transform`}>
                <TransactionIcon iconName={transaction.categoryIcon} classification={transaction.classification} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base tracking-tight mb-0.5">{transaction.memo || transaction.categoryName}</h4>
                <p className="text-xs text-muted-foreground font-medium">
                  {transaction.categoryName} • {new Date(transaction.transactedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-right flex flex-col items-end gap-1">
                <p className={`font-extrabold text-lg tracking-tight ${transaction.classification === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {transaction.classification === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
                <div className={`w-1.5 h-1.5 rounded-full ${transaction.classification === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      <button className="w-full mt-2 py-4 rounded-[2rem] border border-dashed border-border text-muted-foreground font-bold hover:bg-muted/50 hover:text-foreground transition-all">
        View All Transactions
      </button>
    </div>
  );
}

function getTransactionColor(t: Transaction) {
  if (t.categoryColor) {
    // Basic color mapping if color is provided in hex or name
    return `bg-opacity-10 ${t.categoryColor}`; 
  }
  return t.classification === 'income' ? 'text-emerald-500 bg-emerald-50' : 'text-blue-500 bg-blue-50';
}

function TransactionIcon({ iconName, classification }: { iconName: string | null, classification: string | null }) {
  // Simple mapping for demo
  const icons: Record<string, LucideIcon> = {
    coffee: Coffee,
    utensils: ArrowUpRight, // fallback
    bus: Bus,
    shopping: ShoppingBag,
    salary: ArrowUpRight,
  };

  const Icon = (iconName && icons[iconName.toLowerCase()]) || (classification === 'income' ? ArrowUpRight : ShoppingBag);
  return <Icon className="w-6 h-6" />;
}
