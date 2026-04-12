"use client";

import React from "react";
import { ChevronRight, Trash2, Edit3, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@core/utils/HelperTool";

interface ManagementItemProps {
  id?: string;
  title: string;
  subtitle: string;
  value?: string | number;
  icon: LucideIcon;
  colorClass?: string;
  delay: number;
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
        <div className="py-16 text-center text-muted-foreground bg-secondary/50 rounded-3xl border border-dashed border-border">
          <p className="text-sm font-medium italic opacity-50">No items added yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-3xl border border-border divide-y divide-border/50 shadow-sm shadow-black/5 overflow-hidden">
          {items.map((item, idx) => (
            <ManagementItem
              key={item.id || idx}
              {...item}
              onEdit={onEdit ? () => onEdit(item.id!) : undefined}
              onDelete={onDelete ? () => onDelete(item.id!) : undefined}
            />
          ))}
        </div>
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
  delay,
  onEdit,
  onDelete,
}: ManagementItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="flex items-center gap-4 p-4 cursor-pointer transition-colors group"
    >
      <div className={cn(
        "w-11 h-11 rounded-2xl flex items-center justify-center transition-all border border-border/50",
        colorClass || "text-primary bg-secondary"
      )}>
        <Icon className="w-5 h-5 stroke-[2px]" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[14px] tracking-tight text-foreground truncate">{title}</h4>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{subtitle}</p>
      </div>

      {value !== undefined && (
        <div className="text-right">
          <p className="font-bold text-[14px] tracking-tight text-foreground">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
        </div>
      )}

      <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all">
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-primary flex items-center justify-center transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-rose-500 flex items-center justify-center transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/30 ml-1" />
    </motion.div>
  );
}
