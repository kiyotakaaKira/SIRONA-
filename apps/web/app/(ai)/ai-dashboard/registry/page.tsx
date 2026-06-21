"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Cpu, Brain, CheckCircle2 } from "lucide-react";
import { DataTable } from "../../../../components/DataTable";

interface ModelVersion {
  id: string;
  name: string;
  accuracy: string;
  convergence: string;
  participants: number;
  status: "active" | "training" | "deprecated";
  lastEpoch: string;
}

const mockModels: ModelVersion[] = [
  { id: "M-1", name: "Capsule-Synthesizer-v4", accuracy: "99.4%", convergence: "98.8%", participants: 1024, status: "active", lastEpoch: "Epoch 45" },
  { id: "M-2", name: "Fraud-Predictor-v2", accuracy: "98.7%", convergence: "99.1%", participants: 512, status: "active", lastEpoch: "Epoch 30" },
  { id: "M-3", name: "Interaction-Analyzer-v1", accuracy: "96.5%", convergence: "94.2%", participants: 256, status: "training", lastEpoch: "Epoch 12" },
  { id: "M-4", name: "Clinical-Entity-Extraction-v1", accuracy: "93.1%", convergence: "92.0%", participants: 128, status: "deprecated", lastEpoch: "Epoch 8" }
];

export default function TrainingRegistryPage() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const selectedModel = mockModels.find(m => m.id === selectedModelId);

  const columns = [
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${
          item.status === 'active' ? 'bg-[#2ED9A3]/10 text-[#2ED9A3] border-[#2ED9A3]/25' :
          item.status === 'training' ? 'bg-[#2E6FFF]/10 text-[#2E6FFF] border-[#2E6FFF]/25 animate-pulse' :
          'bg-white/10 text-white/40 border-white/10'
        }`}>
          {item.status}
        </span>
      ),
      sortable: true
    },
    {
      header: "Model Name",
      accessorKey: "name",
      cell: (item: any) => <span className="font-medium text-white">{item.name}</span>,
      sortable: true
    },
    {
      header: "Validation Accuracy",
      accessorKey: "accuracy",
      cell: (item: any) => <span className="font-mono text-white/80">{item.accuracy}</span>,
      sortable: true
    },
    {
      header: "Nodes Engaged",
      accessorKey: "participants",
      cell: (item: any) => <span className="font-mono text-white/60">{item.participants} Nodes</span>,
      sortable: true
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <button 
          onClick={() => setSelectedModelId(item.id)}
          className="text-[#A855F7] hover:underline text-xs font-medium"
        >
          Epoch Details
        </button>
      )
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex justify-between items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A855F7]/80 mb-2">Federated Model Logs</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Training Registry</motion.h1>
        </motion.div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Registry Table */}
        <div className="flex-1 min-w-0">
          <GlassPanel className="p-6">
            <DataTable 
              data={mockModels}
              columns={columns}
              searchPlaceholder="Search registry by model name..."
              searchableKey="name"
            />
          </GlassPanel>
        </div>

        {/* Epoch Details */}
        <AnimatePresence>
          {selectedModel && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[380px] shrink-0"
            >
              <GlassPanel accentColor="cyan" className="p-6 sticky top-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-medium text-lg">Epoch Specifications</h3>
                  <button onClick={() => setSelectedModelId(null)} className="text-white/40 hover:text-white">✕</button>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase font-mono">Current Iteration</span>
                      <span className="text-sm font-semibold text-white block mt-0.5">{selectedModel.lastEpoch}</span>
                    </div>
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Convergence Index</p>
                    <p className="text-sm text-white font-mono">{selectedModel.convergence}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Network Engagement</p>
                    <p className="text-sm text-white">{selectedModel.participants} active participants contributing gradients.</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Status Verification</p>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Model gradients validated and signed cryptographically.</span>
                    </div>
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
