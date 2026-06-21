"use client";
import React, { useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { Plus, Clock, CheckCircle2, AlertTriangle, XCircle, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Mock Data
const MOCK_REQUESTS = [
  { id: "REQ-001", patientName: "John Doe", patientId: "1111-1111", purpose: "Surgical Consultation", scope: "Lab Reports, Allergies", status: "active", time: "Expires in 23h 45m" },
  { id: "REQ-002", patientName: "Jane Smith", patientId: "1234-5678", purpose: "Second Opinion", scope: "Prescriptions", status: "pending", time: "Requested 2h ago" },
  { id: "REQ-003", patientName: "Michael Johnson", patientId: "4444-5555", purpose: "Emergency Override", scope: "Full Medical History", status: "denied", time: "Denied 1d ago" },
  { id: "REQ-004", patientName: "Sarah Williams", patientId: "9999-8888", purpose: "Routine Checkup", scope: "Vitals, Immunizations", status: "expired", time: "Expired 2d ago" },
  { id: "REQ-005", patientName: "Emily Chen", patientId: "5555-4444", purpose: "Specialist Referral", scope: "MRI Scans, Specialist Notes", status: "active", time: "Expires in 6d 12h" },
  { id: "REQ-006", patientName: "Marcus Thorne", patientId: "7777-6666", purpose: "Pharmacy Verification", scope: "Active Prescriptions", status: "pending", time: "Requested 15m ago" },
];

export default function RequestsPage() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const filteredRequests = MOCK_REQUESTS.filter(r => filter === "all" || r.status === filter);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'active': return { icon: CheckCircle2, color: "text-[#2ED9A3]", bg: "bg-[#2ED9A3]/10", border: "border-[#2ED9A3]/30", panelAccent: "green" };
      case 'pending': return { icon: Clock, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/30", panelAccent: "amber" };
      case 'denied': return { icon: XCircle, color: "text-[#FF4D6D]", bg: "bg-[#FF4D6D]/10", border: "border-[#FF4D6D]/30", panelAccent: "red" };
      case 'expired': return { icon: AlertTriangle, color: "text-white/40", bg: "bg-white/5", border: "border-white/10", panelAccent: "default" };
      default: return { icon: Clock, color: "text-white", bg: "bg-white/10", border: "border-white/20", panelAccent: "default" };
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Consent Requests</h1>
          <p className="text-white/50 text-lg">Manage cryptographic data access requests for patients.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#2E6FFF] to-[#29F0E0] text-black font-medium rounded-xl hover:opacity-90 shadow-[0_0_30px_rgba(46,111,255,0.4)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'active', 'pending', 'denied', 'expired'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'bg-transparent text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredRequests.map((req, idx) => {
            const config = getStatusConfig(req.status);
            const Icon = config.icon;
            
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassPanel accentColor={config.panelAccent as any} className="p-6 h-full flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)] transition-all cursor-pointer">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${config.bg} ${config.color} border ${config.border}`}>
                          {req.patientName.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white group-hover:text-[#2E6FFF] transition-colors">{req.patientName}</h3>
                          <span className="text-xs font-mono text-white/40">{req.patientId}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${config.bg} ${config.color} ${config.border}`}>
                        <Icon className="w-3 h-3" /> {req.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-white/70"><span className="text-white/40 uppercase text-[10px] tracking-wider block mb-0.5">Purpose</span> {req.purpose}</p>
                      <p className="text-sm text-white/70"><span className="text-white/40 uppercase text-[10px] tracking-wider block mb-0.5">Requested Scope</span> {req.scope}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="text-xs text-white/40 font-mono">{req.time}</span>
                    {req.status === 'active' && (
                      <button onClick={() => router.push(`/patient/${req.patientId}`)} className="text-sm text-[#2ED9A3] hover:text-white transition-colors flex items-center gap-1 font-medium">
                        View Records <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative w-full max-w-md">
              <GlassPanel accentColor="blue" className="p-8">
                <h2 className="text-2xl font-light tracking-tight text-white mb-6">Request Data Access</h2>
                <form className="flex flex-col gap-5">
                  <div>
                    <label className="text-[10px] font-medium text-white/50 uppercase tracking-widest block mb-2">Patient ID</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="e.g., 1234-5678" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white font-mono focus:outline-none focus:border-[#2E6FFF]/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-white/50 uppercase tracking-widest block mb-2">Purpose</label>
                    <input type="text" placeholder="e.g., Surgical Consultation" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#2E6FFF]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-white/50 uppercase tracking-widest block mb-2">Duration</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#2E6FFF]/50 transition-colors appearance-none">
                      <option className="bg-[#0a1017]">24 Hours</option>
                      <option className="bg-[#0a1017]">1 Week</option>
                      <option className="bg-[#0a1017]">1 Month</option>
                    </select>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors font-medium">
                      Cancel
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gradient-to-r from-[#2E6FFF] to-[#29F0E0] text-black font-medium rounded-xl hover:opacity-90 shadow-[0_0_20px_rgba(46,111,255,0.3)] transition-all">
                      Send Request
                    </button>
                  </div>
                </form>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
