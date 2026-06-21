"use client";
import React from "react";
import { cn } from "../lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  accentColor?: "cyan" | "blue" | "purple" | "red" | "green" | "amber";
  children: React.ReactNode;
  variant?: "panel" | "lens";
}

const accentMap = {
  cyan: "border-[#38B2AC]/25 shadow-[0_0_30px_rgba(56,178,172,0.08)]",
  blue: "border-[#3182CE]/25 shadow-[0_0_30px_rgba(49,130,206,0.08)]",
  purple: "border-[#805AD5]/25 shadow-[0_0_30px_rgba(128,90,213,0.08)]",
  red: "border-[#E53E3E]/25 shadow-[0_0_30px_rgba(229,62,62,0.08)]",
  green: "border-[#48BB78]/25 shadow-[0_0_30px_rgba(72,187,120,0.08)]",
  amber: "border-[#ED8936]/25 shadow-[0_0_30px_rgba(237,137,54,0.08)]",
};

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, accentColor, variant = "panel", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          variant === "lens" ? "glass-lens" : "glass-panel",
          "p-6 relative overflow-hidden transition-all duration-500",
          accentColor && accentMap[accentColor],
          className
        )}
        {...props}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        {accentColor && (
          <div
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${
                accentColor === "cyan"
                  ? "rgba(56,178,172,0.15)"
                  : accentColor === "blue"
                    ? "rgba(49,130,206,0.15)"
                    : accentColor === "purple"
                      ? "rgba(128,90,213,0.15)"
                      : accentColor === "red"
                        ? "rgba(229,62,62,0.15)"
                        : accentColor === "green"
                          ? "rgba(72,187,120,0.15)"
                          : "rgba(237,137,54,0.15)"
              } 0%, transparent 70%)`,
            }}
          />
        )}
        <div className="relative z-10 h-full w-full flex flex-col flex-1">{children}</div>
      </motion.div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";
