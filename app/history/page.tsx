"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar as CalendarIcon,
  Utensils,
  ShoppingBag,
  Bus,
  Coffee,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";

const historyData = [
  {
    date: "Today, April 4",
    items: [
      { id: 1, title: "Starbucks Coffee", category: "Food & Drink", amount: "- Rp 55.000", time: "10:30 AM", type: "expense", icon: Coffee, color: "text-amber-500 bg-amber-50" },
      { id: 2, title: "Grab Ride", category: "Transportation", amount: "- Rp 22.000", time: "09:15 AM", type: "expense", icon: Bus, color: "text-blue-500 bg-blue-50" },
    ]
  },
  {
    date: "Yesterday, April 3",
    items: [
      { id: 3, title: "Freelance Project", category: "Income", amount: "+ Rp 2.500.000", time: "04:00 PM", type: "income", icon: ArrowUpRight, color: "text-emerald-500 bg-emerald-50" },
      { id: 4, title: "Indomaret", category: "Groceries", amount: "- Rp 125.000", time: "01:20 PM", type: "expense", icon: ShoppingBag, color: "text-indigo-500 bg-indigo-50" },
      { id: 5, title: "Warteg Pak Kumis", category: "Food & Drink", amount: "- Rp 25.000", time: "12:30 PM", type: "expense", icon: Utensils, color: "text-orange-500 bg-orange-50" },
    ]
  },
  {
    date: "April 2, 2026",
    items: [
      { id: 6, title: "Netflix Subscription", category: "Entertainment", amount: "- Rp 186.000", time: "11:00 PM", type: "expense", icon: MoreVertical, color: "text-red-500 bg-red-50" },
    ]
  }
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Search & Filter Bar */}
      <div className="flex gap-3 sticky top-4 z-40 sm:top-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-12 pr-4 py-4 rounded-[2rem] bg-card border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
        <button className="px-5 rounded-[2rem] bg-card border border-border/50 flex items-center justify-center hover:bg-muted/50 transition-all">
          <Filter className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Monthly Summary Mini Card */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[2rem] border border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Month Net</p>
          <p className="text-2xl font-black text-emerald-600">+ Rp 4.5M</p>
        </div>
        <div className="glass p-6 rounded-[2rem] border border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Trans. Count</p>
          <p className="text-2xl font-black text-slate-800">248</p>
        </div>
      </div>

      {/* Grouped History List */}
      <div className="flex flex-col gap-8 pb-8">
        {historyData.map((group, gIdx) => (
          <div key={group.date} className="flex flex-col gap-4">
            <h3 className="sticky top-20 sm:top-24 z-30 px-4 py-2 glass rounded-full self-start text-sm font-bold text-muted-foreground border border-border/30">
              {group.date}
            </h3>
            
            <div className="flex flex-col gap-3">
              {group.items.map((item, iIdx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (gIdx * 0.1) + (iIdx * 0.05) }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="flex items-center gap-4 p-5 rounded-[2rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base tracking-tight mb-0.5 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{item.category} • {item.time}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-black text-lg tracking-tight ${item.type === 'income' ? 'text-emerald-600' : 'text-slate-900 group-hover:text-red-600 transition-colors'}`}>
                      {item.amount}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Infinite Scroll Indicator Loader */}
      <div className="flex items-center justify-center py-8">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <div className="w-4" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <div className="w-4" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      </div>
    </div>
  );
}
