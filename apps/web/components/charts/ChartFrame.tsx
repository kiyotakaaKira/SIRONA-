"use client";

import React from "react";

export function useChartMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function ChartPlaceholder({ className = "h-full min-h-[300px]" }: { className?: string }) {
  return (
    <div className={`w-full rounded-xl border border-white/5 bg-white/[0.03] ${className}`} />
  );
}
