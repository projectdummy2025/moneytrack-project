"use client";

import React from "react";
import { ChevronRight, Trash2, Edit3, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@core/utils/HelperTool";

interface ManagementItemProps {
  title: string;
  subtitle: string;
  value?: string | number;
  icon: LucideIcon;
  colorClass?: string;
  delay: number;
}

export function MasterRegistry({ 
  items, 
  isLoading 
}: { 
  items: ManagementItemProps[], 
  isLoading?: boolean 
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground bg-card rounded-[2.5rem] border border-dashed border-border/50 font-bold">
          No items found.
        </div>
      ) : (
        items.map((item, idx) => (
          <ManagementItem 
            key={idx}
            {...item}
          />
        ))
      )}
    </div>
  );
}

function ManagementItem({ 
  title, 
  subtitle, 
  value, 
  icon: Icon, 
  colorClass, 
  delay 
}: ManagementItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", 
        colorClass || "text-primary bg-primary/10"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-lg tracking-tight mb-0.5 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{subtitle}</p>
      </div>
      
      {value !== undefined && (
        <div className="text-right mr-4">
          <p className="font-black text-lg tracking-tight text-slate-900">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
        </div>
      )}
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
          <Edit3 className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors sm:hidden" />
    </motion.div>
  );
}
