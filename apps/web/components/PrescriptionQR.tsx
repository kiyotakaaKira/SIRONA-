"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@healthmesh/ui";
import { ScanLine, CheckCircle, AlertTriangle } from "lucide-react";

export function PrescriptionQR() {
  const [status, setStatus] = useState<"scanning" | "verifying" | "verified">("scanning");

  useEffect(() => {
    if (status === "scanning") {
      const t = setTimeout(() => setStatus("verifying"), 2000);
      return () => clearTimeout(t);
    }
    if (status === "verifying") {
      const t = setTimeout(() => setStatus("verified"), 2000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <div className="w-full max-w-md mx-auto">
      <GlassPanel accentColor={status === "verified" ? "green" : "blue"} className="flex flex-col items-center justify-center p-12 relative overflow-hidden">
        
        {/* Scanner line animation */}
        {status !== "verified" && (
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-[#2E6FFF] shadow-[0_0_20px_rgba(46,111,255,0.8)] z-10 opacity-50" 
          />
        )}

        <div className="relative w-48 h-48 mb-8">
          {/* QR Box Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20" />
          
          <div className="absolute inset-4 bg-white/5 flex items-center justify-center border border-white/10 rounded-lg overflow-hidden">
             {status === "verified" ? (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                 <CheckCircle className="w-20 h-20 text-[#2ED9A3]" />
               </motion.div>
             ) : (
               <ScanLine className="w-16 h-16 text-white/20" />
             )}
          </div>
        </div>

        <div className="text-center h-20">
          {status === "scanning" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-medium text-white animate-pulse">Scanning Capsule...</h3>
              <p className="text-sm text-white/40 mt-1">Align QR code within the frame.</p>
            </motion.div>
          )}
          
          {status === "verifying" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-medium text-[#2E6FFF] animate-pulse">Verifying Signature...</h3>
              <p className="text-sm text-white/40 font-mono mt-1 text-[10px]">HASH: 0x9f86d081884c7d659...</p>
            </motion.div>
          )}

          {status === "verified" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-xl font-medium text-[#2ED9A3]">Authentic Prescription</h3>
              <div className="flex gap-4 mt-2 justify-center">
                <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">Dr. Sarah Jenkins</span>
                <span className="text-xs text-[#2ED9A3] bg-[#2ED9A3]/10 border border-[#2ED9A3]/20 px-2 py-1 rounded">Trust Score: 99%</span>
              </div>
            </motion.div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
