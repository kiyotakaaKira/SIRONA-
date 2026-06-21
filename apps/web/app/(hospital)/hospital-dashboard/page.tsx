"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { Users, FileText, Pill, AlertTriangle, Brain, Search, Activity, HeartPulse, Shield, FileSignature, Upload, X } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { DataTable } from "../../../components/DataTable";
import { PatientVolumeChart } from "../../../components/charts/PatientVolumeChart";
import { PrescriptionUpload } from "../../../components/PrescriptionUpload";
import { AnimatePresence } from "framer-motion";

export default function HospitalDashboard() {
  const router = useRouter();
  const prescriptions = useStore(state => state.prescriptions);
  const grants = useStore(state => state.grants);
  const auditLogs = useStore(state => state.auditLogs);
  const [showUpload, setShowUpload] = useState(false);
  // In a real app, the hospital would select a patient; demo uses PAT-001
  const DEMO_PATIENT_ID = 'PAT-001';

  const pendingGrantsCount = grants.filter(g => g.status === 'pending').length;
  const approvedGrantsCount = grants.filter(g => g.status === 'approved').length;

  const logColumns = [
    {
      header: "Type",
      accessorKey: "type",
      className: "whitespace-nowrap w-16",
      cell: (item: any) => {
        let icon = Activity;
        let colorClass = "text-white";
        let bgClass = "bg-white/10";
        
        if (item.type === 'medical') {
          icon = FileText;
          colorClass = "text-[#29F0E0]";
          bgClass = "bg-[#29F0E0]/10";
        } else if (item.type === 'access') {
          icon = Shield;
          colorClass = "text-[#2E6FFF]";
          bgClass = "bg-[#2E6FFF]/10";
        } else if (item.type === 'security') {
          icon = AlertTriangle;
          colorClass = "text-[#FF4D6D]";
          bgClass = "bg-[#FF4D6D]/10";
        }

        const Icon = icon;
        return (
          <div className={`p-2 rounded-lg ${bgClass} shrink-0 inline-flex`}>
            <Icon className={`w-4 h-4 ${colorClass}`} />
          </div>
        );
      }
    },
    {
      header: "Action",
      accessorKey: "title",
      className: "whitespace-nowrap w-56",
      cell: (item: any) => <span className="font-medium text-white">{item.title}</span>,
      sortable: true
    },
    {
      header: "Description",
      accessorKey: "description",
      className: "min-w-[300px]",
      cell: (item: any) => <span className="text-white/60 text-sm leading-relaxed">{item.description}</span>
    },
    {
      header: "Time",
      accessorKey: "time",
      sortable: true,
      align: "right",
      className: "whitespace-nowrap pr-8",
      cell: (item: any) => <span className="font-mono text-white/50">{item.time}</span>
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2E6FFF]/80 mb-2">Apollo Demo Hospital</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Provider Command Center</motion.h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button onClick={() => router.push('/search')} className="px-5 py-2.5 rounded-xl bg-[#2E6FFF] text-white text-sm font-medium hover:bg-[#2E6FFF]/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(46,111,255,0.2)]">
            <Search className="w-4 h-4" /> Locate Patient
          </button>
          <button onClick={() => router.push('/break-glass')} className="px-5 py-2.5 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-sm font-medium hover:bg-[#FF4D6D]/20 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Break-Glass Protocol
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
          <GlassPanel className="p-6 h-full cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(46,111,255,0.15)] transition-all border border-white/5 hover:border-[#2E6FFF]/30 overflow-hidden relative group" onClick={() => router.push('/search')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E6FFF]/10 rounded-bl-full pointer-events-none group-hover:bg-[#2E6FFF]/20 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E6FFF]/30 to-transparent flex items-center justify-center border border-[#2E6FFF]/30 shadow-[inset_0_0_12px_rgba(46,111,255,0.2)]">
                <Users className="w-6 h-6 text-[#29F0E0]" />
              </div>
            </div>
            <h3 className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1 relative z-10">Active Patient Files</h3>
            <p className="text-4xl font-light text-white relative z-10">124 <span className="text-sm font-normal text-white/40">Accessed</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel className="p-6 h-full cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)] transition-all border border-white/5 hover:border-[#F59E0B]/30 overflow-hidden relative group" onClick={() => router.push('/requests')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-bl-full pointer-events-none group-hover:bg-[#F59E0B]/20 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B]/30 to-transparent flex items-center justify-center border border-[#F59E0B]/30 shadow-[inset_0_0_12px_rgba(245,158,11,0.2)]">
                <FileText className="w-6 h-6 text-[#F59E0B]" />
              </div>
              {pendingGrantsCount > 0 && (
                <span className="text-[10px] uppercase font-mono text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-2 py-1 rounded animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">{pendingGrantsCount} Pending</span>
              )}
            </div>
            <h3 className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1 relative z-10">Consent Requests</h3>
            <p className="text-4xl font-light text-white relative z-10">{approvedGrantsCount} <span className="text-sm font-normal text-white/40">Approved</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel className="p-6 h-full cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(46,217,163,0.15)] transition-all border border-white/5 hover:border-[#2ED9A3]/30 overflow-hidden relative group" onClick={() => router.push('/prescribe')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ED9A3]/10 rounded-bl-full pointer-events-none group-hover:bg-[#2ED9A3]/20 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2ED9A3]/30 to-transparent flex items-center justify-center border border-[#2ED9A3]/30 shadow-[inset_0_0_12px_rgba(46,217,163,0.2)]">
                <Pill className="w-6 h-6 text-[#2ED9A3]" />
              </div>
            </div>
            <h3 className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1 relative z-10">Prescriptions Issued</h3>
            <p className="text-4xl font-light text-white relative z-10">{prescriptions.length} <span className="text-sm font-normal text-white/40">Total</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel className="p-6 h-full cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,77,109,0.15)] transition-all border border-white/5 hover:border-[#FF4D6D]/30 overflow-hidden relative group" onClick={() => router.push('/break-glass')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D6D]/10 rounded-bl-full pointer-events-none group-hover:bg-[#FF4D6D]/20 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/30 to-transparent flex items-center justify-center border border-[#FF4D6D]/30 shadow-[inset_0_0_12px_rgba(255,77,109,0.2)]">
                <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
              </div>
            </div>
            <h3 className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1 relative z-10">Emergency Overrides</h3>
            <p className="text-4xl font-light text-[#FF4D6D] relative z-10">2<span className="text-sm font-normal text-[#FF4D6D]/50 ml-1">Events</span></p>
          </GlassPanel>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
             <GlassPanel className="p-6">
                <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-[#2E6FFF]" /> Daily Patient Volume
                </h2>
                <PatientVolumeChart />
             </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassPanel className="p-0 overflow-hidden border-white/5">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-[#2E6FFF]" /> Recent Clinical Activity
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
            <GlassPanel className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2E6FFF] to-[#29F0E0] p-[1px] mb-4">
                <div className="w-full h-full bg-black/60 rounded-[11px] flex items-center justify-center backdrop-blur-md">
                  <Brain className="w-6 h-6 text-[#29F0E0]" />
                </div>
              </div>
              <h3 className="text-white font-medium mb-2">AI Network Alerts</h3>
              <p className="text-white/50 text-sm mb-4">The pharmacy network has flagged a potentially fraudulent prescription originating from your institution's ID.</p>
              <button onClick={() => router.push('/ai-dashboard')} className="text-[#2E6FFF] text-sm font-medium hover:underline flex items-center gap-1">
                Investigate Anomaly →
              </button>
            </GlassPanel>
          </motion.div>

          {/* Prescription Upload Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassPanel className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2E6FFF]" /> Upload Prescription
                </h3>
                {showUpload && (
                  <button onClick={() => setShowUpload(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                )}
              </div>
              <AnimatePresence mode="wait">
                {showUpload ? (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PrescriptionUpload
                      mode="patient"
                      patientId={DEMO_PATIENT_ID}
                      onComplete={() => setShowUpload(false)}
                      onClose={() => setShowUpload(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowUpload(true)}
                    className="w-full py-2.5 border border-dashed border-[#2E6FFF]/30 rounded-xl text-sm text-[#2E6FFF]/70 hover:border-[#2E6FFF]/60 hover:text-[#2E6FFF] transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload patient prescription image
                  </motion.button>
                )}
              </AnimatePresence>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
