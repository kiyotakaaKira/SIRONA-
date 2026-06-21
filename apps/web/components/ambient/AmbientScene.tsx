"use client";
import React from "react";
import { motion } from "framer-motion";

interface AmbientSceneProps {
  variant?: "default" | "consent" | "continuity";
  className?: string;
}

export function AmbientScene({ variant = "default", className }: AmbientSceneProps) {
  const tint =
    variant === "consent"
      ? "rgba(46, 111, 255, 0.06)"
      : variant === "continuity"
        ? "rgba(46, 217, 163, 0.06)"
        : "rgba(41, 240, 224, 0.05)";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <div className="bg-grid absolute inset-0 opacity-[0.06]" />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${tint} 0%, transparent 70%)`,
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + i * 15}%`}
            y1="0%"
            x2={`${50 + i * 8}%`}
            y2="100%"
            stroke="url(#neural-gradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#29F0E0" stopOpacity="0" />
            <stop offset="50%" stopColor="#2E6FFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#29F0E0" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#29F0E0]"
          style={{
            left: `${8 + ((i * 17) % 85)}%`,
            top: `${12 + ((i * 23) % 76)}%`,
            boxShadow: "0 0 8px rgba(41,240,224,0.6)",
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
