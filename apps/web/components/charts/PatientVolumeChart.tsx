"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '08:00', volume: 45, status: 'Normal Flow' },
  { time: '10:00', volume: 62, status: 'Peak Hours' },
  { time: '12:00', volume: 85, status: 'High Traffic' },
  { time: '14:00', volume: 78, status: 'Moderate Flow' },
  { time: '16:00', volume: 56, status: 'Normal Flow' },
  { time: '18:00', volume: 40, status: 'Low Traffic' },
  { time: '20:00', volume: 28, status: 'Minimum Flow' },
];

export function PatientVolumeChart() {
  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6FFF" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#2E6FFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 16, 23, 0.95)', borderColor: 'rgba(46,111,255,0.3)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}
          />
          <Area type="monotone" dataKey="volume" stroke="#29F0E0" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" activeDot={{ r: 6, fill: '#29F0E0', stroke: '#fff', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
