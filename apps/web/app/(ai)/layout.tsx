"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function AILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // pl-20 accounts for the collapsed GlobalSidebar (80px wide, fixed left-0)
    <div className="flex min-h-screen w-full bg-[#05070A] pl-20">
      <main className="flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
