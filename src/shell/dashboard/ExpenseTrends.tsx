"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCompactNumber } from "@core/utils/HelperTool";

interface DailyStat {
  day: string;
  amount: number;
}

interface ExpenseTrendsProps {
  data: DailyStat[];
  isLoading?: boolean;
}

export function ExpenseTrends({ data, isLoading }: ExpenseTrendsProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-[24px] p-6 border border-border animate-pulse shadow-sm">
        <div className="h-6 w-32 bg-secondary rounded-md mb-6" />
        <div className="h-40 w-full bg-secondary rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-body-lg font-extrabold text-foreground">Expense Chart</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-secondary text-meta-2xs font-semibold text-muted-foreground uppercase">
          Weekly
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="h-[180px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#35c2c1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#35c2c1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 800 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 800 }}
              tickFormatter={(value) => formatCompactNumber(value)}
              width={35}
            />
            <Tooltip
              formatter={(value) => [formatCompactNumber(Number(value)), "Amount"]}
              contentStyle={{
                borderRadius: '16px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
                fontFamily: 'Urbanist, sans-serif',
                fontSize: '11px',
                fontWeight: '800'
              }}
              itemStyle={{ color: '#35c2c1' }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#35c2c1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorAmount)"
              dot={{ r: 4, fill: "#35c2c1", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#35c2c1", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
