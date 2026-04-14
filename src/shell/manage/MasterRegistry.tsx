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

function ManagementItem({ title, subtitle, value, icon: Icon, colorClass, delay = 0, onEdit, onDelete }: ManagementItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98, backgroundColor: "rgba(0,0,0,0.02)" }}
      onClick={() => onEdit?.()}
      className="flex items-center gap-4 p-5 cursor-pointer bg-card rounded-3xl border border-border shadow-sm shadow-black/[0.02] transition-all group relative hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
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

      <div className="flex items-center gap-3">
        {value !== undefined && (
          <div className="text-right">
            <p className="text-body-sm font-bold tracking-tight text-foreground">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </p>
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
      </div>
    </motion.div>
  );
}
