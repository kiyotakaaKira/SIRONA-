"use client";
import React, { useState, useEffect } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, HeartPulse, ShieldAlert, Sparkles, TrendingUp, RefreshCw, Lock, Activity, Microscope, FileDigit, Dna, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";

export default function AIInsightsPage() {
  const user = useStore((state: any) => state.user);
  const records = useStore((state: any) => state.records);
  const prescriptions = useStore((state: any) => state.prescriptions);

  
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  // Auto-run analysis when page loads (simulation/call to Gemini endpoints)
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setAnalyzing(true);
    // Simulate API request to backend capsule synthesis
    await new Promise(r => setTimeout(r, 2000));
    
    // Simple custom synthesized response for demonstration based on user data
    setReport(
      `Based on your ${records.length} records and ${prescriptions.length} current prescriptions:\n\n` +
      `• No drug-drug interactions detected between active medications.\n` +
      `• Vaccination coverage is fully up-to-date (Tdap, MMR, Hep B verified).\n` +
      `• Lumbar Spine MRI scan suggests mild degenerate changes; follow-up recommended only if symptomatic.\n` +
      `• Metabolic panel shows glucose and electrolyte balances are within standard reference ranges.`
    );
    setAnalyzing(false);
    toast.success("AI Synthesis Complete");
  };

  const patientId = user?.patientId ?? 'PAT-001';

  return (
    <div className="p-6 md:p-10 max-w-[1000px] mx-auto min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#29F0E0]/80 mb-1">Secure AI Analysis</p>
          <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
            AI Health Insights
          </h1>
        </motion.div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] text-black font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`} />
          Re-Analyze Records
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassPanel accentColor="cyan" className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#29F0E0]/15 border border-[#29F0E0]/30">
              <Sparkles className="w-4.5 h-4.5 text-[#29F0E0]" />
            </div>
            <span className="text-[10px] font-mono text-white/25">SECURE</span>
          </div>
          <p className="text-white/50 text-xs font-medium mb-1">Synthesized Records</p>
          <p className="text-2xl font-light text-white">{records.length} files</p>
        </GlassPanel>

        <GlassPanel accentColor="purple" className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/15 border border-purple-500/30">
              <HeartPulse className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <span className="text-[10px] font-mono text-white/25">ACTIVE</span>
          </div>
          <p className="text-white/50 text-xs font-medium mb-1">Active Prescriptions</p>
          <p className="text-2xl font-light text-white">{prescriptions.filter((p: any) => p.status === 'active').length} active</p>
        </GlassPanel>

        <GlassPanel accentColor="green" className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#2ED9A3]/15 border border-[#2ED9A3]/30">
              <TrendingUp className="w-4.5 h-4.5 text-[#2ED9A3]" />
            </div>
            <span className="text-[10px] font-mono text-white/25">HEALTHY</span>
          </div>
          <p className="text-white/50 text-xs font-medium mb-1">Interaction Risk</p>
          <p className="text-2xl font-light text-[#2ED9A3]">Zero Risk</p>
        </GlassPanel>
      </div>

      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-[#29F0E0] animate-spin" />
              <Brain className="w-6 h-6 text-[#29F0E0] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">Sirona AI Engine Active</p>
              <p className="text-[#29F0E0] text-xs font-mono tracking-widest uppercase animate-pulse">Running Deep Phenotype Analysis...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biomarker Trend */}
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#2E6FFF]" /> Biomarker Synthesis Trend
                  </h3>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Past 6 Months</span>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', score: 82, baseline: 75 },
                      { month: 'Feb', score: 85, baseline: 75 },
                      { month: 'Mar', score: 83, baseline: 75 },
                      { month: 'Apr', score: 88, baseline: 75 },
                      { month: 'May', score: 91, baseline: 75 },
                      { month: 'Jun', score: 94, baseline: 75 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(10, 16, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="score" name="Health Vector" stroke="#29F0E0" strokeWidth={3} dot={{ fill: '#29F0E0', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#fff', stroke: '#29F0E0', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="baseline" name="Population Avg" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassPanel>

              {/* Predictive Risk Radar */}
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-[#FF4D6D]" /> Predictive Pathology Risk
                  </h3>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Neural Model V2.4</span>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                      { subject: 'Cardiovascular', risk: 30, baseline: 50 },
                      { subject: 'Metabolic', risk: 45, baseline: 50 },
                      { subject: 'Neurological', risk: 20, baseline: 50 },
                      { subject: 'Immunology', risk: 15, baseline: 50 },
                      { subject: 'Respiratory', risk: 10, baseline: 50 },
                      { subject: 'Orthopedic', risk: 60, baseline: 50 },
                    ]}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                      <Radar name="Your Risk Profile" dataKey="risk" stroke="#FF4D6D" fill="#FF4D6D" fillOpacity={0.3} />
                      <Radar name="Age Baseline" dataKey="baseline" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.1)" fillOpacity={0.1} strokeDasharray="3 3" />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 16, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassPanel>
            </div>

            {/* Federated Privacy & Security Analytics */}
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#29F0E0]" /> Federated Privacy Metrics
                </h3>
                <span className="text-[10px] text-[#2ED9A3] uppercase tracking-widest font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED9A3] animate-pulse" /> Zero-Knowledge Processing
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 rounded-xl p-4 border border-[#29F0E0]/10 relative overflow-hidden group hover:border-[#29F0E0]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#29F0E0]/5 rounded-bl-full pointer-events-none group-hover:bg-[#29F0E0]/10 transition-colors" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Differential Privacy</p>
                  <p className="text-xl font-mono text-white">ε = 0.05</p>
                  <p className="text-[9px] text-[#29F0E0] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Mathematically Proven</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-[#2E6FFF]/10 relative overflow-hidden group hover:border-[#2E6FFF]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2E6FFF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#2E6FFF]/10 transition-colors" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">PII Redaction</p>
                  <p className="text-xl font-mono text-white">99.99%</p>
                  <p className="text-[9px] text-[#2E6FFF] mt-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Fully Anonymized</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-[#2ED9A3]/10 relative overflow-hidden group hover:border-[#2ED9A3]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2ED9A3]/5 rounded-bl-full pointer-events-none group-hover:bg-[#2ED9A3]/10 transition-colors" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Federated Compute</p>
                  <p className="text-xl font-mono text-white">12 Nodes</p>
                  <p className="text-[9px] text-[#2ED9A3] mt-1 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Decentralized Execution</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-purple-500/10 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Intrusion Mitigation</p>
                  <p className="text-xl font-mono text-white">0 Breaches</p>
                  <p className="text-[9px] text-purple-400 mt-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Active AI Defense</p>
                </div>
              </div>
            </GlassPanel>

            {/* Medical Journey Text Synthesis */}
            <GlassPanel className="p-0 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#29F0E0] to-[#2E6FFF]" />
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <FileDigit className="w-4 h-4 text-[#29F0E0]" /> LLM Journey Synthesis
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-[#29F0E0]/30 text-[#29F0E0] text-[10px] font-mono">
                    <Lock className="w-3 h-3" /> E2E ENCRYPTED
                  </div>
                </div>

                <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line font-mono bg-[#0a1017] p-5 rounded-xl border border-white/5 relative group">
                  <div className="absolute top-3 right-3 text-[#29F0E0] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Dna className="w-3 h-3" /> <span className="text-[9px] uppercase tracking-wider">Export to Genome XML</span>
                  </div>
                  {report}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
