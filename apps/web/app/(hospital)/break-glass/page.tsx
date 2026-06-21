"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, Fingerprint, LockOpen, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BreakGlassPage() {
  const [patientId, setPatientId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "authenticating" | "breaching" | "success">("idle");
  const router = useRouter();

  const handleTrigger = () => {
    setStatus("authenticating");
    setTimeout(() => setStatus("breaching"), 2500);
    setTimeout(() => setStatus("success"), 5500);
  };

  return (
    <div className="p-6 md:p-10 max-w-[800px] mx-auto min-h-screen flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center mx-auto mb-6 border-2 border-[#FF4D6D]/30 shadow-[0_0_30px_rgba(255,77,109,0.3)]">
                <AlertTriangle className="w-10 h-10 text-[#FF4D6D]" />
              </div>
              <h1 className="text-5xl font-light tracking-tight text-white mb-4">Break-Glass Protocol</h1>
              <p className="text-[#FF4D6D] text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                WARNING: You are about to initiate an emergency cryptographic override to access sealed patient records without active consent.
              </p>
            </div>

            <GlassPanel accentColor="red" className="p-8 border-[#FF4D6D]/30 bg-[#FF4D6D]/5 shadow-[0_0_50px_rgba(255,77,109,0.1)]">
               <div className="p-4 rounded-lg bg-black/40 border border-[#FF4D6D]/20 mb-8 text-sm text-white/70 flex gap-4 items-start">
                 <Info className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                 <p>This action is logged immutably to the audit chain. The patient and their delegated emergency contacts will be notified immediately. Non-emergency use of this protocol is a violation of HIPAA/GDPR and will result in revocation of network access.</p>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="text-xs text-[#FF4D6D]/80 uppercase tracking-wider block mb-2 font-bold">Target Patient ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter 8-digit Vault ID" 
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="w-full bg-black/50 border border-[#FF4D6D]/30 rounded-xl py-4 px-4 text-white text-lg focus:outline-none focus:border-[#FF4D6D] transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#FF4D6D]/80 uppercase tracking-wider block mb-2 font-bold">Clinical Justification (Required)</label>
                    <textarea 
                      placeholder="Describe the life-threatening emergency necessitating override..." 
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-black/50 border border-[#FF4D6D]/30 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[#FF4D6D] transition-colors resize-none"
                    />
                  </div>
               </div>

               <button 
                 onClick={handleTrigger}
                 disabled={!patientId || !reason}
                 className="w-full mt-8 py-5 bg-[#FF4D6D] text-white font-bold tracking-widest uppercase rounded-xl hover:bg-[#FF4D6D]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,77,109,0.4)] transition-all flex justify-center items-center gap-3"
               >
                 <ShieldAlert className="w-5 h-5" /> Initiate Override
               </button>
            </GlassPanel>
          </motion.div>
        )}

        {(status === "authenticating" || status === "breaching") && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center">
             <div className="relative w-48 h-48 mb-12">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 rounded-full border-4 border-dashed border-[#FF4D6D]/30" 
               />
               <motion.div 
                 animate={{ rotate: -360 }} 
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-4 rounded-full border-4 border-dashed border-[#FF4D6D]/60" 
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 {status === "authenticating" ? (
                   <Fingerprint className="w-16 h-16 text-[#FF4D6D] animate-pulse" />
                 ) : (
                   <ShieldAlert className="w-16 h-16 text-[#FF4D6D] animate-ping" />
                 )}
               </div>
             </div>
             
             <h2 className="text-3xl font-light text-white tracking-widest uppercase mb-4">
               {status === "authenticating" ? "Verifying Credentials" : "Bypassing Encryption"}
             </h2>
             <div className="h-6 overflow-hidden w-full max-w-sm">
                <motion.p 
                  animate={{ y: [0, -24, -48, -72] }} 
                  transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                  className="text-[#FF4D6D] font-mono text-sm leading-6"
                >
                  Checking provider authority...<br/>
                  Validating Level-1 Trauma status...<br/>
                  Logging to immutable audit chain...<br/>
                  Extracting encrypted shards...
                </motion.p>
             </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassPanel accentColor="red" className="p-12 text-center max-w-lg mx-auto border-[#FF4D6D] shadow-[0_0_100px_rgba(255,77,109,0.2)]">
               <div className="w-24 h-24 rounded-full bg-[#FF4D6D] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,77,109,0.6)]">
                 <LockOpen className="w-12 h-12 text-black" />
               </div>
               <h2 className="text-3xl font-light text-white mb-2">Access Granted</h2>
               <p className="text-[#FF4D6D] font-mono text-sm tracking-widest uppercase mb-8">Emergency State Active</p>
               <p className="text-white/60 mb-8">You have been granted 2-hour read-only access to Patient {patientId}. Family proxies have been notified.</p>
               
               <button 
                 onClick={() => router.push(`/patient/${patientId}`)}
                 className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
               >
                 Proceed to Medical Chart
               </button>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
