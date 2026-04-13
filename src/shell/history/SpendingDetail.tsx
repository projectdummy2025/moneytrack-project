"use client";

import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Target,
  ArrowRight,
  PieChart as PieIcon
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { formatCurrency, cn } from "@core/utils/HelperTool";

interface SpendingDetailProps {
  state: any;
  actions: any;
}

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function SpendingDetail({ state, actions }: SpendingDetailProps) {
  if (state.isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-12 bg-muted/20 rounded-2xl w-full" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-muted/20 rounded-3xl" />
          <div className="h-24 bg-muted/20 rounded-3xl" />
          <div className="h-24 bg-muted/20 rounded-3xl" />
        </div>
        <div className="h-[380px] bg-muted/20 rounded-[40px]" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/20 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const hasData = state.categoryData.length > 0;

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 font-['Urbanist',sans-serif] pb-24"
    >
      {/* Month Selector */}
      <motion.div variants={itemVars} className="flex items-center justify-between bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-sm">
        <button 
          onClick={actions.prevMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary/10 active:scale-95 transition-all text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-extrabold tracking-tight capitalize text-foreground">{state.monthName}</h2>
          <div className="w-8 h-1 bg-primary/20 rounded-full mt-1" />
        </div>
        <button 
          onClick={actions.nextMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary/10 active:scale-95 transition-all text-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-3 gap-3">
        <SummaryCard 
          label="Income" 
          value={state.totalIncome} 
          icon={TrendingUp} 
          gradient="from-emerald-500/10 to-emerald-500/5"
          color="emerald" 
        />
        <SummaryCard 
          label="Expense" 
          value={state.totalExpense} 
          icon={TrendingDown} 
          gradient="from-rose-500/10 to-rose-500/5"
          color="rose" 
        />
        <SummaryCard 
          label="Savings" 
          value={state.netSavings} 
          icon={Target} 
          gradient="from-indigo-500/10 to-indigo-500/5"
          color="indigo" 
        />
      </motion.div>

      {/* Chart Section */}
      <motion.div variants={itemVars} className="bg-white rounded-[40px] p-8 border border-border/50 shadow-xl shadow-foreground/5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em]">Expense Breakdown</h3>
          <div className="p-2 rounded-lg bg-secondary/5 border border-secondary/10">
            <PieIcon className="w-4 h-4 text-secondary" />
          </div>
        </div>
        
        {!hasData ? (
          <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-20 h-20 rounded-3xl bg-secondary/5 flex items-center justify-center border border-secondary/10 rotate-12">
              <TrendingDown className="w-10 h-10 opacity-20 -rotate-12" />
            </div>
            <p className="text-sm font-bold opacity-60">No expenses recorded for this month</p>
          </div>
        ) : (
          <>
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={state.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={6}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    animationBegin={0}
                    animationDuration={1200}
                    stroke="none"
                  >
                    {state.categoryData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    content={<CustomTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Info */}
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">Total Spent</p>
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-black tracking-tighter text-foreground drop-shadow-sm">
                    {formatCurrency(state.totalExpense)}
                  </p>
                  <div className="w-12 h-1 bg-foreground/10 rounded-full mt-2" />
                </div>
              </div>
            </div>

            {/* Composition Bar */}
            <div className="mt-10 px-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Composition</span>
                <span className="text-[10px] font-bold text-muted-foreground">{state.categoryData.length} Categories</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-secondary/5 p-0.5 border border-secondary/5 box-content">
                {state.categoryData.map((cat: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                    style={{ backgroundColor: cat.color }}
                    className="h-full first:rounded-l-full last:rounded-r-full border-r-[2px] border-white last:border-0"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Category List */}
      <div className="flex flex-col gap-6">
        <motion.h3 variants={itemVars} className="text-[18px] font-black text-foreground px-1 tracking-tight">
          Categories Breakdown
        </motion.h3>
        <div className="flex flex-col gap-3.5">
          {state.categoryData.map((cat: any, i: number) => (
            <motion.div 
              key={cat.name}
              variants={itemVars}
              whileHover={{ x: 4 }}
              className="bg-white rounded-3xl p-5 border border-border/40 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white ring-4 ring-white shadow-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  <span className="text-xs font-black">{Math.round(cat.percentage)}%</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[15px] font-black text-foreground leading-tight mb-1">{cat.name}</p>
                  <p className="text-[11px] text-muted-foreground font-bold tracking-wider uppercase">
                    {cat.count} {cat.count === 1 ? 'Transaction' : 'Transactions'}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <p className="text-[16px] font-black text-foreground tracking-tighter">
                    {formatCurrency(cat.value)}
                  </p>
                  <div className="w-6 h-0.5 bg-border/40 rounded-full mt-1 group-hover:bg-primary/40 transition-colors" />
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({ label, value, icon: Icon, gradient, color }: any) {
  const accentColors: any = {
    emerald: "text-emerald-600 bg-emerald-500",
    rose: "text-rose-600 bg-rose-500",
    indigo: "text-indigo-600 bg-indigo-500"
  };

  return (
    <div className={cn(
      "rounded-[32px] p-5 border border-border/40 flex flex-col gap-4 shadow-sm relative overflow-hidden bg-white/50 backdrop-blur-sm group hover:border-foreground/10 transition-colors",
    )}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity group-hover:opacity-60", gradient)} />
      
      <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md relative z-10", accentColors[color])}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80 mb-1">{label}</p>
        <p className="text-[15px] font-black tracking-tighter text-foreground truncate">
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
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl border border-white/50 p-4 rounded-[24px] shadow-2xl relative z-50 ring-1 ring-black/5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: data.color }} />
            <p className="text-xs font-black text-foreground uppercase tracking-wider">{data.name}</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-black text-foreground tracking-tighter">{formatCurrency(data.value)}</p>
            <p className="text-[10px] font-bold text-muted-foreground/80 tracking-wide">
              {Math.round(data.percentage)}% of total monthly expenses
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  return null;
};
