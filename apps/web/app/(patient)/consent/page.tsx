"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Pill,
  Shield,
  User,
  CheckCircle2,
  X,
  Lock,
  Unlink2,
  Clock,
  Ban,
  Users,
  Search
} from "lucide-react";
import { GlassPanel, motionVariants, springSnappy } from "@healthmesh/ui";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { ConsentNetworkVisual } from "../../../components/charts/ConsentNetworkVisual";
import { DataTable } from "../../../components/DataTable";

export default function ConsentNetworkPage() {
  const consents = useStore(state => state.grants);
  const approveConsent = useStore(state => state.approveConsent);
  const revokeConsent = useStore(state => state.revokeConsent);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | "all">("all");

  const selected = consents.find((c) => c.id === selectedId);

  const approve = useCallback((id: string) => {
    approveConsent(id);
    toast.success("Access approved and cryptographically signed");
  }, [approveConsent]);

  const revoke = useCallback((id: string) => {
    revokeConsent(id);
    setSelectedId(null);
    toast.success("Access revoked and disconnected");
  }, [revokeConsent]);

  const filteredConsents = consents.filter(c => activeTab === "all" || c.status === activeTab);

  const columns = [
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => (
        <div className={`p-2 rounded-lg inline-flex ${
          item.status === 'approved' ? 'bg-[#29F0E0]/10 text-[#29F0E0]' :
          item.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
          item.status === 'revoked' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' :
          item.status === 'expired' ? 'bg-white/10 text-white/50' :
          'bg-purple-500/10 text-purple-400'
        }`}>
          {item.status === 'approved' && <CheckCircle2 className="w-5 h-5" />}
          {item.status === 'pending' && <Clock className="w-5 h-5" />}
          {item.status === 'revoked' && <Ban className="w-5 h-5" />}
          {item.status === 'expired' && <X className="w-5 h-5" />}
          {item.status === 'delegated' && <Users className="w-5 h-5" />}
        </div>
      )
    },
    {
      header: "Requester",
      accessorKey: "requester",
      sortable: true,
      cell: (item: any) => <span className="font-medium text-white">{item.requester}</span>
    },
    {
      header: "Purpose",
      accessorKey: "purpose"
    },
    {
      header: "Scope",
      accessorKey: "scope",
      cell: (item: any) => (
        <div className="flex flex-wrap gap-1.5">
          {item.scope.map((s: string) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/60 bg-white/5">{s}</span>
          ))}
        </div>
      )
    },
    {
      header: "Expiry",
      accessorKey: "expiry",
      sortable: true,
      cell: (item: any) => <span className="font-mono text-white/50">{item.expiry}</span>
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <button 
          onClick={() => setSelectedId(item.id)}
          className="text-[#29F0E0] hover:underline text-xs font-medium"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden font-sans">
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">Consent Engine</h1>
          <p className="mt-2 text-white/50 text-lg">You decide who connects to your vault.</p>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 px-6 md:px-10 pb-8 max-w-[1400px] mx-auto">
        {/* Network graph & Detail panel */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <ConsentNetworkVisual />

          {/* List View */}
          <GlassPanel className="p-0 overflow-hidden">
             <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                {['all', 'pending', 'approved', 'expired', 'revoked', 'delegated'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#29F0E0] border-b-2 border-[#29F0E0]' : 'text-white/50 hover:text-white'}`}
                  >
                    {tab} ({tab === 'all' ? consents.length : consents.filter(c => c.status === tab).length})
                  </button>
                ))}
             </div>
             <div className="p-4">
               <DataTable 
                 data={filteredConsents}
                 columns={columns}
                 searchPlaceholder="Search by requester or purpose..."
                 searchableKey="requester"
               />
             </div>
          </GlassPanel>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              variants={motionVariants.sheetSlide}
              initial="initial"
              animate="animate"
              exit="exit"
              className="lg:w-[380px] w-full shrink-0"
            >
              <GlassPanel accentColor={
                selected.status === "pending" ? "amber" : 
                selected.status === "revoked" ? "red" : 
                selected.status === "expired" ? undefined : "cyan"
              } className="h-full flex flex-col gap-6 sticky top-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Consent Details</p>
                    <h2 className="text-xl font-medium text-white">{selected.requester}</h2>
                    <p className="text-sm text-white/50 mt-1">{selected.purpose}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-mono ${
                     selected.status === 'approved' ? 'bg-[#29F0E0]/10 text-[#29F0E0] border border-[#29F0E0]/30' :
                     selected.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' :
                     selected.status === 'revoked' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/30' :
                     selected.status === 'expired' ? 'bg-white/10 text-white/50 border border-white/20' :
                     'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}>
                    {selected.status}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Scope Details</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.scope.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-full text-xs border border-white/15 text-white/70 bg-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   {selected.status === 'pending' || selected.status === 'approved' ? (
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke={selected.status === "pending" ? "#F59E0B" : "#29F0E0"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="94.2"
                          initial={{ strokeDashoffset: 94.2 }}
                          animate={{ strokeDashoffset: selected.status === "pending" ? 30 : 10 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                   ) : (
                     <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center">
                       {selected.status === 'expired' ? <Clock className="w-5 h-5 text-white/30" /> : <Ban className="w-5 h-5 text-[#FF4D6D]/50" />}
                     </div>
                   )}
                  <div>
                    <p className="text-xs text-white/40">{selected.status === 'expired' ? 'Expired on' : selected.status === 'revoked' ? 'Revoked on' : 'Expires in'}</p>
                    <p className="text-lg font-mono text-white">{selected.expiry}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Cryptographic Signature</p>
                     <p className="text-xs font-mono text-[#29F0E0] truncate">0x{Array.from(selected.id).map(c => c.charCodeAt(0).toString(16)).join('')}8a9b0c1d2e3f4a5b6c7d</p>
                   </div>
                   <div className="flex gap-6">
                     <div className="flex-1">
                       <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Network Node ID</p>
                       <p className="text-xs font-mono text-white/70">{selected.nodeId}</p>
                     </div>
                     <div className="flex-1">
                       <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Date Issued</p>
                       <p className="text-xs text-white/70 font-mono">{selected.date}</p>
                     </div>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Compliance Framework</p>
                     <div className="flex gap-2">
                       <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded border border-[#2ED9A3]/30 bg-[#2ED9A3]/10 text-[#2ED9A3] uppercase tracking-wider">
                         <Shield className="w-2.5 h-2.5"/> HIPAA
                       </span>
                       <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded border border-white/20 bg-white/5 text-white/70 uppercase tracking-wider">
                         <Lock className="w-2.5 h-2.5"/> ONC Certified
                       </span>
                     </div>
                   </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-white/10">
                  {selected.status === "pending" ? (
                    <>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => approve(selected.id)}
                        className="w-full py-3 rounded-xl bg-[#2E6FFF] text-white font-medium shadow-[0_0_30px_rgba(46,111,255,0.35)]"
                      >
                        Approve Access
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="w-full py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm"
                      >
                        Deny
                      </button>
                    </>
                  ) : selected.status === "approved" ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => revoke(selected.id)}
                      className="w-full py-3 rounded-xl border border-[#FF4D6D]/40 text-[#FF4D6D] bg-[#FF4D6D]/10 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Unlink2 className="w-4 h-4" /> Revoke Connection
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="w-full py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm"
                    >
                      Close Details
                    </button>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
