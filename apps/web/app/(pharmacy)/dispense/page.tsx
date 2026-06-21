"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Pill, Activity, CheckCircle2, ArrowRight, ShieldAlert, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";

export default function DispenseWorkflowPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDispensing, setIsDispensing] = useState(false);
  const prescriptions = useStore(state => state.prescriptions);
  const dispensePrescription = useStore(state => state.dispensePrescription);
  const patients = useStore(state => state.patients);

  const activePrescriptions = prescriptions.filter(p => p.status === 'active' || p.status === 'flagged');
  const [selectedRxId, setSelectedRxId] = useState(activePrescriptions[0]?.id);

  const activeRx = prescriptions.find(p => p.id === selectedRxId) || activePrescriptions[0];
  
  // Deterministically assign a patient based on the prescription ID
  const patientIndex = activeRx ? (parseInt(activeRx.id.replace(/\D/g, '')) || 0) % patients.length : 0;
  const activePatient = patients[patientIndex];
  const initials = activePatient?.name.split(' ').map(n => n[0]).join('') || 'JD';

  const handleDispense = () => {
    setIsDispensing(true);
    toast("Recording transaction to immutable ledger...");
    setTimeout(() => {
      if (activeRx) {
        dispensePrescription(activeRx.id);
      }
      setIsDispensing(false);
      setStep(3);
      toast.success("Prescription officially dispensed");
    }, 2500);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen">
      <header className="mb-10">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2ED9A3]/80 mb-2">Prescription Fulfillment</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Dispense Workflow</motion.h1>
        </motion.div>
      </header>

      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className={`h-2 flex-1 rounded-full ${step >= num ? 'bg-[#2ED9A3]' : 'bg-white/10'} transition-colors`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {activeRx ? (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                 <span className="text-white/60 text-sm">Select Pending Prescription:</span>
                 <select 
                   value={selectedRxId || activeRx.id} 
                   onChange={(e) => setSelectedRxId(e.target.value)}
                   className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#2ED9A3]/50 transition-colors"
                 >
                   {activePrescriptions.map(p => (
                     <option key={p.id} value={p.id}>{p.medication} - {p.dosage}</option>
                   ))}
                 </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassPanel className="p-8">
                  <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2"><User className="w-5 h-5 text-[#2E6FFF]" /> Identity Verification</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl text-white font-medium">{initials}</div>
                    <div>
                      <h3 className="text-2xl text-white font-medium">{activePatient?.name || "John Doe"}</h3>
                      <p className="text-[#2E6FFF] font-mono text-sm mt-1">ID: {activePatient?.id || "1111-1111"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <p className="text-[10px] uppercase text-white/40 tracking-wider mb-1">DOB</p>
                      <p className="text-white">{activePatient?.dob || "May 12, 1984"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/40 tracking-wider mb-1">ID Verification</p>
                      <p className="text-[#2ED9A3] flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Matched</p>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)} className="w-full py-4 bg-[#2ED9A3] text-black font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Confirm Identity <ArrowRight className="w-4 h-4" />
                  </button>
                </GlassPanel>

                <div className="flex flex-col gap-6">
                   <GlassPanel accentColor="green" className="p-8">
                      <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2"><Pill className="w-5 h-5 text-[#2ED9A3]" /> Prescription Details</h2>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-light text-white">{activeRx.medication}</h3>
                          <span className={`px-2 py-1 ${activeRx.status === 'flagged' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30' : 'bg-[#2ED9A3]/10 text-[#2ED9A3] border-[#2ED9A3]/30'} border rounded text-xs`}>
                            {activeRx.status === 'flagged' ? 'Flagged' : 'Verified'}
                          </span>
                        </div>
                        <p className="text-[#2ED9A3] font-medium text-sm mb-4">{activeRx.dosage}</p>
                        
                        <div className="space-y-2 text-sm text-white/70">
                          <div className="flex justify-between">
                            <span className="text-white/40">Prescriber</span>
                            <span>{activeRx.doctor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Institution</span>
                            <span>{activeRx.hospital}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Date Issued</span>
                            <span>{activeRx.issueDate}</span>
                          </div>
                        </div>
                      </div>
                   </GlassPanel>
                </div>
              </div>
            </div>
            ) : (
              <GlassPanel className="p-12 text-center text-white/40">
                <p>No active prescriptions pending fulfillment for this patient.</p>
              </GlassPanel>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassPanel accentColor="blue" className="p-8">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#2E6FFF]" /> AI Risk Assessment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#2ED9A3]" />
                  <div>
                    <h3 className="text-white font-medium">Duplicate Check</h3>
                    <p className="text-sm text-white/50 mt-1">No duplicates found across network.</p>
                  </div>
                </div>
                <div className="p-6 bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 rounded-xl flex flex-col items-center text-center gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 bg-[#FF4D6D] text-black text-[10px] font-bold tracking-widest uppercase rounded-bl-lg">Warning</div>
                  <AlertTriangle className="w-8 h-8 text-[#FF4D6D]" />
                  <div>
                    <h3 className="text-white font-medium text-[#FF4D6D]">Allergy Warning</h3>
                    <p className="text-sm text-[#FF4D6D]/80 mt-1">Patient has severe Penicillin allergy. Amoxicillin is a beta-lactam.</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center gap-3">
                  <Activity className="w-8 h-8 text-[#29F0E0]" />
                  <div>
                    <h3 className="text-white font-medium">Fraud Score</h3>
                    <p className="text-sm text-white/50 mt-1">Low risk (98/100).</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-dashed border-[#FF4D6D]/50 bg-[#FF4D6D]/5 rounded-xl mb-8">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-[#FF4D6D]"/> Pharmacist Override Required</h3>
                <p className="text-sm text-white/60 mb-4">The AI has flagged a severe cross-reactivity risk. You must acknowledge this risk to proceed with dispensing.</p>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="override" className="w-5 h-5 accent-[#FF4D6D]" />
                  <label htmlFor="override" className="text-sm text-white/80 cursor-pointer">I have consulted with the prescriber and patient, and authorize this dispense.</label>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/10 text-white/60 rounded-xl hover:bg-white/5">
                  Back
                </button>
                <button 
                  onClick={handleDispense}
                  disabled={isDispensing}
                  className="px-6 py-3 bg-[#2ED9A3] text-black font-medium rounded-xl hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                >
                  {isDispensing ? 'Recording Dispense to Network...' : 'Confirm & Dispense'}
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassPanel accentColor="green" className="p-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#2ED9A3]/10 flex items-center justify-center mb-6 border border-[#2ED9A3]/30">
                <CheckCircle2 className="w-12 h-12 text-[#2ED9A3]" />
              </div>
              <h2 className="text-3xl font-light text-white mb-2">Fulfillment Complete</h2>
              <p className="text-white/50 mb-8 max-w-md">The dispense event has been logged to the immutable network. The patient's remaining refills have been updated.</p>
              
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 w-full max-w-sm mb-8 flex flex-col gap-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-white/40">Transaction ID</span>
                   <span className="text-[#2ED9A3] font-mono">0x7a8...2c1f</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-white/40">Timestamp</span>
                   <span className="text-white font-mono">{new Date().toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex gap-4 w-full justify-center">
                <button onClick={() => router.push('/pharmacy-dashboard')} className="py-3 px-8 border border-white/10 text-white rounded-xl hover:bg-white/5 font-medium">
                  Return to Dashboard
                </button>
                <button onClick={() => { setStep(1); router.push('/scan'); }} className="py-3 px-8 bg-gradient-to-r from-[#2ED9A3] to-[#29F0E0] text-black rounded-xl hover:opacity-90 font-medium">
                  Scan Next Patient
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
