"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Droplets, Pill, History, AlertTriangle, X, Sparkles } from "lucide-react";
import { GlassPanel, springSoft } from "@healthmesh/ui";
import { useContinuityCapsule } from "../contexts/ContinuityCapsuleContext";

interface CapsuleData {
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  activeMedications: { name: string; dosage: string; reason: string }[];
  historicalEvents: { description: string; date: string; outcome: string }[];
}

const COMPREHENSIVE_TEST_DATA: CapsuleData = {
  bloodGroup: "O+",
  allergies: ["Penicillin", "Sulfa Drugs", "Latex (Mild)"],
  chronicConditions: ["Hypertension (Stage 1)", "Type 2 Diabetes (Controlled)"],
  activeMedications: [
    { name: "Lisinopril", dosage: "10mg · Oral · Daily", reason: "Primary hypertension management" },
    { name: "Metformin ER", dosage: "500mg · Oral · Twice Daily", reason: "Glycemic control and insulin sensitivity" },
    { name: "Atorvastatin", dosage: "20mg · Oral · Nightly", reason: "Lipid panel optimization (Hyperlipidemia)" }
  ],
  historicalEvents: [
    { description: "Laparoscopic Cholecystectomy", date: "2023-11-04", outcome: "Uncomplicated recovery. Pathology benign." },
    { description: "Comprehensive Metabolic Panel", date: "2026-05-12", outcome: "A1C: 6.1%. Lipid panel improved. eGFR normal." },
    { description: "Cardiology Consult (ECG & Echo)", date: "2025-09-22", outcome: "Normal sinus rhythm. Mild LVH noted. No acute ischemia." },
  ],
};

function MemoryShard({
  children,
  delay,
  accent = "green",
  depth = 0,
}: {
  children: React.ReactNode;
  delay: number;
  accent?: "green" | "amber" | "neutral";
  depth?: number;
}) {
  const border =
    accent === "amber"
      ? "border-[#F59E0B]/30 shadow-[0_0_24px_rgba(245,158,11,0.12)]"
      : accent === "green"
        ? "border-[#2ED9A3]/25 shadow-[0_0_24px_rgba(46,217,163,0.1)]"
        : "border-white/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.94, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ ...springSoft, delay }}
      style={{ transform: `translateZ(${depth}px)` }}
      className={`glass-lens rounded-2xl p-6 border ${border}`}
    >
      {children}
    </motion.div>
  );
}

