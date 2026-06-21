"use client";
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { ChartPlaceholder, useChartMounted } from './ChartFrame';

const data = [
  { time: '08:00', heartRate: 72, spO2: 98 },
  { time: '10:00', heartRate: 75, spO2: 98 },
  { time: '12:00', heartRate: 85, spO2: 97 },
  { time: '14:00', heartRate: 78, spO2: 99 },
  { time: '16:00', heartRate: 74, spO2: 98 },
  { time: '18:00', heartRate: 70, spO2: 99 },
  { time: '20:00', heartRate: 68, spO2: 99 },
];

export function VitalsChart() {
  const mounted = useChartMounted();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Heart Rate</p>
          <p className="text-2xl font-light text-white">72 <span className="text-sm text-white/40">bpm</span></p>
        </div>
        <div style={{ width: '120px', height: '60px' }}>
          {!mounted ? <ChartPlaceholder className="h-[60px] min-h-0" /> : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#05070A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="heartRate" stroke="#FF4D6D" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-white/5" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">SpO2 Level</p>
          <p className="text-2xl font-light text-white">99 <span className="text-sm text-white/40">%</span></p>
        </div>
        <div style={{ width: '120px', height: '60px' }}>
          {!mounted ? <ChartPlaceholder className="h-[60px] min-h-0" /> : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis domain={[95, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#05070A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="spO2" stroke="#29F0E0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
