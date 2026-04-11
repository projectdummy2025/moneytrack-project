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
    return <div className="animate-pulse flex flex-col gap-8 px-1 font-['Urbanist',sans-serif]">
      <div className="h-14 bg-muted rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-muted rounded-3xl" />
        <div className="h-24 bg-muted rounded-3xl" />
      </div>
      {[1, 2].map(i => <div key={i} className="h-48 bg-muted rounded-3xl opacity-50" />)}
    </div>;
  }

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif]">
      {/* Search Bar */}
      <div className="relative group sticky top-0 z-40">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md -mx-4 px-4 pointer-events-none" />
        <div className="relative flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary border border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all outline-none font-bold text-sm"
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-all text-muted-foreground">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm shadow-black/5 flex flex-col gap-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Net Balance</p>
          <p className={cn(
            "text-lg font-extrabold tracking-tight",
            state.totals.monthNet >= 0 ? "text-emerald-600" : "text-rose-600"
          )}>
            {state.totals.monthNet >= 0 ? '+' : ''} {formatCurrency(state.totals.monthNet)}
          </p>
        </div>
        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm shadow-black/5 flex flex-col gap-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Records</p>
          <p className="text-lg font-extrabold tracking-tight text-foreground">{state.totals.transCount}</p>
        </div>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-8 pb-20">
        {state.groupedTransactions.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-sm font-medium italic opacity-50">No transactions found</p>
          </div>
        ) : (
          state.groupedTransactions.map(([date, items], gIdx) => (
            <div key={date} className="flex flex-col gap-3">
              <div className="flex items-center px-1">
                <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  {date}
                </h3>
              </div>
              
              <div className="flex flex-col bg-card rounded-3xl border border-border divide-y divide-border/50 shadow-sm shadow-black/5 overflow-hidden">
                {items.map((item, iIdx) => (
                  <HistoryItem 
                    key={item.id} 
                    item={item} 
                    delay={(gIdx * 0.04) + (iIdx * 0.02)} 
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

function HistoryItem({ item, delay }: { item: Transaction, delay: number }) {
  const icons: Record<string, LucideIcon> = {
    coffee: Coffee,
    shopping: ShoppingBag,
    bus: Bus,
    food: Utensils,
  };

  const Icon = (item.categoryIcon && icons[item.categoryIcon.toLowerCase()]) || (item.classification === 'income' ? ArrowUpRight : ArrowDownLeft);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
    >
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
        item.classification === 'income' 
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
          : "bg-secondary text-primary border border-border/50"
      )}>
        <Icon className="w-5 h-5 stroke-[2px]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[14px] tracking-tight truncate text-foreground">
          {item.memo || item.categoryName}
        </h4>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          {item.categoryName} • {new Date(item.transactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      <div className="text-right">
        <p className={cn(
          "font-bold text-[14px] tracking-tight",
          item.classification === 'income' ? 'text-emerald-600' : 'text-foreground'
        )}>
          {item.classification === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
        </p>
      </div>
    </motion.div>
  );
}
