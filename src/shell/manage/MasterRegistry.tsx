"use client";

import React from "react";
import { ChevronRight, Trash2, Edit3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@core/utils/HelperTool";

interface ManagementItemProps {
  id?: string;
  title: string;
  subtitle: string;
  value?: string | number;
  icon?: React.ElementType | string;
  icon_name?: string;
  colorClass?: string;
  delay?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MasterRegistry({
  items,
  isLoading,
  onEdit,
  onDelete,
}: {
  items: ManagementItemProps[],
  isLoading?: boolean,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 font-['Urbanist',sans-serif]">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-['Urbanist',sans-serif]">
      {items.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground bg-secondary/50 rounded-2xl border border-dashed border-border">
          <p className="text-body-sm font-medium italic opacity-50">No items added yet</p>
        </div>
      ) : (
        items.map((item, idx) => (
          <ManagementItem
            key={item.id || idx}
            {...item}
            onEdit={onEdit ? () => onEdit(item.id!) : undefined}
            onDelete={onDelete ? () => onDelete(item.id!) : undefined}
          />
        ))
      )}
    </div>
  );
}

function ManagementItem({ title, subtitle, value, colorClass, delay = 0, onEdit, onDelete }: ManagementItemProps) {
  // Extract background/text color classes or use safe fallbacks for clean dot
  const isIncome = subtitle.toLowerCase().includes("income");
  const isExpense = subtitle.toLowerCase().includes("expense");
  const dotColorClass = colorClass 
    ? colorClass.includes("text-") ? colorClass.split(" ")[0].replace("text-", "bg-") : "bg-[#35C2C1]"
    : isIncome ? "bg-[#35C2C1]" : isExpense ? "bg-rose-500" : "bg-blue-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEdit?.()}
      className="flex items-center justify-between p-5 cursor-pointer bg-card rounded-2xl border border-border/40 transition-all select-none hover:border-[#35C2C1]/30 active:bg-secondary/40"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Sleek Dot Indicator instead of bulky square boxes */}
        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", dotColorClass)} />

        <div className="flex flex-col min-w-0">
          <h4 className="text-body font-black tracking-tight text-foreground truncate">{title}</h4>
          <p className="text-meta-xs font-black text-muted-foreground/60 uppercase tracking-wider mt-0.5">{subtitle}</p>
        </div>
      </div>
 
      <div className="flex items-center gap-3">
        {value !== undefined && (
          <div className="text-right">
            <p className="text-body font-black tracking-tight text-foreground">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </p>
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
      </div>
    </motion.div>
  );
}
