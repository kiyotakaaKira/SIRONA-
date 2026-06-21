"use client";
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@healthmesh/ui";

type Accent = "cyan" | "blue" | "purple" | "red" | "green" | "amber";

const accentStyles: Record<Accent, { ring: string; icon: string; glow: string }> = {
  cyan: {
    ring: "border-[#29F0E0]/40 shadow-[0_0_24px_rgba(41,240,224,0.2)]",
    icon: "text-[#29F0E0]",
    glow: "bg-[#29F0E0]/15",
  },
  blue: {
    ring: "border-[#2E6FFF]/40 shadow-[0_0_24px_rgba(46,111,255,0.2)]",
    icon: "text-[#2E6FFF]",
    glow: "bg-[#2E6FFF]/15",
  },
  purple: {
    ring: "border-[#8B5CF6]/40 shadow-[0_0_24px_rgba(139,92,246,0.2)]",
    icon: "text-[#8B5CF6]",
    glow: "bg-[#8B5CF6]/15",
  },
  red: {
    ring: "border-[#FF4D6D]/40 shadow-[0_0_24px_rgba(255,77,109,0.2)]",
    icon: "text-[#FF4D6D]",
    glow: "bg-[#FF4D6D]/15",
  },
  green: {
    ring: "border-[#2ED9A3]/40 shadow-[0_0_24px_rgba(46,217,163,0.2)]",
    icon: "text-[#2ED9A3]",
    glow: "bg-[#2ED9A3]/15",
  },
  amber: {
    ring: "border-[#F59E0B]/40 shadow-[0_0_24px_rgba(245,158,11,0.2)]",
    icon: "text-[#F59E0B]",
    glow: "bg-[#F59E0B]/15",
  },
};

interface OrbitalModuleProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  accent: Accent;
  delay?: number;
  onClick?: () => void;
  className?: string;
  pulse?: boolean;
}

export function OrbitalModule({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  delay = 0,
  onClick,
  className,
  pulse,
}: OrbitalModuleProps) {
  const styles = accentStyles[accent];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "glass-lens rounded-2xl p-4 text-left w-[200px] cursor-pointer group",
        styles.ring,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            styles.glow,
            pulse && "animate-pulse"
          )}
        >
          <Icon className={cn("w-5 h-5", styles.icon)} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 mb-0.5">{label}</p>
          <p className="text-sm font-medium text-white truncate">{value}</p>
          {sub && <p className="text-[11px] text-white/40 mt-0.5 font-mono truncate">{sub}</p>}
        </div>
      </div>
    </motion.button>
  );
}
