"use client";
import React from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Activity, Search, Brain, ExternalLink, Network, FileSignature } from "lucide-react";

export default function FraudDetectionPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.div variants={motionVariants.resolveIn} className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF4D6D]/10 border border-[#FF4D6D]/30">
               <Brain className="w-5 h-5 text-[#FF4D6D]" />
            </div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FF4D6D]">AI Security Engine</p>
          </motion.div>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Fraud Detection Center</motion.h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
           <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input type="text" placeholder="Search incidents..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FF4D6D]/50 transition-colors" />
           </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
           <GlassPanel accentColor="red" className="p-6 h-full flex flex-col justify-between border-[#FF4D6D]/30 bg-gradient-to-br from-[#FF4D6D]/5 to-transparent">
             <div>
               <div className="flex justify-between items-start mb-2">
                 <ShieldAlert className="w-6 h-6 text-[#FF4D6D]" />
                 <span className="text-xs font-mono text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-1 rounded">High Severity</span>
               </div>
               <h3 className="text-white font-medium mb-1">Doctor Shopping Detected</h3>
               <p className="text-sm text-white/60 mb-4">Patient attempting to fill Oxycodone prescriptions from 3 different providers within 48 hours.</p>
             </div>
             <button className="w-full py-2 bg-[#FF4D6D]/20 text-[#FF4D6D] hover:bg-[#FF4D6D]/30 font-medium rounded-lg text-sm transition-colors">
               Review Case #8892
             </button>
           </GlassPanel>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
           <GlassPanel accentColor="amber" className="p-6 h-full flex flex-col justify-between">
             <div>
               <div className="flex justify-between items-start mb-2">
                 <FileSignature className="w-6 h-6 text-[#F59E0B]" />
                 <span className="text-xs font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded">Medium Severity</span>
               </div>
               <h3 className="text-white font-medium mb-1">Invalid Cryptographic Hash</h3>
               <p className="text-sm text-white/60 mb-4">A prescription submitted at Terminal 4 failed signature validation. Potential forgery attempt.</p>
             </div>
             <button className="w-full py-2 bg-white/5 text-white hover:bg-white/10 font-medium rounded-lg text-sm transition-colors border border-white/10">
               Review Case #8891
             </button>
           </GlassPanel>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
           <GlassPanel accentColor="amber" className="p-6 h-full flex flex-col justify-between">
             <div>
               <div className="flex justify-between items-start mb-2">
                 <Activity className="w-6 h-6 text-[#F59E0B]" />
                 <span className="text-xs font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded">Medium Severity</span>
               </div>
               <h3 className="text-white font-medium mb-1">Anomalous Dose Flag</h3>
               <p className="text-sm text-white/60 mb-4">Prescribed dosage for Lisinopril exceeds standard guidelines by 400%. Pending pharmacist review.</p>
             </div>
             <button className="w-full py-2 bg-white/5 text-white hover:bg-white/10 font-medium rounded-lg text-sm transition-colors border border-white/10">
               Review Case #8890
             </button>
           </GlassPanel>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassPanel className="p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                 <h2 className="text-lg font-medium text-white flex items-center gap-2">
                   <Network className="w-5 h-5 text-[#2E6FFF]" /> AI Cross-Referencing Logs
                 </h2>
                 <div className="flex gap-2">
                   <button className="text-xs px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20">Filter by Risk</button>
                   <button className="text-xs px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20">Export Report</button>
                 </div>
              </div>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Timestamp</th>
                    <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Patient ID</th>
                    <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Event</th>
                    <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Risk Score</th>
                    <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { time: "10:42 AM", id: "1234-5678", event: "Multiple active opioid Rx", score: 92, action: "Blocked" },
                    { time: "09:15 AM", id: "1111-1111", event: "Signature verification failed", score: 85, action: "Blocked" },
                    { time: "Yesterday", id: "9999-8888", event: "Out of state prescriber", score: 45, action: "Flagged" },
                    { time: "Yesterday", id: "4444-5555", event: "Early refill request (15 days)", score: 60, action: "Flagged" },
                    { time: "Oct 12", id: "2222-3333", event: "Pharmacy-hopping pattern", score: 88, action: "Blocked" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-sm text-white/50 font-mono">{row.time}</td>
                      <td className="p-4 text-sm text-white font-mono">{row.id}</td>
                      <td className="p-4 text-sm text-white/80">{row.event}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <div className={`h-full ${row.score > 80 ? 'bg-[#FF4D6D]' : row.score > 50 ? 'bg-[#F59E0B]' : 'bg-[#2ED9A3]'}`} style={{ width: `${row.score}%` }} />
                           </div>
                           <span className={`text-xs font-mono ${row.score > 80 ? 'text-[#FF4D6D]' : row.score > 50 ? 'text-[#F59E0B]' : 'text-[#2ED9A3]'}`}>{row.score}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                         <span className={`text-xs px-2 py-1 rounded font-medium ${row.action === 'Blocked' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/30' : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'}`}>
                           {row.action}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassPanel>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
             <GlassPanel className="p-6">
               <h3 className="text-white font-medium mb-4">Network Status</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#2ED9A3] animate-pulse" />
                     <span className="text-sm text-white">Central Ledger</span>
                   </div>
                   <span className="text-xs text-[#2ED9A3]">Online</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#2ED9A3] animate-pulse" />
                     <span className="text-sm text-white">AI Fraud Engine</span>
                   </div>
                   <span className="text-xs text-[#2ED9A3]">Active</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                     <span className="text-sm text-white">State PMP Sync</span>
                   </div>
                   <span className="text-xs text-[#F59E0B]">Delayed (12m)</span>
                 </div>
               </div>
             </GlassPanel>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
