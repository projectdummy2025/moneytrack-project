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
    return <div className="animate-pulse flex flex-col gap-8 px-1">
      <div className="h-16 bg-muted/20 rounded-3xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-28 bg-muted/20 rounded-[2.5rem]" />
        <div className="h-28 bg-muted/20 rounded-[2.5rem]" />
      </div>
      {[1, 2].map(i => <div key={i} className="h-64 bg-muted/10 rounded-[2.5rem]" />)}
    </div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search & Filter Bar */}
      <div className="flex gap-3 sticky top-0 z-40 bg-background/80 backdrop-blur-md py-2 overflow-visible">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={state.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-sm"
          />
        </div>
        <button className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <div className="bg-card p-6 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col gap-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Net Cash Flow</p>
          <p className={cn(
            "text-xl font-black tracking-tighter",
            state.totals.monthNet >= 0 ? "text-emerald-500" : "text-rose-500"
          )}>
            {state.totals.monthNet >= 0 ? '+' : ''} {formatCurrency(state.totals.monthNet)}
          </p>
        </div>
        <div className="bg-card p-6 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col gap-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transactions</p>
          <p className="text-xl font-black tracking-tighter text-foreground">{state.totals.transCount}</p>
        </div>
      </div>

      {/* Grouped History List */}
      <div className="flex flex-col gap-10 pb-20 px-1">
        {state.groupedTransactions.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground bg-muted/20 rounded-[3rem] border border-dashed border-border/50">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30">No history found</p>
          </div>
        ) : (
          state.groupedTransactions.map(([date, items], gIdx) => (
            <div key={date} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 px-2">
                <div className="h-[1px] flex-1 bg-border/50" />
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  {date}
                </h3>
                <div className="h-[1px] flex-1 bg-border/50" />
              </div>
              
              <div className="flex flex-col gap-2">
                {items.map((item, iIdx) => (
                  <HistoryCard 
                    key={item.id} 
                    item={item} 
                    delay={(gIdx * 0.05) + (iIdx * 0.02)} 
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-card border border-border/40 hover:border-primary/30 transition-all group cursor-pointer"
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
        item.classification === 'income' 
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
          : "bg-muted/50 text-foreground border border-border/50"
      )}>
        <Icon className={cn("w-5 h-5 stroke-[2.5px]", item.classification === 'income' ? "" : "text-muted-foreground")} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm tracking-tight mb-0.5 truncate">{item.memo || item.categoryName}</h4>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em]">
          {item.categoryName} • {new Date(item.transactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      <div className="text-right">
        <p className={cn(
          "font-black text-sm tracking-tighter",
          item.classification === 'income' ? 'text-emerald-500' : 'text-foreground'
        )}>
          {item.classification === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
        </p>
      </div>
    </motion.div>
  );
}
