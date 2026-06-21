"use client";
import React, { useEffect, useState } from "react";
import { GlassPanel } from "./GlassPanel";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "../lib/utils";

interface StatTileProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  accentColor?: "cyan" | "blue" | "purple" | "red" | "green" | "amber";
  className?: string;
  trend?: { value: number; label: string; positive?: boolean };
}

export function StatTile({ label, value, suffix = "", prefix = "", accentColor = "cyan", className, trend }: StatTileProps) {
  const springValue = useSpring(0, { bounce: 0, duration: 1500 });
  const displayValue = useTransform(springValue, (current) => Math.floor(current));

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <GlassPanel accentColor={accentColor} className={cn("flex flex-col gap-2 group hover:scale-[1.02]", className)}>
      <span className="text-sm text-white/50 font-medium tracking-wide uppercase">{label}</span>
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-2xl text-white/70">{prefix}</span>}
        <motion.span className="text-4xl font-light text-white tracking-tight tabular-nums">
          {displayValue}
        </motion.span>
        {suffix && <span className="text-xl text-white/50">{suffix}</span>}
      </div>
      {trend && (
        <div className="flex items-center gap-2 mt-2">
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", trend.positive ? "bg-green-500/10 text-[#2ED9A3]" : "bg-red-500/10 text-[#FF4D6D]")}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-white/40">{trend.label}</span>
        </div>
      )}
    </GlassPanel>
  );
}