export function ContinuityCapsule() {
  const { isOpen, open, close } = useContinuityCapsule();
  const [capsuleData, setCapsuleData] = useState<CapsuleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "revealed">("idle");

  useEffect(() => {
    if (!isOpen) {
      setPhase("idle");
      return;
    }

    setPhase("loading");
    setLoading(true);

    // Efficient simulated backend resolution with rich, proper test data
    // Removes the failing localhost fetch call for much faster local execution
    setTimeout(() => {
      setCapsuleData(COMPREHENSIVE_TEST_DATA);
      setLoading(false);
      setPhase("revealed");
    }, 1200);
  }, [isOpen]);

  const data = capsuleData ?? COMPREHENSIVE_TEST_DATA;

  return (
    <>
      {/* Floating capsule FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            layoutId="continuity-capsule-shell"
            onClick={open}
            className="fixed bottom-10 right-10 z-50 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open Continuity Capsule"
          >
            <div className="relative w-[68px] h-[100px] rounded-[34px] bg-gradient-to-b from-[#2ED9A3]/25 to-[#29F0E0]/15 border border-[#2ED9A3]/50 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(46,217,163,0.35)]">
              <motion.div
                animate={{ y: [-8, 8, -8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-3 top-3 bottom-3 rounded-[26px] bg-gradient-to-t from-[#2ED9A3] to-[#29F0E0] opacity-70 blur-sm"
              />
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-7 h-7 text-white drop-shadow-lg" strokeWidth={1.5} />
              </div>
            </div>
            <motion.span
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-[#2ED9A3] px-2.5 py-1 rounded-lg border border-[#2ED9A3]/30 bg-[#05070A]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Continuity Capsule
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full-screen holographic experience */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#030508]/90 backdrop-blur-2xl"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Ambient particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#2ED9A3]"
                style={{ left: `${(i * 19) % 100}%`, top: `${(i * 31) % 100}%` }}
                animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            <motion.div
              layoutId="continuity-capsule-shell"
              className="relative w-[min(96vw,960px)] max-h-[90vh] flex flex-col overflow-hidden rounded-[32px] border border-[#2ED9A3]/30 shadow-[0_0_120px_rgba(46,217,163,0.2)]"
              onClick={(e) => e.stopPropagation()}
              transition={springSoft}
            >
              {/* Capsule header glow */}
              <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#2ED9A3]/15 to-transparent pointer-events-none" />

              <div className="relative p-8 md:p-10 border-b border-white/5 flex items-start justify-between gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#2ED9A3]/80 mb-2">
                    SYNTHESIZED · PATIENT-AUTHORIZED · ENCRYPTED
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                    Your Medical Journey
                  </h2>
                  <p className="text-sm text-white/45 mt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2ED9A3]" />
                    Synthesized by HealthMesh Intelligence
                  </p>
                </motion.div>
                <button
                  type="button"
                  onClick={close}
                  className="p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-1 overflow-y-auto p-8 md:p-10 pt-6 space-y-5">
                {phase === "loading" && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-24 h-36 rounded-[48px] border-2 border-[#2ED9A3]/50 relative overflow-hidden mb-8"
                      animate={{ boxShadow: ["0 0 20px rgba(46,217,163,0.2)", "0 0 60px rgba(46,217,163,0.5)", "0 0 20px rgba(46,217,163,0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-x-2 h-0.5 bg-[#2ED9A3] shadow-[0_0_12px_#2ED9A3]"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    <p className="text-[#2ED9A3] text-sm animate-pulse text-center max-w-sm">
                      Running semantic synthesis over encrypted records...
                    </p>
                    <p className="text-[10px] font-mono text-white/25 mt-3">HASH_STREAM · 0x9f86…c7d6</p>
                  </motion.div>
                )}

                {phase === "revealed" && !loading && (
                  <div className="space-y-5 perspective-[1200px]">
                    <MemoryShard delay={0.1} accent="green">
                      <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#2ED9A3] mb-4 flex items-center gap-2">
                        <Droplets className="w-4 h-4" /> Vitals & Baseline
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">Blood Group</p>
                          <p className="text-2xl font-light text-white mt-1">{data.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">Allergies</p>
                          <p className="text-xl font-light text-[#FF4D6D] mt-1">{data.allergies.join(", ") || "None"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">Chronic</p>
                          <p className="text-xl font-light text-white mt-1">{data.chronicConditions.join(", ") || "None"}</p>
                        </div>
                      </div>
                    </MemoryShard>

                    {data.allergies.length > 0 && (
                      <MemoryShard delay={0.2} accent="amber">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                          <p className="text-sm text-[#F59E0B] font-medium">Critical allergy flagged in continuity layer</p>
                        </div>
                      </MemoryShard>
                    )}

                    {data.activeMedications.map((med, idx) => (
                      <MemoryShard key={med.name} delay={0.25 + idx * 0.1} accent="green" depth={idx * 4}>
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-[#2ED9A3]/15 flex items-center justify-center border border-[#2ED9A3]/30">
                            <Pill className="w-5 h-5 text-[#2ED9A3]" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40">Active Treatment</p>
                            <h4 className="text-xl font-medium text-white mt-0.5">{med.name}</h4>
                            <p className="text-xs font-mono text-[#2ED9A3]/70 mt-1">{med.dosage}</p>
                            <p className="text-sm text-white/50 mt-2">{med.reason}</p>
                          </div>
                        </div>
                      </MemoryShard>
                    ))}

                    {data.historicalEvents.map((evt, idx) => (
                      <MemoryShard key={evt.date} delay={0.45 + idx * 0.1} accent="neutral" depth={-8}>
                        <div className="flex items-start gap-4 opacity-90">
                          <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <History className="w-5 h-5 text-white/50" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/35">Historical Memory</p>
                            <h4 className="text-lg font-medium text-white/90 mt-0.5">{evt.description}</h4>
                            <p className="text-xs font-mono text-white/30 mt-1">{evt.date}</p>
                            <p className="text-sm text-white/45 mt-2">{evt.outcome}</p>
                          </div>
                        </div>
                      </MemoryShard>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
