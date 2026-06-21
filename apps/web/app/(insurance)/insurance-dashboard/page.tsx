"use client";
import React from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, FileSignature, FileCode2, CheckCircle2, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { DataTable } from "../../../components/DataTable";
import { ClaimsProcessingChart } from "../../../components/charts/ClaimsProcessingChart";

export default function InsuranceDashboard() {
  const router = useRouter();

  const claimsData = [
    { id: "1", title: "Prescription Claim: Amoxicillin", desc: "Cryptographic signature verified against Apollo Hospital node. Approved by Smart Contract #4A9B.", time: "Just now", status: "Approved" },
    { id: "2", title: "Outpatient Visit", desc: "Signature verified. Coverage active. Co-pay applied by contract.", time: "1 min ago", status: "Approved" },
    { id: "3", title: "MRI Scan Approval", desc: "AI flagged missing pre-authorization documentation in the patient vault.", time: "5 mins ago", status: "Denied" },
    { id: "4", title: "Emergency Room Services", desc: "Break-glass protocol detected. Auto-approved per emergency trauma ruleset.", time: "12 mins ago", status: "Approved" },
    { id: "5", title: "Flu Shot Immunization", desc: "Verified Walgreens Pharmacy signature. Core vaccine benefit active.", time: "15 mins ago", status: "Approved" },
    { id: "6", title: "Retinal Laser Treatment", desc: "Pending medical director signoff. Custom specialist code detected.", time: "25 mins ago", status: "Denied" },
    { id: "7", title: "Echocardiogram Diagnostic", desc: "Apollo Labs verified. Covered under diagnostic heart disease panel.", time: "30 mins ago", status: "Approved" },
    { id: "8", title: "Metformin Diabetes Rx", desc: "Smart contract verified. Co-pay: $5.00 applied successfully.", time: "45 mins ago", status: "Approved" },
    { id: "9", title: "Lumbar MRI Spine Scan", desc: "Prior authorization found and verified against patient vault signature.", time: "50 mins ago", status: "Approved" },
    { id: "10", title: "Lisinopril 10mg refills", desc: "Signature check passed. Refills: 2 remaining.", time: "1 hour ago", status: "Approved" }
  ];

  const columns = [
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        const isApproved = item.status === "Approved";
        const Icon = isApproved ? CheckCircle2 : AlertTriangle;
        const color = isApproved ? "text-[#2ED9A3]" : "text-[#FF4D6D]";
        return (
          <div className="flex items-center gap-3">
             <Icon className={`w-5 h-5 ${color}`} />
             <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-mono ${isApproved ? 'bg-[#2ED9A3]/10 text-[#2ED9A3] border-[#2ED9A3]/30' : 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30'}`}>
                {item.status}
             </span>
          </div>
        );
      },
      sortable: true
    },
    {
      header: "Claim",
      accessorKey: "title",
      cell: (item: any) => <span className="font-medium text-white">{item.title}</span>,
      sortable: true
    },
    {
      header: "Adjudication Details",
      accessorKey: "desc",
      cell: (item: any) => <span className="text-white/50 text-sm">{item.desc}</span>
    },
    {
      header: "Time",
      accessorKey: "time",
      sortable: true,
      cell: (item: any) => <span className="text-xs text-white/30 font-mono">{item.time}</span>
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2ED9A3]/80 mb-2">Blue Cross Operations</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Claims Command Center</motion.h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button onClick={() => router.push('/claims')} className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
            <FileSignature className="w-4 h-4" /> Process Pending Claims
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
          <GlassPanel accentColor="green" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/claims')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2ED9A3]/10 flex items-center justify-center border border-[#2ED9A3]/20">
                <FileSignature className="w-5 h-5 text-[#2ED9A3]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Auto-Adjudicated</h3>
            <p className="text-3xl font-light text-white">12,492 <span className="text-base text-white/40">Today</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="cyan" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => router.push('/contracts')}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#29F0E0]/10 flex items-center justify-center border border-[#29F0E0]/20">
                <FileCode2 className="w-5 h-5 text-[#29F0E0]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Smart Contract Rules</h3>
            <p className="text-3xl font-light text-white">8,405 <span className="text-base text-white/40">Active</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="amber" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                <DollarSign className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Processing Savings</h3>
            <p className="text-3xl font-light text-white">$4.2M <span className="text-base text-white/40">YTD</span></p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={motionVariants.resolveIn}>
          <GlassPanel accentColor="red" className="p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center border border-[#FF4D6D]/20">
                <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" />
              </div>
              <span className="text-[10px] uppercase font-mono text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-1 rounded animate-pulse">Action Req</span>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Flagged Claims</h3>
            <p className="text-3xl font-light text-[#FF4D6D]">14 <span className="text-base text-[#FF4D6D]/50">Manual Review</span></p>
          </GlassPanel>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
             <GlassPanel className="p-6">
                <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-[#2ED9A3]" /> Claim Processing Volume
                </h2>
                <ClaimsProcessingChart />
             </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassPanel className="p-0 overflow-hidden border-white/5">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#2ED9A3]" /> Real-time Adjudication Stream
                </h2>
                <button className="text-sm text-white/40 hover:text-white transition-colors">Pause Stream</button>
              </div>
              <div className="p-4">
                <DataTable 
                  data={claimsData}
                  columns={columns}
                  searchPlaceholder="Search claims..."
                  searchableKey="title"
                />
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassPanel accentColor="cyan" className="p-6 border-[#29F0E0]/20 bg-gradient-to-br from-[#29F0E0]/5 to-transparent">
              <h3 className="text-[#29F0E0] uppercase text-[10px] tracking-widest font-mono mb-4 flex items-center gap-2">
                 <Shield className="w-3.5 h-3.5" /> HealthMesh Ledger Sync
              </h3>
              <p className="text-white/70 text-sm mb-6">
                All claims are cryptographically verified against the patient's immutable health vault signatures. No manual intervention required for verified clean claims.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Auto-Adjudication Rate</span>
                  <span className="text-lg text-white font-medium">96.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Avg Processing Time</span>
                  <span className="text-lg text-white font-medium">0.8s</span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
             <GlassPanel className="p-6 flex flex-col items-center justify-center text-center py-10 cursor-pointer hover:bg-white/5 transition-colors border-dashed border-white/20" onClick={() => router.push('/contracts')}>
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                 <FileCode2 className="w-6 h-6 text-white/40" />
               </div>
               <h3 className="text-white font-medium mb-1">Deploy Smart Contract</h3>
               <p className="text-sm text-white/40">Update global coverage rules logic.</p>
             </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
