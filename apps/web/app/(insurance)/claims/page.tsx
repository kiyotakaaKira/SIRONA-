"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, CheckCircle2, Clock, ShieldAlert, ShieldCheck, ArrowRight, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClaimsProcessingPage() {
  const [requested, setRequested] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);

  const claims = [
    {
      id: "CLM-9012",
      patient: "John Doe",
      type: "Surgical Appendectomy",
      amount: 12500,
      status: "verified",
      date: "Oct 12, 2026",
      hospital: "Apollo Demo Hospital"
    },
    {
      id: "CLM-8834",
      patient: "Jane Smith",
      type: "Prescription Reimbursement",
      amount: 450,
      status: requested ? "pending" : "missing_proof",
      date: "Oct 10, 2026",
      hospital: "Walgreens Pharmacy"
    },
    {
      id: "CLM-8835",
      patient: "Michael Johnson",
      type: "Outpatient Consultation",
      amount: 120,
      status: "denied",
      date: "Oct 08, 2026",
      hospital: "Mercy Clinic"
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2E6FFF]/80 mb-2">Adjudication Engine</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Claims Processing</motion.h1>
        </motion.div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <GlassPanel className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
               <h2 className="text-lg font-medium text-white flex items-center gap-2">
                 <FileSignature className="w-5 h-5 text-[#2E6FFF]" /> Verification Queue
               </h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {claims.map((claim, index) => (
                <motion.div 
                  key={claim.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 cursor-pointer transition-colors ${selectedClaim === index ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                  onClick={() => setSelectedClaim(index)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-white">{claim.id}</h3>
                      <span className="text-xs font-mono text-white/40">{claim.date}</span>
                    </div>
                    {claim.status === 'verified' && (
                      <span className="px-2 py-1 bg-[#2ED9A3]/10 text-[#2ED9A3] border border-[#2ED9A3]/30 rounded text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographic Proof Verified
                      </span>
                    )}
                    {claim.status === 'pending' && (
                      <span className="px-2 py-1 bg-[#2E6FFF]/10 text-[#2E6FFF] border border-[#2E6FFF]/30 rounded text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Patient Consent
                      </span>
                    )}
                    {claim.status === 'missing_proof' && (
                      <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded text-xs font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Missing Proof
                      </span>
                    )}
                    {claim.status === 'denied' && (
                      <span className="px-2 py-1 bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/30 rounded text-xs font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Contract Reject
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/80">{claim.patient} • {claim.type}</p>
                      <p className="text-sm text-white/40 mt-1">Provider: {claim.hospital}</p>
                    </div>
                    <p className="text-xl text-white font-light">${claim.amount.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Details Panel */}
        <AnimatePresence mode="wait">
           {selectedClaim !== null && (
             <motion.div 
               key={selectedClaim}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="w-full lg:w-[450px] shrink-0"
             >
               <GlassPanel accentColor={
                 claims[selectedClaim].status === 'verified' ? 'green' : 
                 claims[selectedClaim].status === 'missing_proof' ? 'amber' : 
                 claims[selectedClaim].status === 'denied' ? 'red' : 'blue'
               } className="p-8 sticky top-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Claim Details</p>
                      <h2 className="text-2xl font-light text-white">{claims[selectedClaim].id}</h2>
                    </div>
                    <button onClick={() => setSelectedClaim(null)} className="text-white/40 hover:text-white">✕</button>
                  </div>

                  <div className="space-y-6 mb-8">
                     <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                       <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Billed Amount</p>
                       <p className="text-3xl font-light text-white">${claims[selectedClaim].amount.toLocaleString()}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Patient</p>
                         <p className="text-sm text-white">{claims[selectedClaim].patient}</p>
                       </div>
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Service Date</p>
                         <p className="text-sm text-white">{claims[selectedClaim].date}</p>
                       </div>
                       <div className="col-span-2">
                         <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Service Type</p>
                         <p className="text-sm text-white">{claims[selectedClaim].type}</p>
                       </div>
                     </div>
                  </div>

                  {claims[selectedClaim].status === 'verified' && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-xl bg-[#2ED9A3]/5 border border-[#2ED9A3]/20 flex items-start gap-3">
                         <ShieldCheck className="w-5 h-5 text-[#2ED9A3] shrink-0" />
                         <div>
                           <p className="text-sm text-[#2ED9A3] font-medium">Zero-Knowledge Proof Validated</p>
                           <p className="text-xs text-white/50 mt-1">The patient's vault confirms this procedure occurred without revealing underlying medical data.</p>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-[#2ED9A3] text-black font-medium rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                        <DollarSign className="w-4 h-4" /> Authorize Payout
                      </button>
                    </div>
                  )}

                  {claims[selectedClaim].status === 'missing_proof' && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 flex items-start gap-3">
                         <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0" />
                         <div>
                           <p className="text-sm text-[#F59E0B] font-medium">Proof Required</p>
                           <p className="text-xs text-white/50 mt-1">To process this claim, you must request cryptographic verification from the patient's vault.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setRequested(true)}
                        className="w-full py-4 bg-[#F59E0B] text-black font-medium rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        <FileSignature className="w-4 h-4" /> Request Record Access
                      </button>
                    </div>
                  )}

                  {claims[selectedClaim].status === 'pending' && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-xl bg-[#2E6FFF]/5 border border-[#2E6FFF]/20 flex items-start gap-3">
                         <Clock className="w-5 h-5 text-[#2E6FFF] shrink-0" />
                         <div>
                           <p className="text-sm text-[#2E6FFF] font-medium">Waiting on Patient</p>
                           <p className="text-xs text-white/50 mt-1">A consent request has been sent to the patient's device. Adjudication will pause until granted.</p>
                         </div>
                      </div>
                    </div>
                  )}

                  {claims[selectedClaim].status === 'denied' && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-xl bg-[#FF4D6D]/5 border border-[#FF4D6D]/20 flex items-start gap-3">
                         <AlertTriangle className="w-5 h-5 text-[#FF4D6D] shrink-0" />
                         <div>
                           <p className="text-sm text-[#FF4D6D] font-medium">Contract Rule Violation</p>
                           <p className="text-xs text-white/50 mt-1">Smart Contract #8A91 rejected this claim. Patient plan does not cover out-of-network outpatient consultations.</p>
                         </div>
                      </div>
                      <button className="w-full py-3 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/5">
                        View Contract Logic
                      </button>
                    </div>
                  )}

               </GlassPanel>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
