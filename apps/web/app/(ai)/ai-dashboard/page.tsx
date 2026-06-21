"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Network,
  Activity,
  ShieldAlert,
  Cpu,
  Zap,
  Database,
  RefreshCw,
  Play,
  Pause,
  X,
  ChevronRight,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Settings,
  Download,
  Filter,
  Search,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface LogEntry {
  id: number;
  event: string;
  source: string;
  time: string;
  type: "success" | "warning" | "error";
  detail: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  status: "online" | "syncing" | "offline";
  inferences: number;
  accuracy: number;
}

// ─── Fake data ───────────────────────────────────────────────────────────────
const INITIAL_LOGS: LogEntry[] = [
  { id: 1, event: "Capsule Generation", source: "Apollo Hospital", time: "1s ago", type: "success", detail: "Patient capsule #A9F21 synthesised in 0.38s with 99.4% confidence." },
  { id: 2, event: "Fraud Risk Analysis", source: "Walgreens Pharmacy", time: "4s ago", type: "success", detail: "Prescription #WG8812 passed fraud screen. Risk score: 0.02." },
  { id: 3, event: "Anomaly Detected", source: "HealthMesh Core", time: "12s ago", type: "warning", detail: "Unusual access pattern from node EU-5. Flagged for review." },
  { id: 4, event: "Drug Interaction Check", source: "Mercy Clinic", time: "19s ago", type: "success", detail: "Metformin + Lisinopril interaction: No contraindication found." },
  { id: 5, event: "ZKP Validation", source: "Blue Cross", time: "25s ago", type: "success", detail: "Zero-knowledge proof validated for policy #BC-3341. Privacy preserved." },
  { id: 6, event: "Model Sync Failed", source: "Node AP-7", time: "41s ago", type: "error", detail: "Connection timeout during gradient aggregation. Retry scheduled." },
  { id: 7, event: "Capsule Generation", source: "UCSF Medical", time: "52s ago", type: "success", detail: "Patient capsule #U1190 synthesised in 0.42s with 98.9% confidence." },
];

const NETWORK_NODES: Node[] = [
  { id: "us-1", label: "US-EAST-1", x: 72, y: 28, status: "online", inferences: 14203, accuracy: 98.7 },
  { id: "us-2", label: "US-WEST-2", x: 18, y: 45, status: "online", inferences: 11890, accuracy: 97.9 },
  { id: "us-3", label: "US-CENTRAL", x: 28, y: 32, status: "syncing", inferences: 8400, accuracy: 95.4 },
  { id: "eu-1", label: "EU-WEST-1", x: 48, y: 15, status: "syncing", inferences: 9541, accuracy: 96.2 },
  { id: "eu-2", label: "EU-NORTH-1", x: 55, y: 10, status: "offline", inferences: 0, accuracy: 0 },
  { id: "ap-1", label: "AP-EAST-1", x: 82, y: 55, status: "online", inferences: 7213, accuracy: 98.1 },
  { id: "ap-2", label: "AP-SOUTH-1", x: 68, y: 70, status: "online", inferences: 5804, accuracy: 97.4 },
  { id: "ap-3", label: "AP-NORTHEAST", x: 88, y: 35, status: "online", inferences: 12050, accuracy: 98.9 },
  { id: "sa-1", label: "SA-EAST-1", x: 35, y: 80, status: "syncing", inferences: 4200, accuracy: 94.1 },
  { id: "af-1", label: "AF-SOUTH-1", x: 52, y: 85, status: "online", inferences: 3100, accuracy: 95.8 },
  { id: "me-1", label: "ME-SOUTH-1", x: 62, y: 40, status: "online", inferences: 6500, accuracy: 97.2 },
  { id: "ca-1", label: "CA-CENTRAL", x: 25, y: 15, status: "online", inferences: 8900, accuracy: 98.4 },
  { id: "core", label: "GLOBAL CORE", x: 48, y: 45, status: "online", inferences: 42580, accuracy: 99.1 },
];

const TABS = ["Overview", "Node Topology", "Anomaly Logs", "Training Registry"] as const;
type Tab = typeof TABS[number];

