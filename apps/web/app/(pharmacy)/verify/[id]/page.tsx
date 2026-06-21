"use client";
import React, { useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { CheckCircle2, ShieldAlert, AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Mock logic: if token is "mock-valid-qr-token" it's verified, else fraud.
  const isVerified = params.id === "mock-valid-qr-token";
  const [dispensed, setDispensed] = useState(false);

  return (
    <div className="p-8 max-w-3xl mx-auto h-full flex flex-col justify-center">
      <button 
        onClick={() => router.push("/scan")}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Scan Another
      </button>

      <GlassPanel accentColor={isVerified ? "green" : "red"} className="p-12 text-center">
        <div className="flex justify-center mb-6">
          {isVerified ? (
            <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-[#2ED9A3]" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-12 h-12 text-[#FF4D6D]" />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-light text-white mb-2">
          {isVerified ? "Verified Authentic" : "Fraudulent Token"}
        </h1>
        
        {isVerified ? (
          <p className="text-[#2ED9A3] font-medium mb-8">HMAC-SHA256 Signature Valid</p>
        ) : (
          <p className="text-[#FF4D6D] font-medium mb-8">Signature Mismatch - Do Not Dispense</p>
        )}

        {isVerified && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-left mb-8">
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4">Prescription Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/50 text-sm">Medication</p>
                <p className="text-white font-medium text-lg">Amoxicillin</p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Dosage</p>
                <p className="text-white font-medium text-lg">500mg, 3x daily</p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Patient ID</p>
                <p className="text-white font-mono text-sm mt-1">1111-1111</p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Issuer</p>
                <p className="text-white font-medium text-sm mt-1">Dr. Sarah Jenkins</p>
              </div>
            </div>
          </div>
        )}

        {isVerified ? (
          <button 
            disabled={dispensed}
            onClick={() => setDispensed(true)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${dispensed ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-[#2ED9A3] text-black hover:bg-[#2ED9A3]/90 shadow-[0_0_30px_rgba(46,217,163,0.3)]'}`}
          >
            {dispensed ? "Dispensed Successfully" : "Dispense Medication"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#FF4D6D]/80 bg-[#FF4D6D]/10 py-4 rounded-xl border border-[#FF4D6D]/20">
            <AlertTriangle className="w-5 h-5" />
            <span>This event has been logged to the security audit trail.</span>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
