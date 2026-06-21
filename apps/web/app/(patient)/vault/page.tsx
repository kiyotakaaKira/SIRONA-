"use client";
import React, { useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileText, Pill, FileSignature, ShieldAlert, Upload, ShieldCheck, Download, Trash2, Eye, X } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { DataTable } from "../../../components/DataTable";
import { PrescriptionUpload } from "../../../components/PrescriptionUpload";

export default function VaultPage() {
  const records = useStore(state => state.records);
  const deleteRecord = useStore(state => state.deleteRecord);
  const user = useStore(state => state.user);

  const [filter, setFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [downloadPinPrompt, setDownloadPinPrompt] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");

  const patientId = user?.patientId ?? 'PAT-001';

  const filteredRecords = records.filter(r =>
    filter === "all" || r.category.toLowerCase().includes(filter)
  );

  const handleDelete = async (id: string) => {
    deleteRecord(id);
    setSelectedRecord(null);
    toast.success("Record deleted permanently");
  };

  const columns = [
    {
      header: "Record Title",
      accessorKey: "title",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
            {item.category.toLowerCase().includes('lab') ? <FileText className="w-4 h-4 text-blue-400" /> : 
             item.category.toLowerCase().includes('allerg') ? <ShieldAlert className="w-4 h-4 text-red-400" /> : 
             item.category.toLowerCase().includes('insur') ? <FileSignature className="w-4 h-4 text-green-400" /> : 
             <Pill className="w-4 h-4 text-cyan-400" />}
          </div>
          <span className="font-medium text-white">{item.title}</span>
        </div>
      ),
      sortable: true
    },
    { header: "Category", accessorKey: "category", sortable: true, cell: (item: any) => <span className="capitalize">{item.category}</span> },
    { header: "Issuer", accessorKey: "issuer", sortable: true },
    { header: "Date Added", accessorKey: "date", sortable: true },
    {
      header: "Status",
      accessorKey: "encrypted",
      cell: () => (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-[#29F0E0]/30 text-[#29F0E0] text-[10px] font-mono w-fit">
          <Lock className="w-3 h-3" /> SEALED
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <button 
          onClick={() => setSelectedRecord(item.id)}
          className="text-white/40 hover:text-white px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen flex flex-col md:flex-row gap-8">
      {/* Sidebar Metrics */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-[#29F0E0]/20 to-[#2E6FFF]/20 border border-white/10 rounded-xl shadow-[0_0_15px_rgba(41,240,224,0.15)]">
              <FileText className="w-6 h-6 text-[#29F0E0]" />
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">Document Storage</h1>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">Secure, cryptographically sealed storage unit for all your medical records and health documents.</p>
        </div>
        
        <button
          onClick={() => setShowUpload(true)}
          className="w-full py-3 bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] text-black font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(41,240,224,0.2)]"
        >
          <Upload className="w-4 h-4" /> Upload Prescription
        </button>

        {/* Prescription OCR Upload Panel */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassPanel className="p-5 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-white">Prescription OCR Upload</h3>
                  <button onClick={() => setShowUpload(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <PrescriptionUpload
                  mode="patient"
                  patientId={patientId}
                  onComplete={() => setShowUpload(false)}
                  onClose={() => setShowUpload(false)}
                />
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        <GlassPanel className="p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Storage</h3>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#29F0E0] w-[15%]"></div>
            </div>
            <p className="text-white/40 text-xs mt-2">150 MB / 1 GB Used</p>
          </div>
          <div>
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Encryption Status</h3>
            <div className="flex items-center gap-2 text-[#2ED9A3] text-sm font-medium">
              <ShieldCheck className="w-4 h-4" /> AES-256-GCM Active
            </div>
          </div>
        </GlassPanel>

        <div className="flex flex-col gap-2">
          <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2 px-2">Categories</h3>
          {['all', 'lab', 'imaging', 'immunization', 'allergies', 'insurance'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm transition-colors capitalize ${filter === cat ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              {cat === 'lab' ? 'Lab Results' : cat === 'insurance' ? 'Insurance Policies' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 gap-6">
        <div className="flex justify-between items-center mb-2">
           <div className="relative w-full max-w-md">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg className="h-5 w-5 text-white/40" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
             </div>
             <input
               type="text"
               placeholder="Search documents..."
               className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-black/40 text-white placeholder-white/40 focus:outline-none focus:border-[#29F0E0]/50 transition-colors sm:text-sm"
             />
           </div>
           <div className="flex items-center gap-2 text-white/40">
             <button className="p-2 bg-white/10 rounded hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
             <button className="p-2 hover:bg-white/5 rounded hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecords.map((r) => (
            <div 
              key={r.id}
              onClick={() => setSelectedRecord(r.id)}
              className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#29F0E0]/50 hover:bg-white/10 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(41,240,224,0.15)]"
            >
               {/* Document Thumbnail Area */}
               <div className="h-32 bg-gradient-to-br from-black/60 to-black/20 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                 <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-[#29F0E0]/30 text-[#29F0E0] text-[9px] uppercase tracking-wider font-mono">
                   <Lock className="w-3 h-3" /> Sealed
                 </div>
                 
                 {r.category.toLowerCase().includes('lab') ? <FileText className="w-12 h-12 text-blue-400/50 group-hover:text-blue-400 group-hover:scale-110 transition-all" /> : 
                  r.category.toLowerCase().includes('allerg') ? <ShieldAlert className="w-12 h-12 text-red-400/50 group-hover:text-red-400 group-hover:scale-110 transition-all" /> : 
                  r.category.toLowerCase().includes('insur') ? <FileSignature className="w-12 h-12 text-green-400/50 group-hover:text-green-400 group-hover:scale-110 transition-all" /> : 
                  r.category.toLowerCase().includes('imag') ? <Eye className="w-12 h-12 text-purple-400/50 group-hover:text-purple-400 group-hover:scale-110 transition-all" /> :
                  <Pill className="w-12 h-12 text-cyan-400/50 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />}
               </div>

               {/* Document Metadata Area */}
               <div className="p-4 flex flex-col gap-2 flex-1">
                 <h3 className="text-white font-medium text-sm line-clamp-2 leading-tight group-hover:text-[#29F0E0] transition-colors">{r.title}</h3>
                 <div className="mt-auto">
                   <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{r.category}</p>
                   <div className="flex justify-between items-center text-xs text-white/50">
                     <span>{r.date}</span>
                     <span>PDF • 2.4 MB</span>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Preview / Metadata Sidebar */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full md:w-80 shrink-0"
          >
            <GlassPanel className="p-6 sticky top-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-white font-medium">Record Details</h3>
                <button onClick={() => setSelectedRecord(null)} className="text-white/40 hover:text-white">✕</button>
              </div>
              
              {(() => {
                const r = records.find(x => x.id === selectedRecord);
                if (!r) return null;
                return (
                  <>
                    <div className="w-full aspect-video bg-black/40 rounded-lg border border-white/5 flex flex-col items-center justify-center text-white/20 mb-6 group cursor-pointer hover:border-[#29F0E0]/50 transition-colors">
                      <Eye className="w-8 h-8 mb-2 group-hover:text-[#29F0E0] transition-colors" />
                      <span className="text-xs">Tap to decrypt & view</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Title</p>
                        <p className="text-sm text-white">{r.title}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Issuer</p>
                        <p className="text-sm text-white">{r.issuer}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Date Added</p>
                        <p className="text-sm text-white font-mono">{r.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Encryption</p>
                        <p className="text-sm text-[#29F0E0] font-mono flex items-center gap-2"><Lock className="w-3 h-3" /> AES-256-GCM</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setDownloadPinPrompt(r.id);
                        }} 
                        className="w-full py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download Decrypted
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="w-full py-2.5 border border-[#FF4D6D]/30 text-[#FF4D6D] rounded-lg text-sm font-medium hover:bg-[#FF4D6D]/10 transition-colors flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete Record
                      </button>
                    </div>
                  </>
                );
              })()}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Prompt Modal */}
      <AnimatePresence>
        {downloadPinPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <GlassPanel className="p-8 max-w-sm w-full text-center flex flex-col items-center shadow-[0_0_50px_rgba(41,240,224,0.1)]">
                <div className="w-16 h-16 rounded-full bg-[#29F0E0]/10 flex items-center justify-center mb-6 border border-[#29F0E0]/30">
                  <Lock className="w-8 h-8 text-[#29F0E0]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Decrypt Record</h3>
                <p className="text-white/50 text-sm mb-6">Enter your 4-digit Vault PIN to unlock and download this document.</p>
                
                <input 
                  type="password" 
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-3xl tracking-[0.5em] p-4 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#29F0E0]/50 mb-6 font-mono placeholder:tracking-normal placeholder:text-sm"
                  placeholder="Vault PIN"
                  autoFocus
                />

                <div className="flex gap-3 w-full">
                  <button onClick={() => { setDownloadPinPrompt(null); setPinInput(""); }} className="flex-1 py-3 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button 
                    onClick={() => {
                      if (pinInput === "1508") {
                         const r = records.find(x => x.id === downloadPinPrompt);
                         if (r) {
                           toast.success("PIN Accepted. Decrypting document...");
                           const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                           window.open(`${apiUrl}/api/vault/download/${r.id}?title=${encodeURIComponent(r.title)}`, '_blank');
                         }
                         setDownloadPinPrompt(null);
                         setPinInput("");
                      } else {
                         toast.error("Incorrect Vault PIN");
                         setPinInput("");
                      }
                    }}
                    className="flex-1 py-3 bg-[#29F0E0] text-black font-medium rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Unlock
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
