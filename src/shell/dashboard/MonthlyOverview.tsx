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

        {/* Category Legend - 2 Column Grid of Pills */}
        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          {data.slice(0, data.length > 5 ? 4 : 5).map((item) => (
            <div 
              key={item.name} 
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-border/50 bg-secondary/10 transition-transform active:scale-95 min-w-0"
            >
              <div className="shrink-0 size-2 rounded-full" style={{ background: item.color }} />
              <div className="flex flex-col leading-none min-w-0">
                <p className="text-meta-2xs font-bold text-foreground/80 mb-0.5 truncate uppercase tracking-tighter">
                  {item.name}
                </p>
                <p className="text-meta-xs font-black" style={{ color: item.color }}>
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          ))}
          
          {data.length > 5 && (
            <Link 
              href="/history/stats"
              className="flex items-center justify-center px-3 py-2 rounded-full border border-dashed border-accent/40 bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              <p className="text-meta-xs font-black text-accent uppercase tracking-wider">
                +{data.length - 4} More
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
