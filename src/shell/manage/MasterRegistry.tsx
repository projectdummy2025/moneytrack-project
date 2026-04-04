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
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted/10 rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 ? (
        <div className="p-16 text-center text-muted-foreground bg-muted/20 rounded-[3rem] border border-dashed border-border/50">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No records found</p>
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-card border border-border/40 hover:border-primary/20 transition-all group cursor-pointer"
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all", 
        colorClass || "text-primary bg-primary/10 border border-primary/20"
      )}>
        <Icon className="w-5 h-5 stroke-[2.5px]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm tracking-tight mb-0.5 group-hover:text-primary transition-colors truncate">{title}</h4>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{subtitle}</p>
      </div>
      
      {value !== undefined && (
        <div className="text-right mr-2">
          <p className="font-black text-sm tracking-tighter text-foreground">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
        </div>
      )}
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button className="w-9 h-9 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all">
          <Edit3 className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-muted/50 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <ChevronRight className="w-4 h-4 text-muted-foreground/30 sm:hidden" />
    </motion.div>
  );
}
