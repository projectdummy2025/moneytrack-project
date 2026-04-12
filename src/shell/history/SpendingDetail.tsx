"use client";

import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Target,
  ArrowRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@core/utils/HelperTool";

interface SpendingDetailProps {
  state: any;
  actions: any;
}

export function SpendingDetail({ state, actions }: SpendingDetailProps) {
  if (state.isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-12 bg-muted rounded-2xl w-1/2 mx-auto" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-muted rounded-3xl" />
          <div className="h-24 bg-muted rounded-3xl" />
          <div className="h-24 bg-muted rounded-3xl" />
        </div>
        <div className="h-64 bg-muted rounded-[32px]" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const hasData = state.categoryData.length > 0;

  return (
    <div className="flex flex-col gap-8 font-['Urbanist',sans-serif] pb-24">
      {/* Month Selector */}
      <div className="flex items-center justify-between bg-card p-2 rounded-2xl border border-border/50 shadow-sm">
        <button 
          onClick={actions.prevMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-extrabold tracking-tight capitalize">{state.monthName}</h2>
        <button 
          onClick={actions.nextMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard 
          label="Income" 
          value={state.totalIncome} 
          icon={TrendingUp} 
          color="emerald" 
        />
        <SummaryCard 
          label="Expense" 
          value={state.totalExpense} 
          icon={TrendingDown} 
          color="rose" 
        />
        <SummaryCard 
          label="Savings" 
          value={state.netSavings} 
          icon={Target} 
          color="accent" 
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-[32px] p-6 border border-border/50 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Expense Breakdown</h3>
        
        {!hasData ? (
          <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground gap-3">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <TrendingDown className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-bold italic">No expenses recorded this month</p>
          </div>
        ) : (
          <>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={state.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {state.categoryData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    content={<CustomTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Info */}
              <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Total</p>
                <p className="text-xl font-extrabold tracking-tighter text-foreground">
                  {formatCurrency(state.totalExpense)}
                </p>
              </div>
            </div>

            {/* Percentages Bar */}
            <div className="mt-8 flex h-2 rounded-full overflow-hidden bg-secondary">
              {state.categoryData.map((cat: any, i: number) => (
                <div 
                  key={i}
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  className="h-full border-r border-white/10 last:border-0"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[16px] font-extrabold text-foreground px-1">Categories</h3>
        <div className="flex flex-col gap-3">
          {state.categoryData.map((cat: any, i: number) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-border/40 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  {Math.round(cat.percentage)}%
                </div>
                <div className="flex flex-col">
                  <p className="text-[14px] font-extrabold text-foreground leading-none mb-1.5">{cat.name}</p>
                  <p className="text-[11px] text-muted-foreground font-bold tracking-wide uppercase">
                    {cat.count} transactions
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <p className="text-[15px] font-extrabold text-foreground tracking-tight">
                  {formatCurrency(cat.value)}
                </p>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100/50",
    rose: "text-rose-600 bg-rose-50 border-rose-100/50",
    accent: "text-accent bg-accent/5 border-accent/10"
  };

  return (
    <div className={cn("rounded-3xl p-4 border flex flex-col gap-3 shadow-sm", colors[color])}>
      <div className="w-8 h-8 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-0.5">{label}</p>
        <p className="text-[13px] font-extrabold tracking-tight truncate">
          {formatCurrency(Math.abs(value))}
        </p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <p className="text-xs font-bold text-foreground">{data.name}</p>
        </div>
        <p className="text-sm font-extrabold text-foreground">{formatCurrency(data.value)}</p>
        <p className="text-[10px] font-bold text-muted-foreground mt-1 capitalize">
          {Math.round(data.percentage)}% of total expenses
        </p>
      </div>
    );
  }
  return null;
};
