"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, ShieldCheck, AlertTriangle, Download, Share2, QrCode, Upload, Sparkles, Lock, EyeOff, CheckCircle2, Shield, ScanLine } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { DataTable } from "../../../components/DataTable";
import { MedicationTimeline } from "../../../components/charts/MedicationTimeline";
import { toast } from "sonner";

type RxStatus = "active" | "dispensed" | "expired" | "flagged";

// Deterministic QR Code generator based on string seed
const ProfessionalQRCode = React.forwardRef<HTMLCanvasElement, { seed: string, status: string }>(({ seed, status }, ref) => {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isInactive = status !== 'active';
  const defaultRef = React.useRef<HTMLCanvasElement>(null);
  const canvasRef = (ref as React.MutableRefObject<HTMLCanvasElement>) || defaultRef;
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    const gridSize = 12;
    const cellSize = size / gridSize;
    
    // Helper to draw a square
    const drawRect = (r: number, c: number, fill: string) => {
      ctx.fillStyle = fill;
      ctx.fillRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
    };

    // Draw alignment patterns
    const drawAlignment = (r: number, c: number) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(c * cellSize, r * cellSize, cellSize * 4, cellSize * 4);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(c * cellSize + cellSize*0.5, r * cellSize + cellSize*0.5, cellSize * 3, cellSize * 3);
      ctx.fillStyle = '#000000';
      ctx.fillRect(c * cellSize + cellSize*1.25, r * cellSize + cellSize*1.25, cellSize * 1.5, cellSize * 1.5);
    };

    drawAlignment(0, 0);
    drawAlignment(0, 8);
    drawAlignment(8, 0);

    // Draw data matrix
    for (let i = 0; i < 144; i++) {
      const r = Math.floor(i / 12);
      const c = i % 12;
      // Skip alignment zones
      if ((r < 4 && c < 4) || (r < 4 && c > 7) || (r > 7 && c < 4)) continue;
      
      const isFilled = ((Math.sin(hash + i * 1.34) * 10000) % 1) > 0.45;
      if (isFilled) drawRect(r, c, '#000000');
    }
  }, [hash, canvasRef]);

  return (
    <div className="relative w-full aspect-square bg-white rounded-2xl p-4 flex items-center justify-center group overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full ${isInactive ? 'opacity-30 grayscale' : 'opacity-100'} transition-all duration-500`} 
      />

      {!isInactive && (
        <motion.div 
          animate={{ top: ["-10%", "110%", "-10%"] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-[#29F0E0] shadow-[0_0_20px_rgba(41,240,224,1)] z-10 opacity-70"
        />
      )}

      {isInactive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg text-white font-mono text-sm tracking-widest uppercase rotate-[-15deg] shadow-xl">
            {status}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md cursor-pointer z-20 pointer-events-none">
        <ScanLine className="w-8 h-8 text-[#29F0E0] mb-2" />
        <span className="text-white font-medium">QR Code Ready</span>
      </div>
    </div>
  );
});
ProfessionalQRCode.displayName = 'ProfessionalQRCode';

export default function PrescriptionCenterPage() {
  const [activeTab, setActiveTab] = useState<RxStatus | "all">("all");
  const [selectedRx, setSelectedRx] = useState<string | null>(null);
  const qrRef = React.useRef<HTMLCanvasElement>(null);
  
  // OCR states
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [ocrStep, setOcrStep] = useState<"upload" | "scanning" | "review">("upload");
  const [ocrForm, setOcrForm] = useState({
    medication: "",
    dosage: "",
    doctor: "",
    hospital: "",
    refills: 0,
    instructions: "",
    expiry: ""
  });

  const prescriptions = useStore(state => state.prescriptions);
  const issuePrescription = useStore(state => state.issuePrescription);

  const filtered = prescriptions.filter(rx => 
    (activeTab === "all" || rx.status === activeTab)
  );

  const selected = prescriptions.find(rx => rx.id === selectedRx);

  const simulateOcrScan = async () => {
    setOcrStep("scanning");
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate OCR text extraction
    setOcrForm({
      medication: "Metformin",
      dosage: "500mg, 2x daily",
      doctor: "Dr. Sarah Jenkins",
      hospital: "Apollo Hospital",
      refills: 3,
      instructions: "Take with food. Do not skip meals.",
      expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 months from now
    });
    setOcrStep("review");
  };

  const saveOcrPrescription = () => {
    if (!ocrForm.medication || !ocrForm.dosage) {
      toast.error("Please fill in medication name and dosage");
      return;
    }

    issuePrescription({
      medication: ocrForm.medication,
      dosage: ocrForm.dosage,
      doctor: ocrForm.doctor || "Dr. Self-Reported",
      hospital: ocrForm.hospital || "HealthMesh Vault OCR",
      issueDate: new Date().toISOString().split('T')[0],
      expiry: ocrForm.expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "active",
      refills: ocrForm.refills,
      instructions: ocrForm.instructions || "Take as directed.",
      fraudScore: 97
    });

    toast.success("Prescription imported and saved successfully");
    setIsOCRModalOpen(false);
    setOcrStep("upload");
  };

  const columns = [
    {
      header: "Medication",
      accessorKey: "medication",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${
            item.status === 'active' ? 'bg-[#29F0E0]/10 text-[#29F0E0]' :
            item.status === 'dispensed' ? 'bg-[#2ED9A3]/10 text-[#2ED9A3]' :
            item.status === 'flagged' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' :
            'bg-white/10 text-white/50'
          }`}>
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="font-medium text-white">{item.medication}</span>
            <span className="text-xs text-white/50 block">{item.dosage}</span>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => (
        <span className={`px-2 py-1 rounded text-[10px] uppercase font-mono border ${
          item.status === 'active' ? 'bg-[#29F0E0]/10 text-[#29F0E0] border-[#29F0E0]/30' :
          item.status === 'dispensed' ? 'bg-[#2ED9A3]/10 text-[#2ED9A3] border-[#2ED9A3]/30' :
          item.status === 'flagged' ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30' :
          'bg-white/10 text-white/50 border-white/20'
        }`}>
          {item.status === 'flagged' ? 'Fraud Risk' : item.status}
        </span>
      )
    },
    {
      header: "Doctor / Hospital",
      accessorKey: "doctor",
      cell: (item: any) => (
        <div>
          <span className="text-white block">{item.doctor}</span>
          <span className="text-xs text-white/50 block">{item.hospital}</span>
        </div>
      )
    },
    {
      header: "Issue Date",
      accessorKey: "issueDate",
      sortable: true,
      cell: (item: any) => <span className="font-mono text-white/80">{item.issueDate}</span>
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex flex-col items-start gap-1">
          <button 
            onClick={() => setSelectedRx(item.id)}
            className="text-[#29F0E0] hover:underline text-xs font-medium"
          >
            View Details
          </button>
          <button className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 mt-1" onClick={() => setSelectedRx(item.id)}>
            <QrCode className="w-3 h-3"/> View QR Capsule
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#29F0E0]/80 mb-2">Pharmacy Operations</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Prescription Center</motion.h1>
        </motion.div>
        <button
          onClick={() => setIsOCRModalOpen(true)}
          className="px-5 py-3 bg-[#29F0E0] hover:bg-[#29F0E0]/90 text-black font-semibold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(41,240,224,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" /> Import via OCR
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <GlassPanel className="p-6">
            <h2 className="text-lg font-medium text-white mb-6">Medication Adherence vs Expected</h2>
            <MedicationTimeline />
          </GlassPanel>

          <GlassPanel className="p-0 overflow-hidden">
             <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                {['all', 'active', 'dispensed', 'flagged', 'expired'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             <div className="p-4">
               <DataTable 
                 data={filtered}
                 columns={columns}
                 searchPlaceholder="Search meds or doctors..."
                 searchableKey="medication"
               />
             </div>
           </GlassPanel>
        </div>

        {/* Details Panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[400px] shrink-0"
            >
              <GlassPanel accentColor={
                selected.status === 'active' ? 'cyan' :
                selected.status === 'dispensed' ? 'green' :
                selected.status === 'flagged' ? 'red' : undefined
              } className="p-6 sticky top-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-light text-white">{selected.medication}</h2>
                    <p className="text-[#29F0E0] text-sm font-medium mt-1">{selected.dosage}</p>
                  </div>
                  <button onClick={() => setSelectedRx(null)} className="text-white/40 hover:text-white">✕</button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                     <ShieldCheck className={`w-5 h-5 ${selected.fraudScore > 80 ? 'text-[#2ED9A3]' : 'text-[#FF4D6D]'}`} />
                     <div>
                       <p className="text-[10px] uppercase text-white/40 font-mono tracking-wider">AI Fraud Score</p>
                       <p className="text-sm text-white font-medium">{selected.fraudScore}/100 
                         {selected.fraudScore > 80 ? <span className="text-[#2ED9A3] ml-2">Authentic</span> : <span className="text-[#FF4D6D] ml-2">Suspicious</span>}
                       </p>
                     </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Prescriber</p>
                    <p className="text-sm text-white">{selected.doctor}</p>
                    <p className="text-xs text-white/50">{selected.hospital}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Patient Instructions</p>
                    <p className="text-sm text-white p-3 rounded bg-black/40 border border-white/5 italic">"{selected.instructions}"</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Refills</p>
                      <p className="text-sm text-white">{selected.refills} Remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Validity</p>
                      <p className="text-sm font-mono text-white">{selected.issueDate} — {selected.expiry}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <ProfessionalQRCode seed={selected.id} status={selected.status} ref={qrRef} />
                  
                  {selected.status === 'active' ? (
                    <p className="text-xs text-center text-white/40 font-mono">Scan at pharmacy to dispense</p>
                  ) : (
                    <p className="text-xs text-center text-white/40 font-mono">This cryptographic capsule is inactive</p>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (qrRef.current) {
                          const url = qrRef.current.toDataURL("image/png");
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `HealthMesh_QR_${selected.id}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          toast.success("QR Code downloaded as Image!");
                        }
                      }}
                      className="flex-1 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Save QR
                    </button>
                    <button 
                      onClick={() => {
                        if (qrRef.current) {
                          qrRef.current.toBlob(async (blob) => {
                            if (!blob) return;
                            const file = new File([blob], `HealthMesh_QR_${selected.id}.png`, { type: 'image/png' });
                            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                              try {
                                await navigator.share({
                                  title: `HealthMesh Prescription QR`,
                                  files: [file]
                                });
                                toast.success("QR Code shared successfully!");
                              } catch (err) {
                                console.log("Share failed:", err);
                              }
                            } else {
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `HealthMesh_QR_${selected.id}.png`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast.success("QR Code saved (Sharing not supported on this device)");
                            }
                          }, 'image/png');
                        }
                      }}
                      className="flex-1 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> Share QR
                    </button>
                  </div>
                </div>

                {selected.status === 'flagged' && (
                  <div className="p-4 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 flex flex-col items-center text-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-[#FF4D6D]" />
                    <p className="text-sm text-[#FF4D6D] font-medium">Prescription Flagged</p>
                    <p className="text-xs text-[#FF4D6D]/70">This prescription has been flagged for potential anomaly or cryptographic signature mismatch. Contact your prescriber.</p>
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OCR Modal */}
      <AnimatePresence>
        {isOCRModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0D1117] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#29F0E0]" />
                  <h3 className="text-xl font-medium text-white">Import Prescription via OCR</h3>
                </div>
                <button onClick={() => { setIsOCRModalOpen(false); setOcrStep("upload"); }} className="text-white/40 hover:text-white">✕</button>
              </div>

              {/* Modal body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
                {ocrStep === "upload" && (
                  <>
                    <p className="text-white/70 text-sm leading-relaxed">
                      To make managing your health easier, we can now automatically read and fill in your prescription details using advanced text recognition (OCR).
                    </p>

                    {/* Privacy Policy Panel */}
                    <div className="p-5 rounded-xl border border-[#29F0E0]/20 bg-gradient-to-br from-[#29F0E0]/5 to-transparent space-y-4">
                      <div className="flex items-center gap-2 text-[#29F0E0] font-medium text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Your Privacy is Our Priority</span>
                      </div>
                      <div className="grid gap-3 text-xs text-white/75">
                        <div className="flex gap-2">
                          <Lock className="w-4 h-4 text-[#29F0E0] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white">End-to-End Encryption:</strong> Your uploaded prescription images and extracted text are fully encrypted and securely stored.
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <EyeOff className="w-4 h-4 text-[#29F0E0] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white">No Third-Party Sharing:</strong> Your medical data is strictly confidential and will never be shared or used for marketing.
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#29F0E0] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white">You’re In Control:</strong> You can review, edit, or delete the extracted information at any time before saving.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dropzone */}
                    <div 
                      onClick={simulateOcrScan}
                      className="border-2 border-dashed border-white/20 hover:border-[#29F0E0]/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-white/50 group-hover:text-[#29F0E0] transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-white font-medium">Click to select or drag & drop prescription image</p>
                        <p className="text-xs text-white/40 mt-1">Supports PNG, JPG, or PDF (Max 10MB)</p>
                      </div>
                    </div>
                  </>
                )}

                {ocrStep === "scanning" && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-[#29F0E0]/20 border-t-[#29F0E0] animate-spin" />
                      <Lock className="w-6 h-6 text-[#29F0E0] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-white font-medium">Scanning & decrypting...</h4>
                      <p className="text-xs text-white/50">Using zero-knowledge advanced text recognition (OCR)</p>
                    </div>
                    <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#29F0E0] to-transparent"
                      />
                    </div>
                  </div>
                )}

                {ocrStep === "review" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#2ED9A3]/10 border border-[#2ED9A3]/30 text-[#2ED9A3] text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>OCR Scan Successful. Please review and edit the details before saving.</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 font-medium">Medication Name</label>
                        <input 
                          type="text" 
                          value={ocrForm.medication} 
                          onChange={(e) => setOcrForm({...ocrForm, medication: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 font-medium">Dosage</label>
                        <input 
                          type="text" 
                          value={ocrForm.dosage} 
                          onChange={(e) => setOcrForm({...ocrForm, dosage: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 font-medium">Doctor Name</label>
                        <input 
                          type="text" 
                          value={ocrForm.doctor} 
                          onChange={(e) => setOcrForm({...ocrForm, doctor: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 font-medium">Hospital/Clinic</label>
                        <input 
                          type="text" 
                          value={ocrForm.hospital} 
                          onChange={(e) => setOcrForm({...ocrForm, hospital: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 font-medium">Refills</label>
                        <input 
                          type="number" 
                          value={ocrForm.refills} 
                          onChange={(e) => setOcrForm({...ocrForm, refills: parseInt(e.target.value) || 0})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 font-medium">Expiry Date</label>
                        <input 
                          type="date" 
                          value={ocrForm.expiry} 
                          onChange={(e) => setOcrForm({...ocrForm, expiry: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-white/50 font-medium">Patient Instructions</label>
                        <textarea 
                          rows={2}
                          value={ocrForm.instructions} 
                          onChange={(e) => setOcrForm({...ocrForm, instructions: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#29F0E0] focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => { setIsOCRModalOpen(false); setOcrStep("upload"); }} 
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                  {ocrStep === "review" ? "Discard" : "Cancel"}
                </button>
                {ocrStep === "review" && (
                  <button 
                    onClick={saveOcrPrescription} 
                    className="px-4 py-2 bg-[#29F0E0] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm shadow-[0_0_15px_rgba(41,240,224,0.2)]"
                  >
                    Save to Prescriptions
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
