"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  Plus,
  BarChart2,
  Settings,
} from "lucide-react";
import { cn } from "@core/utils/HelperTool";
import { motion } from "framer-motion";
import { useDashBrain } from "@core/hooks/DashBrain";

export function NavSider() {
  const pathname = usePathname();
  const brain = useDashBrain();

  // Left side of the center [+] button
  const leftNavItems = [
    { icon: Home,   label: "Home",    href: "/" },
    { icon: Wallet, label: "Wallets", href: "/wallets" },
  ];

  // Right side of the center [+] button
  const rightNavItems = [
    { icon: BarChart2, label: "Reports",  href: "/reports" },
    { icon: Settings,  label: "Settings", href: "/settings" },
  ];

  return (
    <div className="shrink-0 w-full bg-background/95 backdrop-blur-[8px] border-t border-border relative h-[83px]">
      <div className="absolute inset-0 flex items-center pb-[5px] px-[5px]">
        {/* Left side: Home + Wallets */}
        {leftNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center h-full"
            >
              <item.icon
                className={cn(
                  "size-[22px] transition-colors",
                  isActive ? "text-[#35C2C1]" : "text-muted-foreground/60"
                )}
              />
            </Link>
          );
        })}

        {/* Add Button (center) */}
        <div className="flex flex-1 items-center justify-center h-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => brain.actions.setIsDrawerOpen(true)}
            className="bg-[#35C2C1] flex items-center justify-center rounded-full shrink-0 size-11 cursor-pointer shadow-[0_4px_15px_rgba(53,194,193,0.35)]"
          >
            <Plus className="size-5 text-white stroke-[2.5px]" />
          </motion.button>
        </div>

        {/* Right side: Reports + Settings */}
        {rightNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center h-full"
            >
              <item.icon
                className={cn(
                  "size-[22px] transition-colors",
                  isActive ? "text-[#35C2C1]" : "text-muted-foreground/60"
                )}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
