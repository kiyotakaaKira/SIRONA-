"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { EmergencyBanner } from "../../components/EmergencyBanner";
import { ContinuityCapsule } from "../../components/ContinuityCapsule";
import { ContinuityCapsuleProvider } from "../../contexts/ContinuityCapsuleContext";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { PatientChatbot } from "../../components/PatientChatbot";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ContinuityCapsuleProvider>
      {/* Root layout already mounts bg-mesh-animated — no duplicate here */}
      <div className="flex min-h-screen w-full bg-[#05070A] relative font-sans">
        <EmergencyBanner />
        {/*
          Bug 1 fix: removed overflow-hidden from this wrapper.
          overflow-hidden created a CSS clip boundary that hid page content
          during framer-motion translateY entrance animations.
          Bug 2 fix: removed mode="wait" from AnimatePresence.
          mode="wait" withheld the incoming page from the DOM until the
          exiting page finished its animation, producing a blank-screen window
          on cross-route-group navigation.
        */}
        <div className="flex-1 flex flex-col pl-[80px]">
          <main className="flex-1 relative overflow-y-auto">
            <Breadcrumbs />
            <AnimatePresence>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <ContinuityCapsule />
          <PatientChatbot />
        </div>
      </div>
    </ContinuityCapsuleProvider>
  );
}

