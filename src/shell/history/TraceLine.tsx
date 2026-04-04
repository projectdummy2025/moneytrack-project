"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coffee,
  ShoppingBag,
  Bus,
  Utensils,
  LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, cn } from "@core/utils/HelperTool";
import { Transaction } from "@core/types/DataCore";

interface TraceLineProps {
  state: {
    groupedTransactions: [string, Transaction[]][];
    searchQuery: string;
    totals: { monthNet: number, transCount: number };
    isLoading: boolean;
  };
  actions: {
    setSearchQuery: (val: string) => void;
  };
}

export function TraceLine({ state, actions }: TraceLineProps) {
  if (state.isLoading) {
    return <div className="animate-pulse flex flex-col gap-8">
      <div className="h-16 bg-muted rounded-[2rem]" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-muted rounded-[2rem]" />
        <div className="h-24 bg-muted rounded-[2rem]" />
      </div>
      {[1, 2].map(i => <div key={i} className="h-64 bg-muted rounded-[2rem]" />)}
    </div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search & Filter Bar */}
      <div className="flex gap-3 sticky top-4 z-40 sm:top-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={state.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-[2rem] bg-card border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
        <button className="px-5 rounded-[2rem] bg-card border border-border/50 flex items-center justify-center hover:bg-muted/50 transition-all">
          <Filter className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-6 rounded-[2rem] border border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Month Net</p>
          <p className={cn(
            "text-2xl font-black",
            state.totals.monthNet >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            {state.totals.monthNet >= 0 ? '+' : ''} {formatCurrency(state.totals.monthNet)}
          </p>
        </div>
        <div className="bg-card p-6 rounded-[2rem] border border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Trans. Count</p>
          <p className="text-2xl font-black text-slate-800">{state.totals.transCount}</p>
        </div>
      </div>

      {/* Grouped History List */}
      <div className="flex flex-col gap-8 pb-8">
        {state.groupedTransactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card rounded-[2.5rem] border border-dashed border-border/50 font-bold">
            No transactions found.
          </div>
        ) : (
          state.groupedTransactions.map(([date, items], gIdx) => (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="sticky top-20 sm:top-24 z-30 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full self-start text-sm font-bold text-muted-foreground border border-border/30">
                {date}
              </h3>
              
              <div className="flex flex-col gap-3">
                {items.map((item, iIdx) => (
                  <HistoryCard 
                    key={item.id} 
                    item={item} 
                    delay={(gIdx * 0.1) + (iIdx * 0.05)} 
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function HistoryCard({ item, delay }: { item: Transaction, delay: number }) {
  const icons: Record<string, LucideIcon> = {
    coffee: Coffee,
    shopping: ShoppingBag,
    bus: Bus,
    food: Utensils,
  };

  const Icon = (item.categoryIcon && icons[item.categoryIcon.toLowerCase()]) || (item.classification === 'income' ? ArrowUpRight : ArrowDownLeft);
  const colorClass = item.classification === 'income' ? 'text-emerald-500 bg-emerald-50' : 'text-blue-500 bg-blue-50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="flex items-center gap-4 p-5 rounded-[2rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all group cursor-pointer"
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-base tracking-tight mb-0.5 group-hover:text-primary transition-colors">
          {item.memo || item.categoryName}
        </h4>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          {item.categoryName} • {new Date(item.transactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      <div className="text-right">
        <p className={cn(
          "font-black text-lg tracking-tight",
          item.classification === 'income' ? 'text-emerald-600' : 'text-slate-900 group-hover:text-red-600 transition-colors'
        )}>
          {item.classification === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
        </p>
      </div>
    </motion.div>
  );
}
