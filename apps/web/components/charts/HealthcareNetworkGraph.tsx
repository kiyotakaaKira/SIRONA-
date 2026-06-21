"use client";
import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { User, Building2, Pill, Shield } from 'lucide-react';

const initialNodes = [
  {
    id: 'patient',
    type: 'default',
    position: { x: 300, y: 150 },
    data: { 
      label: (
        <div className="flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-10 h-10 rounded-full bg-[#29F0E0]/20 flex items-center justify-center border border-[#29F0E0]">
            <User className="w-5 h-5 text-[#29F0E0]" />
          </div>
          <span className="text-white font-medium">Patient Vault</span>
        </div>
      ) 
    },
    style: { background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px' }
  },
  {
    id: 'hospital',
    type: 'default',
    position: { x: 50, y: 50 },
    data: { 
      label: (
        <div className="flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-10 h-10 rounded-full bg-[#2E6FFF]/20 flex items-center justify-center border border-[#2E6FFF]">
            <Building2 className="w-5 h-5 text-[#2E6FFF]" />
          </div>
          <span className="text-white font-medium">Hospital Node</span>
        </div>
      ) 
    },
    style: { background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px' }
  },
  {
    id: 'pharmacy',
    type: 'default',
    position: { x: 50, y: 250 },
    data: { 
      label: (
        <div className="flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-10 h-10 rounded-full bg-[#2ED9A3]/20 flex items-center justify-center border border-[#2ED9A3]">
            <Pill className="w-5 h-5 text-[#2ED9A3]" />
          </div>
          <span className="text-white font-medium">Pharmacy Node</span>
        </div>
      ) 
    },
    style: { background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px' }
  },
  {
    id: 'insurance',
    type: 'default',
    position: { x: 550, y: 150 },
    data: { 
      label: (
        <div className="flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center border border-[#F59E0B]">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <span className="text-white font-medium">Insurance Node</span>
        </div>
      ) 
    },
    style: { background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px' }
  }
];

const initialEdges = [
  {
    id: 'e1',
    source: 'patient',
    target: 'hospital',
    animated: true,
    style: { stroke: '#29F0E0', strokeWidth: 2, opacity: 0.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#29F0E0' },
  },
  {
    id: 'e2',
    source: 'hospital',
    target: 'pharmacy',
    animated: true,
    style: { stroke: '#2E6FFF', strokeWidth: 2, opacity: 0.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2E6FFF' },
  },
  {
    id: 'e3',
    source: 'pharmacy',
    target: 'insurance',
    animated: true,
    style: { stroke: '#2ED9A3', strokeWidth: 2, opacity: 0.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2ED9A3' },
  },
  {
    id: 'e4',
    source: 'patient',
    target: 'insurance',
    animated: true,
    style: { stroke: '#29F0E0', strokeWidth: 2, opacity: 0.5, strokeDasharray: '5, 5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#29F0E0' },
  }
];

export function HealthcareNetworkGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#ffffff20" />
      </ReactFlow>
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#29F0E0]" />
          <span className="text-xs text-white/70">Patient Controlled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2ED9A3]" />
          <span className="text-xs text-white/70">Smart Contract Executed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-xs text-white/70">Encrypted Payload</span>
        </div>
      </div>
    </div>
  );
}
