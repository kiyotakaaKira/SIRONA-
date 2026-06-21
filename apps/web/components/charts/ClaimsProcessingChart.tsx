"use client";
import React from 'react';

const data = [
  { name: 'Week 1', claims: 1200, approved: 1100, autoAdjudicated: '91.6%' },
  { name: 'Week 2', claims: 1350, approved: 1250, autoAdjudicated: '92.5%' },
  { name: 'Week 3', claims: 1100, approved: 1050, autoAdjudicated: '95.4%' },
  { name: 'Week 4', claims: 1400, approved: 1300, autoAdjudicated: '92.8%' },
  { name: 'Week 5', claims: 1550, approved: 1480, autoAdjudicated: '95.5%' },
];

export function ClaimsProcessingChart() {
  return (
    <div className="w-full space-y-3 py-2">
      <div className="grid grid-cols-4 text-xs uppercase font-mono text-white/40 border-b border-white/5 pb-2 px-2">
        <span>Period</span>
        <span className="text-center">Total Claims</span>
        <span className="text-center">Approved</span>
        <span className="text-right">Auto-Rate</span>
      </div>
      <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
        {data.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 text-sm items-center py-2 px-2 hover:bg-white/[0.02] rounded-lg transition-colors border border-transparent hover:border-white/5">
            <span className="font-mono text-white/80">{item.name}</span>
            <span className="text-center text-white font-medium">{item.claims}</span>
            <span className="text-center text-[#2ED9A3] font-medium">{item.approved}</span>
            <span className="text-right font-mono text-white/60">{item.autoAdjudicated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
