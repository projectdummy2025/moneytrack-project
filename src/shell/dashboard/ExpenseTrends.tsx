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
      <div className="bg-white rounded-[24px] p-6 border border-[#e8ecf4] animate-pulse">
        <div className="h-6 w-32 bg-muted rounded-md mb-6" />
        <div className="h-40 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#e8ecf4] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-extrabold text-[#1e232c]">Expense Chart</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e8ecf4] bg-[#f7f8f9] text-[12px] font-bold text-[#8391a1]">
          Weekly
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="#8391a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#8391a1", fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#8391a1", fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => formatCompactNumber(value)}
              width={35}
            />
            <Tooltip 
              formatter={(value: number) => [formatCompactNumber(value), "Amount"]}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #e8ecf4',
                fontFamily: 'Urbanist, sans-serif',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#35c2c1"
              strokeWidth={3}
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
