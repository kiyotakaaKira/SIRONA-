"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Pill, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from "../../store/useStore";

export function ConsentNetworkVisual() {
  const grants = useStore(state => state.grants);
  const activeGrants = grants.filter(g => g.status === 'approved');

  // Static central node
  const centerNode = { id: 'patient', x: 50, y: 50 };

  // Calculate positions for connected entities
  const nodes = activeGrants.map((grant, index) => {
    const angle = (index / Math.max(1, activeGrants.length)) * Math.PI * 2 - Math.PI / 2;
    const radiusX = 38; // Elliptical layout for better screen fit
    const radiusY = 32;
    return {
      ...grant,
      x: 50 + radiusX * Math.cos(angle),
      y: 50 + radiusY * Math.sin(angle),
    };
  });

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-xl overflow-hidden bg-black/20 border border-white/5 flex items-center justify-center p-8">
      {/* Right Hand Side Feature Tabular */}
      <div className="absolute right-4 top-4 w-56 bg-[#0a1017]/90 border border-white/10 backdrop-blur-xl rounded-xl p-3 hidden md:block z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <h4 className="text-white text-xs font-medium mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#29F0E0]" /> About Consent Engine
        </h4>
        <div className="space-y-2">
          <div className="flex flex-col pb-1.5 border-b border-white/5">
            <span className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Purpose</span>
            <span className="text-white/90 text-[10px] leading-snug">Centralized medical data control.</span>
          </div>
          <div className="flex flex-col pb-1.5 border-b border-white/5">
            <span className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">How It Works</span>
            <span className="text-white/90 text-[10px] leading-snug">Explicit approval/denial of network nodes.</span>
          </div>
          <div className="flex flex-col pb-1.5 border-b border-white/5">
            <span className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Data Scopes</span>
            <span className="text-white/90 text-[10px] leading-snug">Granular access to specific health records.</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Auto-Expiry</span>
            <span className="text-white/90 text-[10px] leading-snug">Connections self-terminate at expiry.</span>
          </div>
        </div>
      </div>

      {activeGrants.length === 0 ? (
        <div className="text-white/40 flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 mb-4 opacity-50" />
          <p>No active consent connections.</p>
        </div>
      ) : (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#29F0E0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2E6FFF" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {nodes.map((node, i) => (
            <React.Fragment key={`conn-${node.id}`}>
              <motion.line
                x1={`${centerNode.x}%`}
                y1={`${centerNode.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke="url(#linkGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
              {/* Flowing data packet */}
              <motion.circle
                r="3"
                fill="#29F0E0"
                filter="url(#glow)"
                initial={{ cx: `${centerNode.x}%`, cy: `${centerNode.y}%`, opacity: 0 }}
                animate={{
                  cx: [`${centerNode.x}%`, `${node.x}%`],
                  cy: [`${centerNode.y}%`, `${node.y}%`],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
              />
            </React.Fragment>
          ))}
        </svg>
      )}

      {/* Center Node (Patient Vault) */}
      <motion.div
        className="absolute w-20 h-20 bg-gradient-to-tr from-[#29F0E0] to-[#2E6FFF] rounded-full flex items-center justify-center z-10 shadow-[0_0_40px_rgba(41,240,224,0.4)]"
        style={{ left: `calc(${centerNode.x}% - 40px)`, top: `calc(${centerNode.y}% - 40px)` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <div className="w-[72px] h-[72px] bg-black rounded-full flex items-center justify-center border border-white/10">
          <ShieldCheck className="w-8 h-8 text-[#29F0E0]" />
        </div>
      </motion.div>

      {/* Connected Nodes */}
      {nodes.map((node, i) => {
        let Icon = Building2;
        if (node.requester.toLowerCase().includes('pharmacy')) Icon = Pill;
        if (node.requester.toLowerCase().includes('insurance')) Icon = Activity;

        return (
          <motion.div
            key={`node-${node.id}`}
            className="absolute z-10 w-56"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.5 + i * 0.1 }}
          >
            <div className="bg-[#0a1017]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:border-[#29F0E0]/50 hover:shadow-[0_8px_32px_rgba(41,240,224,0.15)] transition-all duration-300 relative overflow-hidden group">
              {/* Top: Icon + Status/Expiry */}
              <div className="flex justify-between items-start z-10 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E6FFF]/30 to-[#29F0E0]/10 flex items-center justify-center border border-white/10 shadow-[inset_0_0_15px_rgba(46,111,255,0.2)]">
                  <Icon className="w-5 h-5 text-[#29F0E0]" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium text-[#2ED9A3] bg-[#2ED9A3]/10 px-2 py-0.5 rounded-full border border-[#2ED9A3]/20 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ED9A3] animate-pulse" />
                    ACTIVE
                  </span>
                  <span className="text-[9px] text-white/40 font-mono tracking-wider uppercase">EXP: {node.expiry || 'Indefinite'}</span>
                </div>
              </div>

              {/* Middle: Details */}
              <div className="flex flex-col z-10 relative">
                <span className="text-[13px] font-semibold text-white leading-tight">{node.requester}</span>
                <span className="text-[10px] text-white/50 mt-0.5">{node.purpose}</span>
              </div>

              {/* Bottom: Scope Tags */}
              <div className="flex flex-wrap gap-1.5 mt-1 z-10 relative">
                {node.scope.map((s: string) => (
                  <span key={s} className="px-1.5 py-0.5 bg-[#29F0E0]/5 border border-[#29F0E0]/20 rounded uppercase text-[8px] tracking-wider text-[#29F0E0] shadow-sm">
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer: Date */}
              <div className="mt-1 pt-2 border-t border-white/10 flex justify-between items-center px-1 z-10 relative">
                <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">Given: {node.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ED9A3] shadow-[0_0_5px_#2ED9A3]" title="Active Connection" />
              </div>

              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#29F0E0]/0 via-transparent to-[#29F0E0]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
