"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartPlaceholder, useChartMounted } from './ChartFrame';

const data = [
  { name: 'Jan', healthScore: 78, activity: 24 },
  { name: 'Feb', healthScore: 82, activity: 13 },
  { name: 'Mar', healthScore: 80, activity: 58 },
  { name: 'Apr', healthScore: 88, activity: 39 },
  { name: 'May', healthScore: 92, activity: 48 },
  { name: 'Jun', healthScore: 98, activity: 38 },
];

export function HealthTimelineChart() {
  const mounted = useChartMounted();

  return (
    <div style={{ width: '100%', height: 300 }}>
      {!mounted ? <ChartPlaceholder className="h-[300px] min-h-0" /> : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ED9A3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2ED9A3" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6FFF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2E6FFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#05070A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="healthScore" stroke="#2ED9A3" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
          <Area type="monotone" dataKey="activity" stroke="#2E6FFF" strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
