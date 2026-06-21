"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartPlaceholder, useChartMounted } from './ChartFrame';

const data = [
  { name: 'Low Risk', value: 400, color: '#2ED9A3' },
  { name: 'Medium Risk', value: 300, color: '#F59E0B' },
  { name: 'High Risk', value: 300, color: '#FF4D6D' },
  { name: 'Critical', value: 200, color: '#9333EA' },
];

export function RiskDistributionChart() {
  const mounted = useChartMounted();

  return (
    <div className="w-full h-full min-h-[300px]">
      {!mounted ? <ChartPlaceholder /> : (
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
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#05070A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
