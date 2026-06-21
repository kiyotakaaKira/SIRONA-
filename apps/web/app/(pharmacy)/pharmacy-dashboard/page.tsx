"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ScanBarcode, ShieldCheck, AlertTriangle, Pill, Activity, ArrowRight, ShieldAlert, CheckCircle2, Upload, X } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { DataTable } from "../../../components/DataTable";
import { InventoryBarChart } from "../../../components/charts/InventoryBarChart";
import { PrescriptionUpload } from "../../../components/PrescriptionUpload";

export default function PharmacyDashboard() {
  const router = useRouter();
  const prescriptions = useStore(state => state.prescriptions);
  const auditLogs = useStore(state => state.auditLogs);
  const [showUpload, setShowUpload] = useState(false);

  const dispensedCount = prescriptions.filter(p => p.status === 'dispensed').length;

  const logColumns = [
    {
      header: "Action",
      accessorKey: "title",
      cell: (item: any) => {
        let icon = Activity;
        let colorClass = "text-white";
        let bgClass = "bg-white/10";
        
        if (item.type === 'medical') {
          icon = CheckCircle2;
          colorClass = "text-[#2ED9A3]";
          bgClass = "bg-[#2ED9A3]/10";
        } else if (item.type === 'access') {
          icon = ShieldCheck;
          colorClass = "text-[#29F0E0]";
          bgClass = "bg-[#29F0E0]/10";
        } else if (item.type === 'security') {
          icon = ShieldAlert;
          colorClass = "text-[#FF4D6D]";
          bgClass = "bg-[#FF4D6D]/10";
        }

        const Icon = icon;

        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bgClass} shrink-0`}>
              <Icon className={`w-4 h-4 ${colorClass}`} />
            </div>
            <span className="font-medium text-white">{item.title}</span>
          </div>
        );
      },
      sortable: true
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (item: any) => <span className="text-white/60 text-sm">{item.description}</span>
    },
    {
      header: "Time",
      accessorKey: "time",
      sortable: true,
      cell: (item: any) => <span className="font-mono text-white/50">{item.time}</span>
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2ED9A3]/80 mb-2">Walgreens Pharmacy Terminal</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Fulfillment Center</motion.h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button onClick={() => router.push('/scan')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2ED9A3] to-[#29F0E0] text-black font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_20px_rgba(46,217,163,0.3)]">
            <ScanBarcode className="w-5 h-5" /> Scan QR Prescription
          </button>
        </motion.div>
      </header>

      <motion.div 
        variants={motionVariants.staggerContainer} 
        initial="initial" 
        animate="animate" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="green" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/dispense')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2ED9A3]/10 flex items-center justify-center border border-[#2ED9A3]/20">
                <Pill className="w-5 h-5 text-[#2ED9A3]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Prescriptions Dispensed</h3>
            <p className="text-3xl font-light text-white">{dispensedCount} <span className="text-base text-white/40">Total</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="cyan" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/verify/rx-1')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#29F0E0]/10 flex items-center justify-center border border-[#29F0E0]/20">
                <ShieldCheck className="w-5 h-5 text-[#29F0E0]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Cryptographic Verifications</h3>
            <p className="text-3xl font-light text-white">100% <span className="text-base text-white/40">Success Rate</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="red" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/fraud')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center border border-[#FF4D6D]/20">
                <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">AI Fraud Flags</h3>
            <p className="text-3xl font-light text-[#FF4D6D]">4 <span className="text-base text-[#FF4D6D]/50">Suspicious</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="amber" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                <Activity className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Network Latency</h3>
            <p className="text-3xl font-light text-white">12<span className="text-base text-white/40">ms</span></p>
          </GlassPanel>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
             <GlassPanel className="p-6">
                <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-[#2ED9A3]" /> Inventory Status
                </h2>
                <InventoryBarChart />
             </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassPanel className="p-0 overflow-hidden border-white/5">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#2ED9A3]" /> Recent Fulfillment Activity
                </h2>
              </div>
              <div className="p-4">
                <DataTable 
                  data={auditLogs.slice(0, 8)}
                  columns={logColumns}
                  searchPlaceholder="Search logs..."
                  searchableKey="title"
                />
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassPanel accentColor="red" className="p-6 border-[#FF4D6D]/20">
              <h3 className="text-[#FF4D6D] uppercase text-[10px] tracking-widest font-mono mb-4 flex items-center gap-2">
                 <ShieldAlert className="w-3.5 h-3.5" /> Security Alerts
              </h3>
              <p className="text-white/70 text-sm mb-4">
                The Sirona AI network has detected a 15% increase in cross-state duplicate prescription attempts for Schedule II narcotics over the past 24 hours.
              </p>
              <button onClick={() => toast("Risk assessment opened in secure viewer")} className="text-[#FF4D6D] text-sm font-medium hover:underline flex items-center gap-1">
                View Risk Assessment <ArrowRight className="w-3 h-3" />
              </button>
            </GlassPanel>
          </motion.div>

          {/* Prescription Upload Panel for Pharmacy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <GlassPanel className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2ED9A3]" /> Upload Prescription
                </h3>
                {showUpload && (
                  <button onClick={() => setShowUpload(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                )}
              </div>
              <AnimatePresence mode="wait">
                {showUpload ? (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PrescriptionUpload
                      mode="pharmacy"
                      patientId="PAT-001"
                      onComplete={() => setShowUpload(false)}
                      onClose={() => setShowUpload(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowUpload(true)}
                    className="w-full py-2.5 border border-dashed border-[#2ED9A3]/30 rounded-xl text-sm text-[#2ED9A3]/70 hover:border-[#2ED9A3]/60 hover:text-[#2ED9A3] transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload prescription image (OCR)
                  </motion.button>
                )}
              </AnimatePresence>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassPanel className="p-6">
              <h3 className="text-white font-medium mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Digital Signatures Verified</span>
                    <span className="text-white">100%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#29F0E0] w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">AI Verification Speed</span>
                    <span className="text-white">{'< 1 sec'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2ED9A3] w-[95%]" />
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

