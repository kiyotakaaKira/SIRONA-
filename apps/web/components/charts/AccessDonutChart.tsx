"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartPlaceholder, useChartMounted } from './ChartFrame';

const data = [
  { name: 'Hospitals', value: 45, color: '#2E6FFF' },
  { name: 'Pharmacies', value: 30, color: '#2ED9A3' },
  { name: 'Insurers', value: 15, color: '#F59E0B' },
  { name: 'AI Safety Nodes', value: 10, color: '#A855F7' },
];

export function AccessDonutChart() {
  const mounted = useChartMounted();

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%', height: 200 }}>
        {!mounted ? <ChartPlaceholder className="h-[200px] min-h-0" /> : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#05070A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full px-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-white/60 truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
