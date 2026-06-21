"use client";
import React, { useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyBanner() {
  const [visible, setVisible] = useState(true);

  // In a real app, this reads from Supabase realtime to see if there is a recent 'emergency_override'
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="absolute top-0 left-0 right-0 z-50 bg-[#FF4D6D] text-white p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <p className="text-sm font-medium">
              <span className="font-bold">SECURITY ALERT:</span> A Break-Glass Emergency Override was executed on your Vault 2 hours ago by General Hospital. 
              <button className="ml-2 underline font-bold hover:text-black transition-colors">Review Audit Log</button>
            </p>
          </div>
          <button onClick={() => setVisible(false)} className="hover:bg-black/20 p-1 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
