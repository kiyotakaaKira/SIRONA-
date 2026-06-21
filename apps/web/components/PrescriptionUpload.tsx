"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, CheckCircle2, AlertTriangle, X, FileImage, Edit3, Save, Loader2 } from "lucide-react";
import { useStore } from "../store/useStore";
import { toast } from "sonner";

interface PrescriptionUploadProps {
  /** "patient" — creates record directly in patient's vault.
   *  "pharmacy" — requires approved consent grant before upload; tags record with stakeholder ID. */
  mode: "patient" | "pharmacy";
  /** The patient whose vault this upload targets. Required. */
  patientId: string;
  /** Called after the record is saved to the store */
  onComplete?: () => void;
  /** Called when the user dismisses/closes the panel */
  onClose?: () => void;
}

type Step = "idle" | "selected" | "extracting" | "review" | "saving" | "done";

interface OcrResult {
  rawText: string;
  medication?: string;
  dosage?: string;
  prescriber?: string;
  hospital?: string;
  date?: string;
  instructions?: string;
  refills?: number;
  confidence?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function PrescriptionUpload({ mode, patientId, onComplete, onClose }: PrescriptionUploadProps) {
  const user = useStore(state => state.user);
  const uploadRecord = useStore(state => state.uploadRecord);
  const hasApprovedConsent = useStore(state => state.hasApprovedConsent);
  const logEvent = useStore(state => state.logEvent);
  const addNotification = useStore(state => state.addNotification);

  const [step, setStep] = useState<Step>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocr, setOcr] = useState<OcrResult | null>(null);
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pharmacy consent gate
  const canUpload = useCallback(() => {
    if (mode === "pharmacy") {
      const stakeholderId = user?.stakeholderId;
      if (!stakeholderId || !hasApprovedConsent(stakeholderId)) {
        setError("No active consent grant for this patient. The patient must approve access before you can upload to their vault.");
        return false;
      }
    }
    return true;
  }, [mode, user, hasApprovedConsent]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setStep("selected");
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleExtract = async () => {
    if (!canUpload()) return;
    if (!file || !preview) return;

    setStep("extracting");
    setError(null);

    try {
      // Convert preview (data URL) to base64
      const base64 = preview.split(",")[1];
      const mimeType = file.type;

      const res = await fetch(`${API_URL}/api/ai/ocr-prescription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          patientId,
          uploadedByRole: user?.role,
        }),
      });

      if (!res.ok) throw new Error("OCR service error");

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Extraction failed");

      setOcr(data.extracted);
      setEditedText(data.extracted.rawText ?? "");
      setStep("review");
    } catch (err: any) {
      setError(err.message ?? "Failed to extract prescription text. Please try again.");
      setStep("selected");
      toast.error("OCR extraction failed");
    }
  };

  const handleSave = () => {
    if (!ocr) return;
    setStep("saving");

    const title = ocr.medication
      ? `Rx: ${ocr.medication}${ocr.dosage ? ` – ${ocr.dosage}` : ""}`
      : "Prescription Upload";

    // Per-patient scoped path (simulated — real apps write to Supabase Storage)
    const imageUrl = `patients/${patientId}/${Date.now()}_${file?.name ?? "rx.jpg"}`;

    uploadRecord({
      title,
      category: "Prescription",
      issuer: ocr.prescriber ?? ocr.hospital ?? (user?.name ?? "Unknown"),
      date: ocr.date ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      encrypted: true,
      imageUrl,
      ocrText: editedText,
      ocrConfidence: ocr.confidence,
      patientId,
      createdByStakeholderId: mode === "pharmacy" ? user?.stakeholderId : undefined,
    });

    uploadRecord({
      title: title,
      category: "Prescriptions",
      issuer: mode === "pharmacy" ? user?.name || "Pharmacy" : "Self-Uploaded",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      encrypted: true,
      patientId: patientId,
      ocrText: editedText || ocr?.rawText || "",
      imageUrl: preview || undefined
    });

    logEvent({
      title: "Prescription Uploaded via OCR",
      description: `${mode === "pharmacy" ? `${user?.name} (pharmacy)` : "Patient"} uploaded prescription for ${title}`,
      type: "medical",
    });

    addNotification({
      title: "Prescription OCR Complete",
      description: `${title} has been added to the vault.`,
      type: "prescription",
    });

    setTimeout(() => {
      setStep("done");
      toast.success("Prescription saved to vault!");
      onComplete?.();
    }, 800);
  };

  const reset = () => {
    setStep("idle");
    setFile(null);
    setPreview(null);
    setOcr(null);
    setEditedText("");
    setError(null);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">

        {/* IDLE — Drop zone */}
        {step === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${dragOver ? "border-[#29F0E0]/60 bg-[#29F0E0]/5" : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <FileImage className="w-6 h-6 text-white/40" />
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm font-medium">Drop prescription image here</p>
                <p className="text-white/30 text-xs mt-1">or click to browse — JPG, PNG, WEBP up to 10MB</p>
              </div>
              {mode === "pharmacy" && (
                <p className="text-[10px] text-[#F59E0B]/70 mt-1 font-mono text-center">
                  ⚠ Pharmacy upload — active patient consent required
                </p>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            {error && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/25 text-[#FF4D6D] text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* SELECTED — Preview + extract button */}
        {step === "selected" && preview && (
          <motion.div key="selected" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Prescription preview" className="w-full max-h-56 object-contain" />
              <button onClick={reset} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-white/40 text-center">{file?.name} · {((file?.size ?? 0) / 1024).toFixed(1)} KB</p>
            {error && (
              <div className="p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/25 text-[#FF4D6D] text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">Cancel</button>
              <button onClick={handleExtract} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] text-black font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ScanLine className="w-4 h-4" /> Extract Text
              </button>
            </div>
          </motion.div>
        )}

        {/* EXTRACTING — Progress */}
        {step === "extracting" && (
          <motion.div key="extracting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 flex flex-col items-center gap-5">
            <div className="relative w-16 h-16">
              <motion.div className="absolute inset-0 rounded-full border-2 border-[#29F0E0]/20" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#29F0E0]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <ScanLine className="absolute inset-0 m-auto w-7 h-7 text-[#29F0E0]" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Extracting prescription data…</p>
              <p className="text-white/40 text-sm mt-1">Claude Vision is reading the image</p>
            </div>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] rounded-full"
                animate={{ width: ["0%", "90%"] }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* REVIEW — Edit extracted text */}
        {step === "review" && ocr && (
          <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {/* Confidence badge */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ED9A3]" />
              <span className="text-sm text-white/70">Extraction complete</span>
              {ocr.confidence && (
                <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border ${ocr.confidence >= 85 ? "text-[#2ED9A3] border-[#2ED9A3]/30 bg-[#2ED9A3]/10" : "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10"}`}>
                  {ocr.confidence}% confidence
                </span>
              )}
            </div>

            {/* Structured fields */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Medication", value: ocr.medication },
                { label: "Dosage", value: ocr.dosage },
                { label: "Prescriber", value: ocr.prescriber },
                { label: "Hospital", value: ocr.hospital },
                { label: "Date", value: ocr.date },
                { label: "Refills", value: ocr.refills?.toString() },
              ].filter(f => f.value).map(f => (
                <div key={f.label} className="bg-black/40 rounded-lg p-2.5">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{f.label}</p>
                  <p className="text-xs text-white mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Editable raw text */}
            <div>
              <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Edit3 className="w-3 h-3" /> Review & Edit Full Text
              </label>
              <textarea
                value={editedText}
                onChange={e => setEditedText(e.target.value)}
                rows={7}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3 text-white/80 text-xs font-mono focus:outline-none focus:border-white/20 resize-none leading-relaxed"
              />
            </div>

            {mode === "pharmacy" && (
              <p className="text-[10px] text-[#F59E0B]/60 font-mono">
                This upload will be tagged with your stakeholder ID: {user?.stakeholderId}
              </p>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep("selected")} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">← Re-scan</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] text-black font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save to Vault
              </button>
            </div>
          </motion.div>
        )}

        {/* SAVING */}
        {step === "saving" && (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-[#29F0E0] animate-spin" />
            <p className="text-white/60 text-sm">Encrypting & saving to vault…</p>
          </motion.div>
        )}

        {/* DONE */}
        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <CheckCircle2 className="w-12 h-12 text-[#2ED9A3]" />
            </motion.div>
            <div className="text-center">
              <p className="text-white font-medium">Prescription saved!</p>
              <p className="text-white/40 text-sm mt-1">Encrypted and added to the health vault.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={reset} className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white transition-all">Upload Another</button>
              {onClose && (
                <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 text-sm text-white hover:bg-white/20 transition-all">Done</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