const NODE_STATUS_COLOR: Record<Node["status"], string> = {
  online: "#2ED9A3",
  syncing: "#F59E0B",
  offline: "#FF4D6D",
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [streaming, setStreaming] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "success" | "warning" | "error">("all");
  const [capsules, setCapsules] = useState(42_500_000);
  const [activeNodes, setActiveNodes] = useState(1024);
  const [anomalies, setAnomalies] = useState(3892);
  const [avgTime, setAvgTime] = useState(0.4);
  const [refreshing, setRefreshing] = useState(false);

  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [showNodeLogs, setShowNodeLogs] = useState(false);
  
  useEffect(() => {
    setPingResult(null);
    setShowNodeLogs(false);
  }, [selectedNode]);

  const handlePing = () => {
    setPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setPinging(false);
      setPingResult(`${Math.floor(Math.random() * 40 + 10)}ms latency`);
    }, 800);
  };

  // Simulated live stream – adds a new log entry every 4 seconds
  useEffect(() => {
    if (!streaming) return;
    const events = [
      { event: "Capsule Generation", source: "Apollo Hospital", type: "success" as const, detail: "New capsule synthesised successfully." },
      { event: "Fraud Risk Analysis", source: "CVS Pharmacy", type: "success" as const, detail: "Prescription cleared with risk score 0.01." },
      { event: "Drug Interaction Check", source: "Mayo Clinic", type: "success" as const, detail: "No contraindications found." },
      { event: "Anomaly Detected", source: "Node EU-5", type: "warning" as const, detail: "Elevated inference latency detected." },
      { event: "ZKP Validation", source: "Aetna Insurance", type: "success" as const, detail: "Privacy proof verified in 0.09s." },
      { event: "Model Sync Failed", source: "Node AP-12", type: "error" as const, detail: "Network timeout during sync." },
    ];
    const interval = setInterval(() => {
      const pick = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [
        { ...pick, id: Date.now(), time: "just now" },
        ...prev.slice(0, 19),
      ]);
      setCapsules(c => c + Math.floor(Math.random() * 500 + 100));
    }, 4000);
    return () => clearInterval(interval);
  }, [streaming]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setActiveNodes(n => n + Math.floor(Math.random() * 10 - 5));
    setAnomalies(a => a + Math.floor(Math.random() * 5));
    setAvgTime(parseFloat((0.3 + Math.random() * 0.2).toFixed(2)));
    setRefreshing(false);
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchType = filterType === "all" || l.type === filterType;
    const matchSearch = searchQuery === "" ||
      l.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A855F7]/80 mb-1">Network Oversight</p>
          <h1 className="text-4xl font-light text-white tracking-tight">AI Intelligence Center</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
          <button
            onClick={() => setStreaming(s => !s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${streaming
              ? "bg-[#2ED9A3]/10 border-[#2ED9A3]/30 text-[#2ED9A3] hover:bg-[#2ED9A3]/20"
              : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"}`}
          >
            {streaming ? <><Pause className="w-3.5 h-3.5" /> Live</> : <><Play className="w-3.5 h-3.5" /> Paused</>}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] hover:bg-[#A855F7]/20 transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </motion.div>
      </header>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          { icon: Brain, label: "Capsules Synthesized", value: (capsules / 1_000_000).toFixed(1) + "M", sub: "Total", color: "purple", bg: "#A855F7" },
          { icon: Cpu, label: "Active Inference Nodes", value: activeNodes.toLocaleString(), sub: "Global", color: "blue", bg: "#2E6FFF" },
          { icon: ShieldAlert, label: "Anomalies Detected", value: anomalies.toLocaleString(), sub: "Blocked", color: "red", bg: "#FF4D6D" },
          { icon: Zap, label: "Avg Synthesis Time", value: avgTime.toFixed(2), sub: "seconds", color: "green", bg: "#2ED9A3" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={motionVariants.resolveIn}>
            <GlassPanel accentColor={stat.color as "purple" | "blue" | "red" | "green"} className="p-5 h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: `${stat.bg}18`, borderColor: `${stat.bg}30` }}>
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.bg }} />
                </div>
                <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">LIVE</span>
              </div>
              <p className="text-white/50 text-xs font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-light text-white">
                {stat.value} <span className="text-sm text-white/30">{stat.sub}</span>
              </p>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-6 border-b border-white/5 pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-px bg-[#A855F7]" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >

          {/* ─ OVERVIEW TAB ─────────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Federated Network Visual */}
              <div className="lg:col-span-2">
                <GlassPanel className="p-0 overflow-hidden h-[420px] flex flex-col">
                  <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-base font-medium text-white flex items-center gap-2">
                      <Network className="w-4 h-4 text-[#A855F7]" /> Federated Learning Network
                    </h2>
                    <button
                      onClick={() => setActiveTab("Node Topology")}
                      className="text-xs text-[#A855F7]/70 hover:text-[#A855F7] flex items-center gap-1 transition-colors"
                    >
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1 relative bg-black/40 overflow-hidden">
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Radar Sweep Effect */}
                    <motion.div 
                      className="absolute rounded-full pointer-events-none mix-blend-screen opacity-50 z-0"
                      style={{ 
                        left: '48%', top: '45%', 
                        width: '800px', height: '800px', 
                        marginLeft: '-400px', marginTop: '-400px',
                        background: 'conic-gradient(from 0deg, transparent 70%, rgba(46, 217, 163, 0.05) 80%, rgba(46, 217, 163, 0.5) 100%)' 
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full z-0">
                      {NETWORK_NODES.filter(n => n.id !== "core").map(node => {
                        const core = NETWORK_NODES.find(n => n.id === "core")!;
                        const isOnline = node.status === "online";
                        const isSyncing = node.status === "syncing";
                        const flowDuration = isOnline ? 1.5 + Math.random() : 3 + Math.random() * 2;
                        const flowDelay = Math.random() * 2;

                        return (
                          <g key={`line-${node.id}`}>
                            <motion.line
                              x1={`${node.x}%`} y1={`${node.y}%`}
                              x2={`${core.x}%`} y2={`${core.y}%`}
                              stroke={NODE_STATUS_COLOR[node.status]}
                              strokeWidth={isOnline ? "1.5" : "0.5"}
                              strokeDasharray={isSyncing ? "4 4" : undefined}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: node.status === "offline" ? 0.05 : 0.4 }}
                            />
                            {(isOnline || isSyncing) && (
                              <>
                                <motion.circle
                                  r="2.5"
                                  fill={NODE_STATUS_COLOR[node.status]}
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    cx: [`${node.x}%`, `${core.x}%`],
                                    cy: [`${node.y}%`, `${core.y}%`],
                                    opacity: [0, 1, 0]
                                  }}
                                  transition={{
                                    duration: flowDuration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: flowDelay
                                  }}
                                  style={{ filter: `drop-shadow(0 0 4px ${NODE_STATUS_COLOR[node.status]})` }}
                                />
                                <motion.text
                                  className="text-[8px] font-mono fill-white/60 font-medium"
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    x: [`${node.x}%`, `${core.x}%`],
                                    y: [`${node.y}%`, `${core.y}%`],
                                    opacity: [0, 1, 0]
                                  }}
                                  transition={{
                                    duration: flowDuration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: flowDelay
                                  }}
                                >
                                  {Math.floor(Math.random() * 800 + 100)} KB/s
                                </motion.text>
                              </>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                    {/* Nodes */}
                    {NETWORK_NODES.map(node => (
                      <motion.button
                        key={node.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group z-10"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => setSelectedNode(node)}
                        whileHover={{ scale: 1.15, zIndex: 20 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`rounded-full border-[1.5px] flex items-center justify-center relative ${node.id === "core" ? "w-10 h-10" : "w-5 h-5"}`}
                          style={{ borderColor: NODE_STATUS_COLOR[node.status], background: `${NODE_STATUS_COLOR[node.status]}20`, backdropFilter: "blur(4px)" }}
                          animate={node.status === "online" ? { boxShadow: [`0 0 0px ${NODE_STATUS_COLOR[node.status]}40`, `0 0 20px ${NODE_STATUS_COLOR[node.status]}80`, `0 0 0px ${NODE_STATUS_COLOR[node.status]}40`] } : {}}
                          transition={{ duration: node.id === "core" ? 2 : 2.5 + Math.random(), repeat: Infinity }}
                        >
                          <motion.div 
                            className="absolute inset-[-4px] border border-dashed rounded-full"
                            style={{ borderColor: NODE_STATUS_COLOR[node.status], opacity: 0.5 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
                          />
                          {node.id === "core" && (
                            <>
                              <motion.div 
                                className="absolute inset-[-10px] border border-dotted rounded-full"
                                style={{ borderColor: NODE_STATUS_COLOR[node.status], opacity: 0.3 }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              />
                              <Database className="w-4 h-4 text-[#2ED9A3] opacity-80" />
                            </>
                          )}
                        </motion.div>
                        <span className="text-[9px] font-mono font-medium text-white/50 group-hover:text-white transition-colors whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/5 shadow-xl">{node.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </GlassPanel>
              </div>

              {/* Live Stream */}
              <div>
                <GlassPanel accentColor="purple" className="p-5 h-[420px] flex flex-col border-[#A855F7]/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#A855F7] uppercase text-[10px] tracking-widest font-mono flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      {streaming ? "Live Inference Stream" : "Stream Paused"}
                    </h3>
                    {streaming && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#2ED9A3]"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    <AnimatePresence initial={false}>
                      {logs.slice(0, 8).map(log => (
                        <motion.button
                          key={log.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="w-full text-left flex flex-col gap-0.5 p-3 bg-black/40 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all"
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-xs font-medium ${log.type === "warning" ? "text-[#F59E0B]" : log.type === "error" ? "text-[#FF4D6D]" : "text-white"}`}>
                              {log.event}
                            </span>
                            <span className="text-[9px] font-mono text-white/30 shrink-0 ml-2">{log.time}</span>
                          </div>
                          <span className="text-[10px] text-white/40">{log.source}</span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={() => setActiveTab("Anomaly Logs")}
                    className="mt-3 w-full py-2 rounded-lg border border-white/10 text-xs text-white/40 hover:text-white/80 hover:border-white/20 transition-all flex items-center justify-center gap-1"
                  >
                    View full log <ChevronRight className="w-3 h-3" />
                  </button>
                </GlassPanel>
              </div>
            </div>
          )}

          {/* ─ NODE TOPOLOGY TAB ─────────────────────────────────────────── */}
          {activeTab === "Node Topology" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlassPanel className="p-0 overflow-hidden h-[520px] flex flex-col">
                  <div className="p-5 border-b border-white/5">
                    <h2 className="text-base font-medium text-white flex items-center gap-2">
                      <Network className="w-4 h-4 text-[#A855F7]" /> Node Topology Map
                    </h2>
                    <p className="text-xs text-white/40 mt-1">Click any node to inspect</p>
                  </div>
                  <div className="flex-1 relative bg-black/60 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg">
                      <defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern></defs>
                      <rect width="100%" height="100%" fill="url(#grid2)" />
                    </svg>

                    {/* Radar Sweep Effect */}
                    <motion.div 
                      className="absolute rounded-full pointer-events-none mix-blend-screen opacity-50 z-0"
                      style={{ 
                        left: '48%', top: '45%', 
                        width: '900px', height: '900px', 
                        marginLeft: '-450px', marginTop: '-450px',
                        background: 'conic-gradient(from 0deg, transparent 70%, rgba(46, 217, 163, 0.05) 80%, rgba(46, 217, 163, 0.5) 100%)' 
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />

                    <svg className="absolute inset-0 w-full h-full z-0">
                      {NETWORK_NODES.filter(n => n.id !== "core").map(node => {
                        const core = NETWORK_NODES.find(n => n.id === "core")!;
                        const isOnline = node.status === "online";
                        const isSyncing = node.status === "syncing";
                        const flowDuration = isOnline ? 1.5 + Math.random() : 3 + Math.random() * 2;
                        const flowDelay = Math.random() * 2;

                        return (
                          <g key={`line-topo-${node.id}`}>
                            <line
                              x1={`${node.x}%`} y1={`${node.y}%`}
                              x2={`${core.x}%`} y2={`${core.y}%`}
                              stroke={NODE_STATUS_COLOR[node.status]}
                              strokeWidth={isOnline ? "1.5" : "0.5"}
                              strokeDasharray={isSyncing ? "4 4" : undefined}
                              opacity={node.status === "offline" ? 0.1 : 0.3}
                            />
                            {(isOnline || isSyncing) && (
                              <>
                                <motion.circle
                                  r="3.5"
                                  fill={NODE_STATUS_COLOR[node.status]}
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    cx: [`${node.x}%`, `${core.x}%`],
                                    cy: [`${node.y}%`, `${core.y}%`],
                                    opacity: [0, 1, 0]
                                  }}
                                  transition={{
                                    duration: flowDuration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: flowDelay
                                  }}
                                  style={{ filter: `drop-shadow(0 0 8px ${NODE_STATUS_COLOR[node.status]})` }}
                                />
                                <motion.text
                                  className="text-[10px] font-mono fill-white/60 font-medium"
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    x: [`${node.x}%`, `${core.x}%`],
                                    y: [`${node.y}%`, `${core.y}%`],
                                    opacity: [0, 1, 0]
                                  }}
                                  transition={{
                                    duration: flowDuration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: flowDelay
                                  }}
                                >
                                  {Math.floor(Math.random() * 800 + 100)} KB/s
                                </motion.text>
                              </>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Nodes */}
                    {NETWORK_NODES.map(node => (
                      <motion.button
                        key={`topo-${node.id}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group z-10"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => setSelectedNode(node)}
                        whileHover={{ scale: 1.15, zIndex: 20 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`rounded-full border-[1.5px] flex items-center justify-center relative ${node.id === "core" ? "w-16 h-16" : "w-8 h-8"}`}
                          style={{ borderColor: NODE_STATUS_COLOR[node.status], background: `${NODE_STATUS_COLOR[node.status]}25`, backdropFilter: "blur(4px)" }}
                          animate={node.status === "online" ? { boxShadow: [`0 0 0px ${NODE_STATUS_COLOR[node.status]}40`, `0 0 25px ${NODE_STATUS_COLOR[node.status]}80`, `0 0 0px ${NODE_STATUS_COLOR[node.status]}40`] } : {}}
                          transition={{ duration: node.id === "core" ? 2 : 2.5 + Math.random(), repeat: Infinity }}
                        >
                          <motion.div 
                            className="absolute inset-[-6px] border border-dashed rounded-full"
                            style={{ borderColor: NODE_STATUS_COLOR[node.status], opacity: 0.5 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
                          />
                          {node.id === "core" && (
                            <>
                              <motion.div 
                                className="absolute inset-[-14px] border border-dotted rounded-full"
                                style={{ borderColor: NODE_STATUS_COLOR[node.status], opacity: 0.3 }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              />
                              <Database className="w-6 h-6 text-[#2ED9A3] opacity-90" />
                            </>
                          )}
                        </motion.div>
                        <span className="text-[10px] font-mono font-medium text-white/60 group-hover:text-white transition-colors whitespace-nowrap bg-black/60 px-2 py-1 rounded-md backdrop-blur-md border border-white/10 shadow-xl">{node.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </GlassPanel>
              </div>
              <div className="flex flex-col gap-4">
                {NETWORK_NODES.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{node.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: NODE_STATUS_COLOR[node.status], borderColor: `${NODE_STATUS_COLOR[node.status]}40`, background: `${NODE_STATUS_COLOR[node.status]}10` }}>
                        {node.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40">{node.inferences.toLocaleString()} inferences · {node.accuracy}% accuracy</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─ ANOMALY LOGS TAB ──────────────────────────────────────────── */}
          {activeTab === "Anomaly Logs" && (
            <GlassPanel className="p-0 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <h2 className="text-base font-medium text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FF4D6D]" /> Inference Event Log
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-44"
                    />
                  </div>
                  {(["all", "success", "warning", "error"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filterType === f ? "bg-white/10 border-white/20 text-white" : "border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[480px] custom-scrollbar">
                {filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-white/30 text-sm gap-2">
                    <Filter className="w-5 h-5" />
                    No events match filters
                  </div>
                ) : filteredLogs.map((log, i) => (
                  <motion.button
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedLog(log)}
                    className="w-full text-left flex items-center gap-4 px-5 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="shrink-0">
                      {log.type === "success" ? <CheckCircle2 className="w-4 h-4 text-[#2ED9A3]" /> : log.type === "warning" ? <AlertTriangle className="w-4 h-4 text-[#F59E0B]" /> : <X className="w-4 h-4 text-[#FF4D6D]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-white block">{log.event}</span>
                      <span className="text-xs text-white/40">{log.source}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-white/30 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.time}</span>
                      <Eye className="w-3.5 h-3.5 text-white/20 hover:text-white/60 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassPanel>
          )}

          {/* ─ TRAINING REGISTRY TAB ─────────────────────────────────────── */}
          {activeTab === "Training Registry" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: "Drug Interaction Classifier v4.2", status: "Active", accuracy: 98.7, rounds: 142, nodes: 1020, lastTrained: "2 hours ago", color: "#2ED9A3" },
                { name: "Fraud Detection Model v2.8", status: "Active", accuracy: 97.3, rounds: 89, nodes: 956, lastTrained: "6 hours ago", color: "#2ED9A3" },
                { name: "Prescription OCR Engine v1.5", status: "Training", accuracy: 94.1, rounds: 31, nodes: 430, lastTrained: "In progress", color: "#F59E0B" },
                { name: "Anomaly Detection v3.0", status: "Active", accuracy: 99.1, rounds: 204, nodes: 1024, lastTrained: "45 min ago", color: "#2ED9A3" },
                { name: "Patient Risk Scorer v2.1", status: "Paused", accuracy: 91.8, rounds: 67, nodes: 0, lastTrained: "3 days ago", color: "#FF4D6D" },
                { name: "Insurance Claim Validator v1.2", status: "Active", accuracy: 96.5, rounds: 55, nodes: 780, lastTrained: "1 hour ago", color: "#2ED9A3" },
              ].map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <GlassPanel className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium text-sm">{model.name}</p>
                        <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Last trained: {model.lastTrained}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: model.color, borderColor: `${model.color}40`, background: `${model.color}10` }}>
                        {model.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Accuracy", value: `${model.accuracy}%` },
                        { label: "Rounds", value: model.rounds.toString() },
                        { label: "Nodes", value: model.nodes.toLocaleString() },
                      ].map(stat => (
                        <div key={stat.label} className="bg-black/40 rounded-lg p-2.5 text-center">
                          <p className="text-white text-sm font-light">{stat.value}</p>
                          <p className="text-white/30 text-[10px] mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: model.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${model.accuracy}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-1.5">
                        <BarChart3 className="w-3 h-3" /> View Metrics
                      </button>
                      <button className="flex-1 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-1.5">
                        <Settings className="w-3 h-3" /> Configure
                      </button>
                      {model.status === "Paused" && (
                        <button className="flex-1 py-1.5 rounded-lg border border-[#2ED9A3]/30 bg-[#2ED9A3]/10 text-xs text-[#2ED9A3] hover:bg-[#2ED9A3]/20 transition-all flex items-center justify-center gap-1.5">
                          <Play className="w-3 h-3" /> Resume
                        </button>
                      )}
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Log Detail Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {selectedLog.type === "success" ? <CheckCircle2 className="w-5 h-5 text-[#2ED9A3]" /> : selectedLog.type === "warning" ? <AlertTriangle className="w-5 h-5 text-[#F59E0B]" /> : <X className="w-5 h-5 text-[#FF4D6D]" />}
                  <h3 className="text-white font-medium">{selectedLog.event}</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Source</p>
                  <p className="text-sm text-white">{selectedLog.source}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Detail</p>
                  <p className="text-sm text-white/80">{selectedLog.detail}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Timestamp</p>
                  <p className="text-sm text-white/80">{selectedLog.time}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLog(null)} className="mt-4 w-full py-2 rounded-lg border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Node Inspector Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-white font-medium text-lg">{selectedNode.label}</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border mt-1 inline-block" style={{ color: NODE_STATUS_COLOR[selectedNode.status], borderColor: `${NODE_STATUS_COLOR[selectedNode.status]}40`, background: `${NODE_STATUS_COLOR[selectedNode.status]}10` }}>
                    {selectedNode.status.toUpperCase()}
                  </span>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Inferences", value: selectedNode.inferences.toLocaleString() },
                  { label: "Accuracy", value: selectedNode.accuracy > 0 ? `${selectedNode.accuracy}%` : "—" },
                  { label: "Coordinates", value: `${selectedNode.x}°, ${selectedNode.y}°` },
                  { label: "Node ID", value: selectedNode.id.toUpperCase() },
                ].map(stat => (
                  <div key={stat.label} className="bg-black/40 rounded-lg p-3">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-sm text-white font-light">{stat.value}</p>
                  </div>
                ))}
              </div>
              {/* Node Logs View */}
              <AnimatePresence>
                {showNodeLogs && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="bg-black/60 border border-white/5 rounded-lg p-3 h-32 overflow-y-auto font-mono text-[10px] text-white/60 space-y-2 custom-scrollbar">
                      <p><span className="text-[#2ED9A3]">[OK]</span> Connection established to {selectedNode.label}</p>
                      <p><span className="text-[#2ED9A3]">[OK]</span> Gradient weights synced at {new Date().toLocaleTimeString()}</p>
                      <p><span className="text-[#F59E0B]">[WARN]</span> Latency spike detected (+12ms)</p>
                      <p><span className="text-[#2ED9A3]">[OK]</span> Model parameters verified. SHA-256 matched.</p>
                      <p className="animate-pulse">_ Waiting for next aggregation cycle...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ping Result */}
              <AnimatePresence>
                {pingResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-center mb-3 text-xs text-[#2ED9A3] font-mono"
                  >
                    Success: {pingResult}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <button 
                  onClick={handlePing}
                  disabled={pinging || selectedNode.status === 'offline'}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pinging ? "Pinging..." : "Ping Node"}
                </button>
                <button 
                  onClick={() => setShowNodeLogs(!showNodeLogs)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  {showNodeLogs ? "Hide Logs" : "View Logs"}
                </button>
                <button onClick={() => setSelectedNode(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
