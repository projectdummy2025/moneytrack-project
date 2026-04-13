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
          <p className="text-sm font-medium italic opacity-50">No items added yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border divide-y divide-border/50 shadow-sm shadow-black/5 overflow-hidden">
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

function ManagementItem({ title, subtitle, value, icon: Icon, colorClass, delay = 0, onEdit, onDelete }: ManagementItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="flex items-center gap-4 p-4 cursor-pointer transition-colors group relative"
    >
      <div className={cn(
        "w-11 h-11 rounded-2xl flex items-center justify-center transition-all border border-border/50",
        colorClass || "text-primary bg-secondary"
      )}>
        {Icon && typeof Icon !== 'string' ? (
          <Icon className="w-5 h-5 stroke-[2px]" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-muted-foreground/20" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-body-sm font-bold tracking-tight text-foreground truncate">{title}</h4>
        <p className="text-meta-xs font-medium text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      {value !== undefined && (
        <div className="text-right">
          <p className="text-body-sm font-bold tracking-tight text-foreground">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
        </div>
      )}

      {/* Action overlay: Absolute positioning keeps the content flow symmetric */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all bg-card/80 backdrop-blur-sm pl-4 pr-1 py-1 rounded-xl">
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
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 ml-1" />
      </div>

      {/* Fixed Chevron placeholder when not hovered to maintain some visual hint if desired, 
          but for maximum balance we keep it hidden or absolute as above. 
          Here I've moved the original chevron into the absolute group. */}
    </motion.div>
  );
}
