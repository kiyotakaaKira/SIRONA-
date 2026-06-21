"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion } from "framer-motion";
import { FileCode2, Play, GitBranch, ShieldCheck, Plus, CheckCircle2, Activity, PlayCircle } from "lucide-react";

export default function SmartContractsPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
    }, 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#29F0E0]/80 mb-2">Policy Engine</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Smart Contract Rules</motion.h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
           <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_20px_rgba(41,240,224,0.3)]">
             <Plus className="w-4 h-4" /> Create New Rule
           </button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 flex flex-col gap-6">
           <GlassPanel className="p-0 overflow-hidden">
             <div className="p-6 border-b border-white/5 bg-white/[0.02]">
               <h3 className="text-sm font-medium text-white">Active Contracts</h3>
             </div>
             <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {[
                  { id: "#8A91", name: "Outpatient Co-Pay Logic", status: "Active" },
                  { id: "#4A9B", name: "Prescription Tier 1 Autopay", status: "Active" },
                  { id: "#2B11", name: "Emergency ER Override", status: "Active" },
                  { id: "#9C44", name: "Dental Routine Cleaning", status: "Active" },
                  { id: "#1A00", name: "Experimental Treatment Block", status: "Active" },
                ].map((c, i) => (
                  <div key={i} className="p-4 flex justify-between items-center hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <p className="text-white/40 text-xs font-mono">{c.id}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#2ED9A3] shadow-[0_0_8px_rgba(46,217,163,0.8)]" />
                  </div>
                ))}
             </div>
           </GlassPanel>
        </div>

        <div className="xl:col-span-2 flex flex-col gap-6">
           <GlassPanel className="p-0 overflow-hidden flex flex-col h-full">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#05070A]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#29F0E0]/10 flex items-center justify-center border border-[#29F0E0]/20">
                    <FileCode2 className="w-5 h-5 text-[#29F0E0]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">Contract Editor</h2>
                    <p className="text-xs text-white/40 font-mono">Drafting: "Specialist Pre-Auth Requirement"</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-white/10 rounded-md text-white/60 hover:text-white text-sm flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" /> Run Tests
                  </button>
                  <button 
                    onClick={handleDeploy}
                    disabled={isDeploying || deployed}
                    className="px-4 py-1.5 bg-[#2E6FFF] text-white rounded-md text-sm font-medium hover:bg-[#2E6FFF]/90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeploying ? 'Deploying to Mesh...' : deployed ? 'Deployed' : 'Deploy Contract'}
                  </button>
                </div>
             </div>

             <div className="flex-1 bg-[#0A0D14] p-6 font-mono text-sm overflow-x-auto relative min-h-[400px]">
                {isDeploying && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                     <Activity className="w-10 h-10 text-[#29F0E0] animate-pulse mb-4" />
                     <p className="text-white font-medium">Compiling logic to Zero-Knowledge Circuit...</p>
                     <p className="text-white/40 text-xs mt-2">Broadcasting to validator nodes</p>
                  </div>
                )}
                {deployed && (
                  <div className="absolute inset-0 bg-[#2ED9A3]/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center border-4 border-dashed border-[#2ED9A3]/20">
                     <CheckCircle2 className="w-12 h-12 text-[#2ED9A3] mb-4" />
                     <h3 className="text-xl text-white font-medium mb-1">Contract Deployed Successfully</h3>
                     <p className="text-white/60 text-sm">Logic is now active across all network nodes.</p>
                     <button onClick={() => setDeployed(false)} className="mt-6 px-4 py-2 border border-white/20 rounded-md text-white/60 hover:text-white transition-colors">Edit Contract</button>
                  </div>
                )}

<pre className="text-white/70">
<span className="text-[#F59E0B]">function</span> <span className="text-[#29F0E0]">evaluateSpecialistClaim</span>(claim, patientVault) {'{'}
  <span className="text-[#FF4D6D]">if</span> (claim.providerType !== <span className="text-[#2ED9A3]">'SPECIALIST'</span>) {'{'}
    <span className="text-[#FF4D6D]">return</span> <span className="text-[#2E6FFF]">AdjudicationResult</span>.IGNORE;
  {'}'}

  <span className="text-[#FF4D6D]">const</span> hasReferral = patientVault.<span className="text-[#29F0E0]">verifyZKP</span>(
    <span className="text-[#2ED9A3]">'REFERRAL_EXISTS'</span>,
    {'{'}
       specialty: claim.specialty,
       dateRange: [claim.date - <span className="text-[#F59E0B]">90_DAYS</span>, claim.date]
    {'}'}
  );

  <span className="text-[#FF4D6D]">if</span> (hasReferral) {'{'}
    <span className="text-white/40">/* Auto-adjudicate if valid referral exists in vault */</span>
    <span className="text-[#FF4D6D]">return</span> <span className="text-[#2E6FFF]">AdjudicationResult</span>.<span className="text-[#2ED9A3]">APPROVE</span>;
  {'}'} <span className="text-[#FF4D6D]">else</span> {'{'}
    <span className="text-white/40">/* Deny payout due to missing referral */</span>
    <span className="text-[#FF4D6D]">return</span> <span className="text-[#2E6FFF]">AdjudicationResult</span>.<span className="text-[#FF4D6D]">DENY_NO_PREAUTH</span>;
  {'}'}
{'}'}
</pre>
             </div>
             
             <div className="p-4 border-t border-white/5 bg-[#05070A] flex justify-between items-center text-xs text-white/40 font-mono">
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1"><GitBranch className="w-3 h-3"/> main</span>
                 <span>JavaScript/WASM</span>
               </div>
               <div className="flex items-center gap-1 text-[#2ED9A3]">
                 <ShieldCheck className="w-3 h-3"/> Syntax Valid
               </div>
             </div>
           </GlassPanel>
        </div>
      </div>
    </div>
  );
}
