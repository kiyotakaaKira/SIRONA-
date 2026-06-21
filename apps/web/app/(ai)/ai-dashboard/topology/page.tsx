"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, ShieldCheck, ShieldAlert, Activity, RefreshCw } from "lucide-react";

interface PeerNode {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "syncing";
  latency: string;
  lastBlock: string;
  cryptoAlg: string;
  connections: number;
}

const mockNodes: PeerNode[] = [
  { id: "node-1", name: "Apollo Hospital Node", type: "Hospital Portal", status: "online", latency: "38ms", lastBlock: "#18,294,204", cryptoAlg: "ZKP - Groth16", connections: 12 },
  { id: "node-2", name: "Mercy Clinic Node", type: "Hospital Portal", status: "online", latency: "42ms", lastBlock: "#18,294,204", cryptoAlg: "ZKP - Groth16", connections: 8 },
  { id: "node-3", name: "Walgreens Pharmacy Node", type: "Pharmacy Portal", status: "online", latency: "24ms", lastBlock: "#18,294,201", cryptoAlg: "ZKP - PLONK", connections: 15 },
  { id: "node-4", name: "Blue Cross Node", type: "Insurance Portal", status: "syncing", latency: "112ms", lastBlock: "#18,294,198", cryptoAlg: "ZKP - Groth16", connections: 6 },
  { id: "node-5", name: "City Imaging Node", type: "Imaging Facility", status: "online", latency: "53ms", lastBlock: "#18,294,204", cryptoAlg: "ZKP - PLONK", connections: 9 },
  { id: "node-6", name: "HealthMesh Core Oracle", type: "Consensus Authority", status: "online", latency: "12ms", lastBlock: "#18,294,204", cryptoAlg: "ZKP - Groth16", connections: 24 }
];

export default function NodeTopologyPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = mockNodes.find(n => n.id === selectedNodeId);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen font-sans">
      <header className="mb-10 flex justify-between items-end gap-6">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A855F7]/80 mb-2">Network Architecture</motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Node Topology</motion.h1>
        </motion.div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Nodes Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockNodes.map((node) => (
            <motion.div 
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedNodeId(node.id)}
              className="cursor-pointer"
            >
              <GlassPanel 
                accentColor={node.id === selectedNodeId ? "purple" : undefined}
                className={`p-6 border-white/5 hover:border-[#A855F7]/30 transition-all ${node.id === selectedNodeId ? 'bg-gradient-to-br from-[#A855F7]/5 to-transparent' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-white/60">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-base leading-tight">{node.name}</h3>
                      <p className="text-xs text-white/40 mt-1">{node.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border flex items-center gap-1.5 ${
                    node.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    node.status === 'syncing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                    'bg-white/10 text-white/50 border-white/10'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-white/40 block mb-0.5">Latency</span>
                    <span className="text-white font-mono">{node.latency}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">Crypto Alg</span>
                    <span className="text-white font-mono">{node.cryptoAlg}</span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Info Drawer */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[380px] shrink-0"
            >
              <GlassPanel accentColor="purple" className="p-6 sticky top-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-medium text-lg">Node Details</h3>
                  <button onClick={() => setSelectedNodeId(null)} className="text-white/40 hover:text-white">✕</button>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white/40 uppercase tracking-wider font-mono">Consensus State</span>
                      <span className="text-sm font-semibold text-[#A855F7] block mt-0.5">SYNCHRONIZED</span>
                    </div>
                    <RefreshCw className="w-5 h-5 text-[#A855F7] animate-spin-slow" />
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Node Identifier</p>
                    <p className="text-sm font-mono text-white/80 select-all">{selectedNode.id}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">IP Connections</p>
                    <p className="text-sm text-white/80">{selectedNode.connections} Peers Active</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Cryptographic Proofs</p>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs mt-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Zero-Knowledge Proof Verification Active</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Last Validated Block</p>
                    <p className="text-sm text-white font-mono">{selectedNode.lastBlock}</p>
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
