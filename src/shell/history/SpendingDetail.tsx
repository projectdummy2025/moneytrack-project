"use client";

import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Target,
  PieChart as PieIcon
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, TooltipContentProps } from "recharts";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { formatCurrency, cn } from "@core/utils/HelperTool";

interface CategoryData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  count: number;
}

interface SpendingDetailProps {
  state: {
    isLoading: boolean;
    categoryData: CategoryData[];
    monthName: string;
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
  };
  actions: {
    prevMonth: () => void;
    nextMonth: () => void;
  };
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
  const [activeIndex, setActiveIndex] = React.useState(-1);

  if (state.isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-12 bg-secondary/50 rounded-2xl w-full" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-secondary/50 rounded-3xl" />
          <div className="h-24 bg-secondary/50 rounded-3xl" />
          <div className="h-24 bg-secondary/50 rounded-3xl" />
        </div>
        <div className="h-[380px] bg-secondary/50 rounded-[40px]" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-secondary/50 rounded-2xl" />)}
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
      {/* Month Selector - Unified Card Switcher */}
      <motion.div 
        variants={itemVars} 
        className="bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center justify-between"
      >
        <button 
          onClick={actions.prevMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-secondary active:scale-95 transition-all text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] leading-none mb-1.5">Reporting Period</span>
          <h2 className="text-lg font-bold text-foreground leading-none">
            {state.monthName}
          </h2>
        </div>

        <button 
          onClick={actions.nextMonth}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-secondary active:scale-95 transition-all text-muted-foreground hover:text-foreground"
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
          gradient="from-[#35C2C1]/10 to-[#35C2C1]/5"
          color="teal" 
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
          gradient="from-blue-500/10 to-blue-500/5"
          color="blue" 
        />
      </motion.div>

      {/* Chart Section */}
      <motion.div variants={itemVars} className="flex flex-col relative w-full pt-2 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">Expense Distribution</h3>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Monthly Breakdown</p>
          </div>
          <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/50">
            <PieIcon className="w-5 h-5 text-accent" />
          </div>
        </div>

        {!hasData ? (
          <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center border border-border rotate-12">
              <TrendingDown className="w-10 h-10 opacity-20 -rotate-12" />
            </div>
            <p className="text-body-sm font-medium opacity-60">No expenses recorded for this month</p>
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
                    innerRadius={100}
                    outerRadius={115}
                    paddingAngle={6}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    animationBegin={0}
                    animationDuration={1200}
                    stroke="none"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                  >
                    {state.categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className={cn(
                          "transition-opacity cursor-pointer outline-none",
                          activeIndex === index ? "opacity-100" : (activeIndex === -1 ? "opacity-100" : "opacity-30")
                        )}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Info - Smart Toggle */}
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-[180px]">
                <AnimatePresence mode="wait">
                  {activeIndex === -1 ? (
                    <motion.div
                      key="total"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="flex flex-col items-center"
                    >
                      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-1.5">Total Spent</p>
                      <p className="text-[28px] font-black tracking-tighter text-foreground leading-none drop-shadow-sm">
                        {formatCurrency(state.totalExpense)}
                      </p>
                      <div className="w-12 h-1 bg-accent/20 rounded-full mt-3" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="category"
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.05, y: -5 }}
                      className="flex flex-col items-center"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mb-3 shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                        style={{ backgroundColor: state.categoryData[activeIndex].color }} 
                      />
                      <p className="text-[11px] font-bold text-foreground uppercase tracking-[0.1em] mb-1 line-clamp-1">
                        {state.categoryData[activeIndex].name}
                      </p>
                      <p className="text-[24px] font-black tracking-tighter text-foreground leading-none mb-2">
                        {formatCurrency(state.categoryData[activeIndex].value)}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        {Math.round(state.categoryData[activeIndex].percentage)}% Weight
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>


          </>
        )}
      </motion.div>

      {/* Category List */}
      <div className="flex flex-col gap-6">
        <motion.div variants={itemVars} className="flex flex-col">
          <h3 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">Categories</h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">Monthly Distribution</p>
        </motion.div>
        <div className="flex flex-col gap-3.5">
          {state.categoryData.map((cat) => (
            <motion.div
              key={cat.name}
              variants={itemVars}
              whileHover={{ x: 4 }}
              className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer relative"
            >
              <div className="flex flex-col">
                <p className="text-body font-bold tracking-tight text-foreground leading-tight mb-0.5">{cat.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  {cat.count} {cat.count === 1 ? 'Transaction' : 'Transactions'}
                </p>
              </div>

              <div className="text-right">
                <div className="flex flex-col items-end">
                  <p className="text-body-lg font-bold tracking-tighter text-foreground">
                    {formatCurrency(cat.value)}
                  </p>
                  <div className="w-6 h-0.5 bg-border rounded-full mt-1 group-hover:bg-accent/40 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  color: "teal" | "rose" | "blue";
}

function SummaryCard({ label, value, icon: Icon, gradient, color }: SummaryCardProps) {
  const accentColors = {
    teal: "text-white bg-[#35C2C1]",
    rose: "text-white bg-rose-500",
    blue: "text-white bg-blue-500"
  };

  return (
    <div className={cn(
      "rounded-3xl p-5 border border-border flex flex-col gap-4 shadow-sm relative overflow-hidden bg-card/50 backdrop-blur-sm group hover:border-foreground/10 transition-colors",
    )}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity group-hover:opacity-60", gradient)} />
      
      <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center shadow-md relative z-10", accentColors[color])}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="relative z-10">
        <p className="text-meta-2xs font-semibold uppercase text-muted-foreground mb-1">{label}</p>
        <p className="text-body font-bold tracking-tighter text-foreground truncate">
          {formatCurrency(Math.abs(value))}
        </p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryData;
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card/95 backdrop-blur-xl border border-border p-4 rounded-[24px] shadow-2xl relative z-50 ring-1 ring-black/5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: data.color }} />
            <p className="text-meta-xs font-semibold text-foreground uppercase">{data.name}</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-heading-lg font-black tracking-tighter text-foreground">{formatCurrency(data.value)}</p>
            <p className="text-meta-2xs font-medium text-muted-foreground">
              {Math.round(data.percentage)}% of monthly expenses
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  return null;
};
