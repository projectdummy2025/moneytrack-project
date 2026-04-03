"use client";

import React from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Utensils, 
  ShoppingBag, 
  Bus, 
  Coffee,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { BalanceCard } from "@/components/dashboard/Overview";

const activities = [
  { id: 1, title: "Breakfast", icon: Coffee, category: "Food & Drink", amount: "- Rp 35.000", time: "08:15 AM", type: "expense", color: "text-amber-500 bg-amber-50" },
  { id: 2, title: "Salary Deposit", icon: ArrowUpRight, category: "Income", amount: "+ Rp 8.000.000", time: "Yesterday", type: "income", color: "text-emerald-500 bg-emerald-50" },
  { id: 3, title: "Gasoline", icon: Bus, category: "Transportation", amount: "- Rp 150.000", time: "2 days ago", type: "expense", color: "text-blue-500 bg-blue-50" },
  { id: 4, title: "Supermarket", icon: ShoppingBag, category: "Groceries", amount: "- Rp 425.000", time: "3 days ago", type: "expense", color: "text-indigo-500 bg-indigo-50" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Overview Section */}
      <BalanceCard />

      {/* 2. Recent Activities Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
          <button className="flex items-center gap-1 text-muted-foreground font-medium text-sm hover:text-foreground transition-colors group">
            Filter <Filter className="w-4 h-4 transition-transform group-hover:rotate-180" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-4 p-5 rounded-[2rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform`}>
                <activity.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base tracking-tight mb-0.5">{activity.title}</h4>
                <p className="text-xs text-muted-foreground font-medium">{activity.category} • {activity.time}</p>
              </div>
              
              <div className="text-right flex flex-col items-end gap-1">
                <p className={`font-extrabold text-lg tracking-tight ${activity.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {activity.amount}
                </p>
                <div className={`w-1.5 h-1.5 rounded-full ${activity.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </div>
            </motion.div>
          ))}
        </div>
        
        <button className="w-full mt-2 py-4 rounded-[2rem] border border-dashed border-border text-muted-foreground font-bold hover:bg-muted/50 hover:text-foreground transition-all">
          View All Transactions
        </button>
      </div>

      {/* Floating Add Button for Mobile - duplicated logic to ensure visual continuity */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className="sm:hidden fixed bottom-24 right-6 z-40 bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/40"
      >
        <Plus className="w-6 h-6 stroke-[3px]" />
      </motion.button>
    </div>
  );
}
