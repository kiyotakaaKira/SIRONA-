"use client";
import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { 
  Activity, Shield, Lock, FileText, Pill, AlertTriangle, 
  Brain, Upload, Link2, ChevronRight, Clock
} from "lucide-react";
import { useContinuityCapsule } from "../../../contexts/ContinuityCapsuleContext";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { DataTable } from "../../../components/DataTable";

// Bug 3 fix: lazy-load heavy chart components so they don't block the
// initial render. Each chart is below-the-fold content that can load
// after the critical KPI cards and action buttons are interactive.
const ChartSkeleton = () => (
  <div className="w-full h-full animate-pulse bg-white/5 rounded-xl" />
);

const HealthTimelineChart = dynamic(
  () => import("../../../components/charts/HealthTimelineChart").then(m => ({ default: m.HealthTimelineChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const VitalsChart = dynamic(
  () => import("../../../components/charts/VitalsChart").then(m => ({ default: m.VitalsChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const AccessDonutChart = dynamic(
  () => import("../../../components/charts/AccessDonutChart").then(m => ({ default: m.AccessDonutChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function PatientDashboard() {
  const router = useRouter();
  const { open: openCapsule } = useContinuityCapsule();
  const records = useStore(state => state.records);
  const grants = useStore(state => state.grants);
  const prescriptions = useStore(state => state.prescriptions);
  const auditLogs = useStore(state => state.auditLogs);
  const approveConsent = useStore(state => state.approveConsent);
  const uploadRecord = useStore(state => state.uploadRecord);
  const revokeConsent = useStore(state => state.revokeConsent);

  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    toast("Encrypting file...");
    await new Promise(r => setTimeout(r, 1000));
    
    uploadRecord({
      title: "New Retinal Scan",
      category: "Imaging",
      issuer: "EyeCare Clinic",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      encrypted: true
    });
    
    toast.success("Record uploaded to vault successfully");
    setIsUploading(false);
  };

  const pendingGrants = grants.filter(g => g.status === 'pending');
  const activeGrantsCount = grants.filter(g => g.status === 'approved').length;

  const auditColumns = [
    {
      header: "Type",
      accessorKey: "type",
      cell: (log: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          log.type === 'medical' ? 'bg-[#29F0E0]/10 text-[#29F0E0]' : 
          log.type === 'access' ? 'bg-[#2E6FFF]/10 text-[#2E6FFF]' : 
          'bg-[#FF4D6D]/10 text-[#FF4D6D]'
        }`}>
          {log.type.toUpperCase()}
        </span>
      ),
      sortable: true
    },
    { header: "Action", accessorKey: "title", sortable: true },
    { header: "Details", accessorKey: "description" },
    { header: "Time", accessorKey: "time", sortable: true }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#29F0E0]/80 mb-2">Patient Operating System</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">System Overview</motion.h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button onClick={handleUpload} disabled={isUploading} className="px-5 py-2.5 rounded-xl bg-[#29F0E0] text-black text-sm font-medium hover:bg-[#29F0E0]/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(41,240,224,0.2)] disabled:opacity-50">
            {isUploading ? <Upload className="w-4 h-4 animate-bounce" /> : <Upload className="w-4 h-4" />}
            {isUploading ? "Encrypting..." : "Upload Record"}
          </button>
          <button onClick={openCapsule} className="px-5 py-2.5 rounded-xl bg-[#2ED9A3]/10 border border-[#2ED9A3]/30 text-[#2ED9A3] text-sm font-medium hover:bg-[#2ED9A3]/20 transition-colors flex items-center gap-2">
            <Brain className="w-4 h-4" /> Open Capsule
          </button>
        </motion.div>
      </header>

      <motion.div 
        variants={motionVariants.staggerContainer} 
        initial="initial" 
        animate="animate" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      >
        {/* KPI Cards */}
        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="cyan" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/vault')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#29F0E0]/10 flex items-center justify-center border border-[#29F0E0]/20">
                <Lock className="w-5 h-5 text-[#29F0E0]" />
              </div>
              <span className="text-[10px] uppercase font-mono text-[#29F0E0] bg-[#29F0E0]/10 px-2 py-1 rounded">Sealed</span>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Health Vault</h3>
            <p className="text-3xl font-light text-white">{records.length} <span className="text-base text-white/40">Records</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="blue" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/consent')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2E6FFF]/10 flex items-center justify-center border border-[#2E6FFF]/20">
                <Link2 className="w-5 h-5 text-[#2E6FFF]" />
              </div>
              {pendingGrants.length > 0 && (
                <span className="text-[10px] uppercase font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded animate-pulse">{pendingGrants.length} Pending</span>
              )}
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Active Connections</h3>
            <p className="text-3xl font-light text-white">{activeGrantsCount} <span className="text-base text-white/40">Entities</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="green" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/prescriptions')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2ED9A3]/10 flex items-center justify-center border border-[#2ED9A3]/20">
                <Pill className="w-5 h-5 text-[#2ED9A3]" />
              </div>
              <span className="text-[10px] uppercase font-mono text-[#2ED9A3] bg-[#2ED9A3]/10 px-2 py-1 rounded">Verified</span>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Active Prescriptions</h3>
            <p className="text-3xl font-light text-white">{prescriptions.filter(p => p.status === 'active').length} <span className="text-base text-white/40">Medications</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="red" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/audit')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center border border-[#FF4D6D]/20">
                <Shield className="w-5 h-5 text-[#FF4D6D]" />
              </div>
              <span className="text-[10px] uppercase font-mono text-white/40 border border-white/10 px-2 py-1 rounded">Just now</span>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Security Score</h3>
            <p className="text-3xl font-light text-[#FF4D6D]">98<span className="text-base text-[#FF4D6D]/50">%</span></p>
          </GlassPanel>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassPanel className="p-6 h-[400px]">
              <h2 className="text-lg font-medium text-white mb-6">Health Score vs. Activity</h2>
              <HealthTimelineChart />
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-medium text-white flex items-center gap-2 px-2">
                <Activity className="w-5 h-5 text-[#2E6FFF]" /> Recent Network Activity
              </h2>
              <DataTable 
                data={auditLogs} 
                columns={auditColumns} 
                searchPlaceholder="Search activity logs..."
                searchableKey="title"
                itemsPerPage={5}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassPanel className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-[#FF4D6D]/20 bg-gradient-to-r from-[#FF4D6D]/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center border border-[#FF4D6D]/30 shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Emergency Break-Glass</h3>
                  <p className="text-white/50 text-sm">Pre-authorize hospitals to bypass consent in life-or-death situations.</p>
                </div>
              </div>
              <button onClick={() => router.push('/settings')} className="px-5 py-2.5 rounded-xl border border-[#FF4D6D]/40 text-[#FF4D6D] text-sm font-medium hover:bg-[#FF4D6D]/10 transition-colors whitespace-nowrap">
                Manage Emergency Settings
              </button>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Side Column */}
        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <GlassPanel className="p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-[#FF4D6D]" /> Biometric Telemetry</h3>
              <VitalsChart />
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassPanel accentColor="amber" className="p-0 overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-white font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-[#F59E0B]" /> Pending Action Required</h3>
              </div>
              <div className="p-5">
                {pendingGrants.length > 0 ? pendingGrants.map(grant => (
                  <div key={grant.id} className="p-4 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 mb-4">
                    <p className="text-xs text-[#F59E0B] uppercase tracking-wider mb-1">Access Request</p>
                    <p className="text-sm text-white">{grant.requester} is requesting access to your Vault for {grant.purpose}.</p>
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => { approveConsent(grant.id); toast.success("Access approved"); }} 
                        className="flex-1 py-2 rounded-lg bg-[#F59E0B] text-black text-xs font-medium hover:opacity-90"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => { revokeConsent(grant.id); toast.success("Access denied"); }} 
                        className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-xs hover:bg-white/5"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-white/40 text-sm text-center py-4">No pending actions required.</p>
                )}
                
                <button onClick={() => router.push('/consent')} className="w-full py-2.5 rounded-lg bg-white/5 text-white/70 text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  View Consent Center <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <GlassPanel className="p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#2E6FFF]" /> Data Access Distribution</h3>
              <AccessDonutChart />
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <GlassPanel className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2ED9A3] to-[#29F0E0] p-[1px] mb-4">
                <div className="w-full h-full bg-black/60 rounded-[11px] flex items-center justify-center backdrop-blur-md">
                  <Brain className="w-6 h-6 text-[#29F0E0]" />
                </div>
              </div>
              <h3 className="text-white font-medium mb-2">AI Health Insights</h3>
              <p className="text-white/50 text-sm mb-4">Your Continuity Capsule has identified a potential drug interaction between newly prescribed medications.</p>
              <button onClick={openCapsule} className="text-[#2ED9A3] text-sm font-medium hover:underline flex items-center gap-1">
                View AI Analysis <ChevronRight className="w-4 h-4" />
              </button>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
