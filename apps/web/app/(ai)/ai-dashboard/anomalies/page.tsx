"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { DataTable } from "../../../../components/DataTable";

interface AnomalyLog {
  id: string;
  type: string;
  source: string;
  time: string;
  status: "blocked" | "flagged" | "resolved";
  details: string;
}

const mockAnomalies: AnomalyLog[] = [
  { id: "AL-1001", type: "ZKP Signature Mismatch", source: "Princeton Plainsboro Node", time: "10 mins ago", status: "blocked", details: "Cryptographic signature check failed on Oxycodone prescription request. Hash validation mismatch." },
  { id: "AL-1002", type: "Concurrent Request Flood", source: "Walgreens Pharmacy Node", time: "1 hour ago", status: "flagged", details: "15 requests dispatched in under 500ms from the same patient token." },
  { id: "AL-1003", type: "Unauthorized Vault Query", source: "Unknown IP Address (172.53.12.9)", time: "4 hours ago", status: "blocked", details: "Attempted to query encrypted patient records index without a valid consent token block." },
  { id: "AL-1004", type: "Contract Rule Bypass Attempt", source: "Mercy Clinic Node", time: "12 hours ago", status: "resolved", details: "Smart Contract #9A1F coverage check skipped locally. Resolved after automatic re-sync audit." },
  { id: "AL-1005", type: "Expired Consent Usage", source: "Apollo Hospital Node", time: "1 day ago", status: "blocked", details: "Presented expired authorization ticket (c3) to fetch clinical lab history profiles." }
];

export default function AnomalyLogsPage() {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const selectedLog = mockAnomalies.find(l => l.id === selectedLogId);

  const columns = [
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${
          item.status === 'blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
          item.status === 'flagged' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {item.status}
        </span>
      ),
      sortable: true
    },
    {
      header: "Anomaly Type",
      accessorKey: "type",
      cell: (item: any) => <span className="font-medium text-white">{item.type}</span>,
      sortable: true
    },
    {
      header: "Source Node",
      accessorKey: "source",
      cell: (item: any) => <span className="text-white/70">{item.source}</span>
    },
    {
      header: "Time Detected",
      accessorKey: "time",
      cell: (item: any) => <span className="font-mono text-white/40 text-xs">{item.time}</span>,
      sortable: true
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <button 
          onClick={() => setSelectedLogId(item.id)}
          className="text-[#A855F7] hover:underline text-xs font-medium"
        >
          View Specs
        </button>
      )
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex justify-between items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#FF4D6D]/80 mb-2">Security Auditing</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Anomaly Logs</motion.h1>
        </motion.div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Logs Table */}
        <div className="flex-1 min-w-0">
          <GlassPanel className="p-6">
            <DataTable 
              data={mockAnomalies}
              columns={columns}
              searchPlaceholder="Search anomalies by type or node..."
              searchableKey="type"
            />
          </GlassPanel>
        </div>

        {/* Specs Details */}
        <AnimatePresence>
          {selectedLog && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[380px] shrink-0"
            >
              <GlassPanel accentColor="red" className="p-6 sticky top-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-medium text-lg">Anomaly Specifications</h3>
                  <button onClick={() => setSelectedLogId(null)} className="text-white/40 hover:text-white">✕</button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-[#FF4D6D] shrink-0" />
                    <div>
                      <span className="text-[10px] text-white/40 uppercase font-mono">Incident ID</span>
                      <span className="text-sm font-mono text-white block mt-0.5">{selectedLog.id}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Details & Description</p>
                    <p className="text-sm text-white/80 p-3 rounded bg-black/40 border border-white/5 italic">"{selectedLog.details}"</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Auditor recommendation</p>
                    <p className="text-xs text-white/60">
                      {selectedLog.status === 'blocked' ? 'The request was automatically blocked. No further action is required unless this node reports persistent sync discrepancies.' :
                       selectedLog.status === 'flagged' ? 'High risk actions detected. Ensure user session is validated. Monitor peer requests from node.' :
                       'Bypass logic resolved during re-sync. No security risk detected.'}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
