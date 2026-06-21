"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartPlaceholder, useChartMounted } from './ChartFrame';

const data = [
  { name: 'Mon', adherence: 100, expected: 100 },
  { name: 'Tue', adherence: 100, expected: 100 },
  { name: 'Wed', adherence: 50, expected: 100 },
  { name: 'Thu', adherence: 100, expected: 100 },
  { name: 'Fri', adherence: 100, expected: 100 },
  { name: 'Sat', adherence: 0, expected: 100 },
  { name: 'Sun', adherence: 100, expected: 100 },
];

export function MedicationTimeline() {
  const mounted = useChartMounted();

  return (
    <div className="w-full h-full min-h-[300px]">
      {!mounted ? <ChartPlaceholder /> : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#29F0E0" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#29F0E0" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6FFF" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2E6FFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.4)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.4)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#05070A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="step" dataKey="expected" stroke="#2E6FFF" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorExpected)" />
          <Area type="step" dataKey="adherence" stroke="#29F0E0" strokeWidth={2} fillOpacity={1} fill="url(#colorAdherence)" />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
