"use client";
import React from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion } from "framer-motion";
import { Shield, Unlock, AlertTriangle, FileText, Download } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { DataTable } from "../../../components/DataTable";
import { RiskDistributionChart } from "../../../components/charts/RiskDistributionChart";

export default function AuditPage() {
  const auditLogs = useStore(state => state.auditLogs);

  const columns = [
    {
      header: "Event Type",
      accessorKey: "type",
      cell: (item: any) => {
        const style = item.type === 'system' ? "text-[#2ED9A3] bg-[#2ED9A3]/10" :
                      item.type === 'access' ? "text-[#2E6FFF] bg-[#2E6FFF]/10" :
                      item.type === 'medical' ? "text-[#29F0E0] bg-[#29F0E0]/10" :
                      "text-[#FF4D6D] bg-[#FF4D6D]/10";
        const Icon = item.type === 'system' ? Shield :
                     item.type === 'access' ? Unlock :
                     item.type === 'medical' ? FileText : AlertTriangle;
        return (
          <div className={`p-2 rounded-lg inline-flex ${style}`}>
            <Icon className="w-5 h-5" />
          </div>
        );
      },
      sortable: true
    },
    {
      header: "Action",
      accessorKey: "title",
      cell: (item: any) => <span className="font-medium text-white">{item.title}</span>,
      sortable: true
    },
    {
      header: "Description",
      accessorKey: "description"
    },
    {
      header: "Signature",
      accessorKey: "id",
      cell: (item: any) => <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{item.id}</span>
    },
    {
      header: "Time",
      accessorKey: "time",
      sortable: true,
      cell: (item: any) => <span className="font-mono text-white/80">{item.time}</span>
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#29F0E0]/80 mb-2">Security Operations Center</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Audit Trail</motion.h1>
          <p className="mt-2 text-white/50 text-lg">Cryptographic audit trail of all access events.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </motion.div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Risk Chart Side */}
        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
          <GlassPanel className="p-6">
            <h2 className="text-lg font-medium text-white mb-2">Threat Intelligence</h2>
            <p className="text-sm text-white/50 mb-6">Distribution of recorded security events across risk categories.</p>
            <RiskDistributionChart />
          </GlassPanel>

          <GlassPanel accentColor="red" className="p-6 border-[#FF4D6D]/30 bg-[#FF4D6D]/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#FF4D6D]/10">
                <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
              </div>
              <div>
                <h3 className="text-white font-medium">Critical Alerts</h3>
                <p className="text-sm text-[#FF4D6D]">2 Unresolved</p>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-4">Unusual access patterns detected from IP ranges outside your typical geolocation.</p>
            <button className="w-full py-2 bg-[#FF4D6D]/20 hover:bg-[#FF4D6D]/30 text-[#FF4D6D] rounded text-sm font-medium transition-colors">
              Review Alerts
            </button>
          </GlassPanel>
        </div>

        {/* Audit Log Table Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <GlassPanel className="p-0 overflow-hidden h-full">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-lg font-medium text-white">Event Log</h2>
            </div>
            <div className="p-4">
              <DataTable 
                data={auditLogs}
                columns={columns}
                searchPlaceholder="Search events or descriptions..."
                searchableKey="title"
                itemsPerPage={12}
              />
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
