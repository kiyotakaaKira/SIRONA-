"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, User, FileSignature, CheckCircle2, QrCode, ShieldCheck, ArrowRight, Plus } from "lucide-react";

import { useStore } from "../../../store/useStore";
import { toast } from "sonner";

export default function PrescribePage() {
  const [patientId, setPatientId] = useState("");
  const [medications, setMedications] = useState([{ name: "", dosage: "", instructions: "" }]);
  const [diagnosis, setDiagnosis] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSigning, setIsSigning] = useState(false);
  const user = useStore(state => state.user);
  const issuePrescription = useStore(state => state.issuePrescription);

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", instructions: "" }]);
  };

  const handleSign = () => {
    setIsSigning(true);
    toast("Generating cryptographic signature...");
    
    setTimeout(() => {
      // Issue each medication
      medications.forEach(med => {
        if (med.name) {
          issuePrescription({
            medication: med.name,
            dosage: med.dosage || "As directed",
            doctor: user?.name || "Dr. Authorized",
            hospital: "Apollo Hospital",
            issueDate: new Date().toISOString().split('T')[0],
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active',
            refills: 0,
            instructions: med.instructions || "Standard instructions.",
            fraudScore: 99
          });
        }
      });
      
      setIsSigning(false);
      setStep(3);
      toast.success("Prescriptions securely issued to patient vault");
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1000px] mx-auto min-h-screen">
      <header className="mb-10">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2ED9A3]/80 mb-2">Clinical Workflow</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Issue Prescription</motion.h1>
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
            <GlassPanel className="p-8">
              <h2 className="text-xl font-medium text-white mb-6">Patient & Diagnosis</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Patient ID or Vault ID</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="text" 
                      placeholder="e.g. 1234-5678" 
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#2ED9A3]/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Primary Diagnosis / Indication</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acute Bronchitis" 
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#2ED9A3]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!patientId || !diagnosis}
                  className="px-6 py-3 bg-[#2ED9A3] text-black font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassPanel className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-white">Medications</h2>
                <button onClick={addMedication} className="text-[#2ED9A3] text-sm font-medium flex items-center gap-1 hover:underline">
                  <Plus className="w-4 h-4" /> Add Drug
                </button>
              </div>

              <div className="space-y-6">
                {medications.map((med, index) => (
                  <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-medium flex items-center gap-2"><Pill className="w-4 h-4 text-[#2ED9A3]"/> Rx {index + 1}</h3>
                      {medications.length > 1 && (
                        <button className="text-[#FF4D6D] text-xs hover:underline" onClick={() => setMedications(meds => meds.filter((_, i) => i !== index))}>Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider block mb-1">Drug Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Amoxicillin" 
                          value={med.name}
                          onChange={(e) => setMedications(meds => meds.map((m, i) => i === index ? { ...m, name: e.target.value } : m))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#2ED9A3]/50" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider block mb-1">Dosage & Frequency</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 500mg, 3x daily" 
                          value={med.dosage}
                          onChange={(e) => setMedications(meds => meds.map((m, i) => i === index ? { ...m, dosage: e.target.value } : m))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#2ED9A3]/50" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-white/40 uppercase tracking-wider block mb-1">Patient Instructions</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Take with food. Finish entire course." 
                          value={med.instructions}
                          onChange={(e) => setMedications(meds => meds.map((m, i) => i === index ? { ...m, instructions: e.target.value } : m))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#2ED9A3]/50" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/10 text-white/60 rounded-xl hover:bg-white/5">
                  Back
                </button>
                <button 
                  onClick={handleSign}
                  disabled={isSigning}
                  className="px-6 py-3 bg-gradient-to-r from-[#2ED9A3] to-[#29F0E0] text-black font-medium rounded-xl hover:opacity-90 flex items-center gap-2"
                >
                  {isSigning ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><FileSignature className="w-4 h-4"/></motion.div> Signing with Enclave...</>
                  ) : (
                    <><FileSignature className="w-4 h-4" /> Digitally Sign & Issue</>
                  )}
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassPanel accentColor="green" className="p-10 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#2ED9A3]/10 flex items-center justify-center mb-6 border border-[#2ED9A3]/30">
                <CheckCircle2 className="w-10 h-10 text-[#2ED9A3]" />
              </div>
              <h2 className="text-3xl font-light text-white mb-2">Prescription Issued</h2>
              <p className="text-white/50 mb-8 max-w-md">The prescription has been cryptographically signed and securely transmitted to the patient's vault.</p>
              
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 w-full max-w-sm mb-8">
                <div className="flex justify-center mb-4 text-[#29F0E0]">
                  <QrCode className="w-32 h-32 opacity-80" />
                </div>
                <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-1">Encrypted Payload</p>
                <p className="text-xs text-[#2ED9A3] font-mono break-all">sig_0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/60 bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-[#2ED9A3]" /> Non-repudiable. Verified by HealthMesh Network.
              </div>

              <div className="mt-10 flex gap-4 w-full">
                <button onClick={() => { setStep(1); setPatientId(""); setDiagnosis(""); }} className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 font-medium">
                  Issue Another
                </button>
                <button onClick={() => window.print()} className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 font-medium">
                  Print Summary
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
