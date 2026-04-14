"use client";

import React from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@core/utils/HelperTool";

interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

interface MonthlyOverviewProps {
  data: CategoryStat[];
  isLoading?: boolean;
}

export function MonthlyOverview({ data, isLoading }: MonthlyOverviewProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-[24px] p-6 animate-pulse border border-border">
        <div className="h-6 w-32 bg-secondary rounded-md mb-6" />
        <div className="h-48 w-48 bg-secondary rounded-full mx-auto" />
      </div>
    );
  }

  const hasData = data.length > 0;
  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card relative rounded-2xl shrink-0 w-full overflow-hidden border border-border shadow-sm">
      <div className="content-stretch flex flex-col gap-[25px] items-center px-[20px] py-[20px] relative w-full">
        {/* Title Row */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <p className="text-heading-sm font-extrabold text-foreground whitespace-nowrap">Categories</p>
          <Link href="/history/stats" className="bg-[#35C2C1]/10 content-stretch flex items-center px-4 py-2 relative rounded-xl shrink-0">
            <p className="text-meta font-semibold text-[#35C2C1]">Statistics</p>
          </Link>
        </div>

        {/* Donut Chart with Center Text */}
        {!hasData ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground/30 italic text-sm font-bold">
            No expense data yet
          </div>
        ) : (
          <div className="relative size-[197px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={82}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-meta-2xs font-semibold text-muted-foreground uppercase">Expense</p>
              <p className="text-heading font-bold text-foreground">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        )}

        {/* Category Carousel - Horizontal Scroll of Cards */}
        <div className="w-full mt-4 -mx-5 px-5 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2">
          {data.slice(0, 5).map((item) => (
            <div 
              key={item.name} 
              className="flex-none w-[115px] h-[85px] snap-center flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-border/50 bg-secondary/20 transition-transform active:scale-95"
            >
              <div className="shrink-0 size-1.5 rounded-full" style={{ background: item.color }} />
              <p className="text-meta-2xs font-extrabold text-muted-foreground uppercase tracking-tight truncate w-full text-center">
                {item.name}
              </p>
              <p className="text-meta-xs font-black text-foreground" style={{ color: item.color }}>
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
          
          {/* Subtle indicator that more items might exist (optional link) */}
          <Link 
            href="/history/stats"
            className="flex-none w-[100px] h-[85px] snap-center flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors"
          >
            <p className="text-meta-xs font-black text-accent uppercase tracking-wider text-center">
              All Info
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
