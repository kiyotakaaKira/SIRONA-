"use client";
import React from "react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

interface CommandRailProps {
  items: NavItem[];
  className?: string;
  onNavigate?: (href: string) => void;
}

export function CommandRail({ items, className, onNavigate }: CommandRailProps) {
  return (
    <div className={cn("w-20 flex flex-col items-center py-8 gap-8 border-r border-white/5 bg-white/5 backdrop-blur-[24px] h-screen fixed left-0 top-0 z-50", className)}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#29F0E0] to-[#2E6FFF] shadow-[0_0_20px_rgba(41,240,224,0.3)] mb-4 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
        <span className="text-black font-bold text-lg leading-none">HM</span>
      </div>
      
      <nav className="flex flex-col gap-4 w-full">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className="relative flex justify-center w-full group cursor-pointer"
            onClick={() => onNavigate && onNavigate(item.href)}
          >
            {item.isActive && (
              <motion.div 
                layoutId="active-rail-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#29F0E0] rounded-r-full shadow-[0_0_10px_rgba(41,240,224,0.5)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              item.isActive ? "bg-white/10 text-[#29F0E0]" : "text-white/40 group-hover:text-white group-hover:bg-white/5"
            )}>
              <item.icon className="w-6 h-6" strokeWidth={item.isActive ? 2.5 : 1.5} />
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
