"use client";

import React from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
      <div className="bg-white rounded-[24px] p-6 border border-[#e8ecf4] animate-pulse">
        <div className="h-6 w-32 bg-muted rounded-md mb-6" />
        <div className="h-48 w-48 bg-muted rounded-full mx-auto" />
      </div>
    );
  }

  const hasData = data.length > 0;

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#e8ecf4] shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[16px] font-extrabold text-[#1e232c]">Monthly Expenses</h3>
        <Link href="/history/stats" className="text-[13px] font-bold text-[#8391a1] hover:text-accent transition-colors">See All</Link>
      </div>

      {!hasData ? (
        <div className="h-[200px] flex items-center justify-center text-[#8391a1] italic text-sm">
          No expense data yet
        </div>
      ) : (
        <>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    borderRadius: '12px', 
                    border: '1px solid #e8ecf4',
                    fontFamily: 'Urbanist, sans-serif',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {data.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-[#1e232c] text-[12px] font-bold truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
