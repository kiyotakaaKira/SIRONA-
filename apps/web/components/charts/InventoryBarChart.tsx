"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';

const INVENTORY_DATA = [
  { id: 'rx-1', name: 'Amoxicillin 500mg', category: 'Antibiotics', current: 420, capacity: 500, depletion: '14 days', trend: '-12%' },
  { id: 'rx-6', name: 'Ozempic 1mg', category: 'Diabetes', current: 12, capacity: 150, depletion: '< 24 hours', trend: '-85%', critical: true },
  { id: 'rx-2', name: 'Lisinopril 10mg', category: 'Cardiac', current: 310, capacity: 400, depletion: '21 days', trend: '-5%' },
  { id: 'rx-3', name: 'Albuterol Inhaler', category: 'Asthma', current: 45, capacity: 300, depletion: '2 days', trend: '-45%', critical: true },
  { id: 'rx-4', name: 'Metformin 1000mg', category: 'Diabetes', current: 280, capacity: 350, depletion: '18 days', trend: '-8%' },
  { id: 'rx-5', name: 'Atorvastatin 20mg', category: 'Cholesterol', current: 150, capacity: 300, depletion: '8 days', trend: '-20%' },
];

export function InventoryBarChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full min-h-[300px] animate-pulse bg-white/5 rounded-xl" />;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
          <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total SKUs Tracked</p>
          <p className="text-xl font-light text-white">1,402</p>
        </div>
        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
          <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Avg Fulfillment Rate</p>
          <p className="text-xl font-light text-[#2ED9A3]">98.4%</p>
        </div>
        <div className="bg-[#FF4D6D]/10 rounded-lg p-3 border border-[#FF4D6D]/20">
          <p className="text-[10px] text-[#FF4D6D]/80 uppercase font-mono mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Critical Low</p>
          <p className="text-xl font-light text-[#FF4D6D]">2 SKUs</p>
        </div>
      </div>

      {/* Dynamic List */}
      <div className="flex flex-col gap-3">
        {INVENTORY_DATA.map((item, i) => {
          const fillPercentage = (item.current / item.capacity) * 100;
          const isCritical = item.critical;
          const barColor = isCritical ? '#FF4D6D' : (fillPercentage > 60 ? '#2ED9A3' : '#F59E0B');

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group flex flex-col gap-2 p-4 rounded-xl border transition-all ${isCritical ? 'bg-[#FF4D6D]/5 border-[#FF4D6D]/20 hover:bg-[#FF4D6D]/10' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
            >
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-1">
                    {item.name}
                    {isCritical && <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold font-mono bg-[#FF4D6D] text-black tracking-wider animate-pulse">ACTION REQ</span>}
                  </h4>
                  <span className="text-[11px] font-mono text-white/40 block">{item.category} • Cap: {item.capacity} units</span>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-light tracking-tight ${isCritical ? 'text-[#FF4D6D]' : 'text-white'}`}>{item.current}</span>
                  <span className="text-[11px] font-mono text-white/30 ml-1">/ {item.capacity}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 mt-1 mb-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercentage}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1 + 0.2, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ 
                    backgroundColor: barColor,
                    boxShadow: isCritical ? `0 0 10px ${barColor}` : 'none'
                  }}
                />
              </div>

              {/* Insights Footer */}
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                    <TrendingDown className={`w-3 h-3 ${isCritical ? 'text-[#FF4D6D]' : 'text-white/40'}`} /> {item.trend} velocity
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Est. Depletion: <span className={isCritical ? 'text-[#FF4D6D] font-bold' : 'text-white/70'}>{item.depletion}</span></span>
                </div>
                {isCritical && (
                  <button className="text-[10px] font-mono font-medium text-[#FF4D6D] hover:text-[#FF4D6D]/70 transition-colors flex items-center gap-1 bg-[#FF4D6D]/10 px-2 py-1 rounded">
                    AUTO-ORDER <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
