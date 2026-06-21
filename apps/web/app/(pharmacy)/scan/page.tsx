"use client";
import React, { useState } from "react";
import { QRScanner } from "../../../components/QRScanner";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [scanState, setScanState] = useState<"scanning" | "verifying" | "success" | "error">("scanning");

  const [verificationData, setVerificationData] = useState<any>(null);

  const handleScan = async (token: string) => {
    setScanState("verifying");

    if (token.startsWith("mock-")) {
      // Simulate network delay and return random dynamic data
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% chance of success
        if (isSuccess) {
          const mockHash = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 10);
          setVerificationData({ status: "Verified", payload: { signature: mockHash } });
          setScanState("success");
        } else {
          setVerificationData({ status: "Fraudulent", reason: "Invalid cryptographic signature or tampered payload." });
          setScanState("error");
        }
      }, 1500);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/prescriptions/verify/${encodeURIComponent(token)}`);
      const data = await res.json();
      
      if (!res.ok) {
        setVerificationData(data);
        setScanState("error");
        return;
      }
      setVerificationData(data);
      setScanState("success");
    } catch (e) {
      setScanState("error");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen flex flex-col items-center justify-center">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-light tracking-tight text-white mb-2">Cryptographic Scanner</h1>
        <p className="text-white/50 text-lg">Verify prescription authenticity via signed QR token.</p>
      </div>

      <AnimatePresence mode="wait">
        {scanState === "scanning" && (
          <motion.div key="scan" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md">
            <GlassPanel className="p-8 pb-12 flex flex-col items-center justify-center border-dashed border-white/20">
               <QRScanner onScan={handleScan} />
            </GlassPanel>
          </motion.div>
        )}

        {scanState === "verifying" && (
          <motion.div key="verifying" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md">
            <GlassPanel accentColor="blue" className="p-12 text-center flex flex-col items-center justify-center">
               <div className="relative w-24 h-24 mb-6">
                 <motion.div 
                   animate={{ rotate: 360 }} 
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#2E6FFF]" 
                 />
                 <motion.div 
                   animate={{ rotate: -360 }} 
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#2E6FFF]/50" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <ShieldCheck className="w-8 h-8 text-[#2E6FFF] animate-pulse" />
                 </div>
               </div>
               <h3 className="text-xl font-medium text-white mb-2">Verifying Cryptographic Signature</h3>
               <p className="text-sm text-white/50 font-mono">Checking against HealthMesh Network...</p>
            </GlassPanel>
          </motion.div>
        )}

        {scanState === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
            <GlassPanel accentColor="green" className="p-10 text-center flex flex-col items-center border-[#2ED9A3]/30 shadow-[0_0_50px_rgba(46,217,163,0.15)]">
               <div className="w-20 h-20 rounded-full bg-[#2ED9A3]/10 flex items-center justify-center mb-6 border border-[#2ED9A3]/30">
                 <ShieldCheck className="w-10 h-10 text-[#2ED9A3]" />
               </div>
               <h2 className="text-2xl font-medium text-white mb-2">Signature Verified</h2>
               <div className="bg-black/40 px-4 py-2 rounded border border-white/10 mb-8 inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                 <p className="text-xs text-[#2ED9A3] font-mono">Hash: {verificationData?.payload?.signature || "0x9f86d081...a3bf4f1b"}</p>
               </div>
               <p className="text-white/60 mb-8">
                 The prescription capsule is cryptographically valid and has not been tampered with. It was signed by a verified provider.
               </p>
               
               <button 
                 onClick={() => router.push('/dispense')}
                 className="w-full py-4 bg-[#2ED9A3] text-black font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
               >
                 Proceed to Fulfillment <ArrowRight className="w-4 h-4" />
               </button>
            </GlassPanel>
          </motion.div>
        )}

        {scanState === "error" && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
            <GlassPanel accentColor={verificationData?.status === "Fraudulent" ? "red" : "amber"} className="p-10 text-center flex flex-col items-center border-[#FF4D6D]/30 shadow-[0_0_50px_rgba(255,77,109,0.15)]">
               <div className="w-20 h-20 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center mb-6 border border-[#FF4D6D]/30">
                 <ShieldAlert className="w-10 h-10 text-[#FF4D6D]" />
               </div>
               <h2 className="text-2xl font-medium text-[#FF4D6D] mb-2">{verificationData?.status || "Verification Failed"}</h2>
               <div className="bg-black/40 px-4 py-2 rounded border border-[#FF4D6D]/20 mb-8 inline-block">
                 <p className="text-xs text-[#FF4D6D] font-mono">Reason: {verificationData?.reason || "Invalid cryptographic signature or tampered payload."}</p>
               </div>
               <p className="text-white/60 mb-8">
                 This prescription cannot be verified. Do not dispense. This event has been logged to the network audit trail.
               </p>
               
               <button 
                 onClick={() => setScanState("scanning")}
                 className="w-full py-4 bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/50 font-medium rounded-xl hover:bg-[#FF4D6D]/30 transition-colors flex items-center justify-center gap-2"
               >
                 Scan Another <ArrowRight className="w-4 h-4" />
               </button>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
