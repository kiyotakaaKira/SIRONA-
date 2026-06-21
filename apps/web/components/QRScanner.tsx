"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScanLine, Upload } from "lucide-react";

export function QRScanner({ onScan }: { onScan: (token: string) => void }) {
  const [scanning, setScanning] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScanning(true);
      // Simulate processing the uploaded QR image
      setTimeout(() => {
        setScanning(false);
        // Generate a random mock token to ensure dynamic data
        onScan("mock-" + Math.random().toString(36).substring(2, 10));
      }, 1500);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square border-2 border-white/10 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
      
      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-[#29F0E0] rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-[#29F0E0] rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-[#29F0E0] rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-[#29F0E0] rounded-br-lg" />

      {/* Scanner Line */}
      {scanning && (
        <motion.div 
          animate={{ y: ["-100%", "100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-[#29F0E0] shadow-[0_0_20px_rgba(41,240,224,0.8)] z-10"
        />
      )}

      <ScanLine className={`w-20 h-20 mb-4 transition-colors ${scanning ? "text-[#29F0E0]" : "text-white/20"}`} />
      <p className="text-white/50 text-sm font-medium tracking-wide">
        {scanning ? "Analyzing Image..." : "Upload QR to Verify"}
      </p>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={scanning}
        className="absolute bottom-6 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <Upload className="w-3 h-3" /> Upload Image
      </button>
    </div>
  );
}
