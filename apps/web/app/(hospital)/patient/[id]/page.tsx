"use client";
import React, { useEffect, useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { FileText, Clock, ArrowLeft, ShieldAlert, Lock, Unlock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function PatientViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("23h 45m 12s");
  const unwrappedParams = React.use(params);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [unlockedDocs, setUnlockedDocs] = useState<Record<string, boolean>>({});

  const handleViewClick = (docId: string) => {
    if (unlockedDocs[docId]) {
      setDocumentModalOpen(docId);
      return;
    }
    setSelectedDoc(docId);
    setPin("");
    setPinModalOpen(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1508") {
      toast.success("PIN Verified. Decrypting document...");
      setUnlockedDocs({ ...unlockedDocs, [selectedDoc as string]: true });
      setPinModalOpen(false);
    } else {
      toast.error("Invalid PIN. Access denied.");
      setPin("");
    }
  };

  // Mock countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      // In reality, this calculates difference between expires_at and now.
      setTimeLeft(`23h 45m ${new Date().getSeconds()}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-1">Patient Record: {unwrappedParams.id}</h1>
          <p className="text-white/50">Read-only view constrained by active consent grant.</p>
        </div>
        
        {/* Countdown Badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[#2ED9A3]">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="font-mono font-medium">{timeLeft}</span>
          </div>
          <span className="text-xs text-white/30 mt-2 uppercase tracking-widest">Until Auto-Revoke</span>
        </div>
      </div>

      {/* Task 13 Break-Glass Placeholder (will be added later) */}
      <div className="mb-8 p-4 border border-[#FF4D6D]/20 bg-[#FF4D6D]/5 rounded-xl flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-[#FF4D6D] w-5 h-5" />
          <div>
            <h4 className="text-[#FF4D6D] font-medium text-sm">Emergency Protocol</h4>
            <p className="text-white/40 text-xs">Break-glass access for critical care.</p>
          </div>
        </div>
        <button className="px-4 py-1.5 border border-[#FF4D6D]/40 text-[#FF4D6D] rounded text-sm hover:bg-[#FF4D6D]/10 transition-colors">
          Declare Emergency
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <FileText className="text-[#2E6FFF] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Complete Blood Count (CBC)</h3>
            <p className="text-white/50 text-sm mb-3">Issued: 2026-05-20 by Apollo Labs</p>
            {unlockedDocs['cbc'] ? (
              <button onClick={() => handleViewClick('cbc')} className="text-sm text-[#2ED9A3] hover:text-[#2ED9A3]/80 transition-colors flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5" /> View Decrypted Document</button>
            ) : (
              <button onClick={() => handleViewClick('cbc')} className="text-sm text-[#2E6FFF] hover:text-[#2E6FFF]/80 transition-colors flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Unlock & View</button>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <FileText className="text-[#2E6FFF] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">MRI Scan Results</h3>
            <p className="text-white/50 text-sm mb-3">Issued: 2026-04-10 by General Hospital</p>
            {unlockedDocs['mri'] ? (
              <button onClick={() => handleViewClick('mri')} className="text-sm text-[#2ED9A3] hover:text-[#2ED9A3]/80 transition-colors flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5" /> View Decrypted Document</button>
            ) : (
              <button onClick={() => handleViewClick('mri')} className="text-sm text-[#2E6FFF] hover:text-[#2E6FFF]/80 transition-colors flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Unlock & View</button>
            )}
          </div>
        </GlassPanel>
      </div>

      <AnimatePresence>
        {pinModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setPinModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-sm mx-4"
            >
              <GlassPanel className="p-6 border-[#2E6FFF]/30 shadow-[0_0_40px_rgba(46,111,255,0.15)] bg-[#0a1017]/90">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#2E6FFF]" /> Enter Decryption PIN
                  </h3>
                  <button onClick={() => setPinModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleVerify}>
                  <p className="text-sm text-white/60 mb-4">
                    Please enter the patient's 4-digit secret code to unlock this specific document.
                  </p>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 text-center text-2xl tracking-[1em] text-white focus:outline-none focus:border-[#2E6FFF]/50 transition-colors font-mono mb-4"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={pin.length !== 4}
                    className="w-full py-3 bg-[#2E6FFF] disabled:opacity-50 disabled:hover:bg-[#2E6FFF] text-white font-medium rounded-xl hover:bg-[#2E6FFF]/90 transition-all"
                  >
                    Verify & Decrypt
                  </button>
                </form>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {documentModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setDocumentModalOpen(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#F8F9FA] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(46,111,255,0.3)]"
            >
              {/* Header */}
              <div className="bg-[#2E6FFF] p-4 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <h2 className="font-medium text-lg">
                    {documentModalOpen === 'cbc' ? 'Complete Blood Count (CBC) Report' : 'MRI Scan - Lumbar Spine'}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded font-mono">DECRYPTED 0x8A7B</span>
                  <button onClick={() => setDocumentModalOpen(null)} className="hover:bg-white/20 p-1.5 rounded transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 text-black/80 font-sans">
                {documentModalOpen === 'cbc' ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b-2 border-black/10 pb-4 mb-6">
                      <div>
                        <h1 className="text-3xl font-light text-black tracking-tight mb-1">Apollo Demo Hospital</h1>
                        <p className="text-sm text-black/50">Department of Pathology</p>
                      </div>
                      <div className="text-right text-sm">
                        <p><strong>Patient ID:</strong> {unwrappedParams.id}</p>
                        <p><strong>Date:</strong> 2026-05-20</p>
                        <p><strong>Physician:</strong> Dr. Sarah Jenkins</p>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg border-b border-black/10 pb-2 mb-4">Complete Blood Count (CBC) Results</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="bg-black/5 border-b border-black/20">
                            <th className="p-3 font-medium">Test Name</th>
                            <th className="p-3 font-medium">Result</th>
                            <th className="p-3 font-medium">Flag</th>
                            <th className="p-3 font-medium">Reference Range</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                          <tr>
                            <td className="p-3">White Blood Cell (WBC)</td>
                            <td className="p-3 font-mono">6.8</td>
                            <td className="p-3 text-green-600">Normal</td>
                            <td className="p-3 text-black/50">4.5 - 11.0 x10^3/uL</td>
                          </tr>
                          <tr>
                            <td className="p-3">Red Blood Cell (RBC)</td>
                            <td className="p-3 font-mono">4.32</td>
                            <td className="p-3 text-green-600">Normal</td>
                            <td className="p-3 text-black/50">4.00 - 5.20 x10^6/uL</td>
                          </tr>
                          <tr className="bg-red-500/10">
                            <td className="p-3 font-medium text-red-700">Hemoglobin (Hgb)</td>
                            <td className="p-3 font-mono font-medium text-red-700">11.2</td>
                            <td className="p-3 font-medium text-red-700">LOW</td>
                            <td className="p-3 text-black/50">12.0 - 16.0 g/dL</td>
                          </tr>
                          <tr>
                            <td className="p-3">Hematocrit (Hct)</td>
                            <td className="p-3 font-mono">35.4</td>
                            <td className="p-3 text-green-600">Normal</td>
                            <td className="p-3 text-black/50">36.0 - 46.0 %</td>
                          </tr>
                          <tr>
                            <td className="p-3">Platelet Count</td>
                            <td className="p-3 font-mono">245</td>
                            <td className="p-3 text-green-600">Normal</td>
                            <td className="p-3 text-black/50">150 - 450 x10^3/uL</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-1">Pathologist Notes:</h4>
                      <p className="text-sm text-amber-900/80 leading-relaxed">
                        Mild anemia indicated by slightly low hemoglobin levels. Recommend dietary iron supplementation and follow-up in 3 months. No abnormal cells observed in peripheral smear.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b-2 border-black/10 pb-4 mb-6">
                      <div>
                        <h1 className="text-3xl font-light text-black tracking-tight mb-1">General Hospital</h1>
                        <p className="text-sm text-black/50">Department of Radiology</p>
                      </div>
                      <div className="text-right text-sm">
                        <p><strong>Patient ID:</strong> {unwrappedParams.id}</p>
                        <p><strong>Date:</strong> 2026-04-10</p>
                        <p><strong>Radiologist:</strong> Dr. Mark Peterson</p>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg border-b border-black/10 pb-2 mb-4">MRI Scan - Lumbar Spine (Without Contrast)</h3>
                    
                    <div className="space-y-4 text-sm leading-relaxed text-black/80">
                      <div>
                        <h4 className="font-medium text-black uppercase tracking-wider mb-1">Indication:</h4>
                        <p>Chronic lower back pain radiating to the left lower extremity. Rule out disc herniation.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-black uppercase tracking-wider mb-1">Technique:</h4>
                        <p>Multiplanar multisequence MR imaging of the lumbar spine was performed without intravenous contrast.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-black uppercase tracking-wider mb-1">Findings:</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          <li><strong>Alignment:</strong> Normal lumbar lordosis is maintained. No spondylolisthesis.</li>
                          <li><strong>Bone Marrow:</strong> Normal signal intensity. No suspicious marrow replacing lesions.</li>
                          <li><strong>L3-L4:</strong> Mild broad-based posterior disc bulge without significant central canal or foraminal stenosis.</li>
                          <li className="text-red-700 font-medium"><strong>L4-L5:</strong> Moderate left paracentral disc extrusion measuring approximately 5mm, causing mild effacement of the left lateral recess and abutting the descending left L5 nerve root.</li>
                          <li><strong>L5-S1:</strong> Minimal disc desiccation. No significant stenosis.</li>
                        </ul>
                      </div>
                      <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2 uppercase tracking-wider">Impression:</h4>
                        <p className="text-red-900/90 font-medium space-y-2">
                          <span className="block">1. L4-L5 left paracentral disc extrusion impinging the left L5 nerve root, corresponding with patient's radicular symptoms.</span>
                          <span className="block">2. Mild degenerative disc disease otherwise.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
