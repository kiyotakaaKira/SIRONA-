"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  Building2,
  CheckCircle2,
  FileSignature,
  Key,
  Pill,
  Play,
  QrCode,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Role, useStore } from "../store/useStore";

type DemoRole = Role;

const moduleGroups = [
  {
    title: "Patient-owned record vault",
    text: "Encrypted uploads, prescriptions, continuity capsule, and clear access history.",
    icon: Upload,
    href: "/vault",
    role: "patient" as DemoRole,
    accent: "from-cyan-400 to-blue-600",
    actions: ["Upload record", "Open capsule", "Review audit"],
  },
  {
    title: "Consent and emergency access",
    text: "Approve, revoke, expire, and review break-glass access without hiding risk from the patient.",
    icon: Key,
    href: "/consent",
    role: "patient" as DemoRole,
    accent: "from-emerald-400 to-cyan-600",
    actions: ["Approve grants", "Revoke access", "Debrief emergency"],
  },
  {
    title: "Hospital clinical workspace",
    text: "Patient search, active consent context, prescription writing, and safety flags in one flow.",
    icon: Building2,
    href: "/hospital-dashboard",
    role: "hospital" as DemoRole,
    accent: "from-blue-500 to-indigo-700",
    actions: ["Search patient", "Issue prescription", "View flags"],
  },
  {
    title: "Pharmacy verification",
    text: "QR prescription checks, dispense status, inventory signal, and fraud confidence.",
    icon: QrCode,
    href: "/pharmacy-dashboard",
    role: "pharmacy" as DemoRole,
    accent: "from-teal-400 to-emerald-600",
    actions: ["Scan QR", "Verify signature", "Dispense"],
  },
  {
    title: "Claims and intelligence",
    text: "Insurance review, smart rules, anomaly checks, and plain-language AI safety context.",
    icon: Brain,
    href: "/ai-dashboard",
    role: "patient" as DemoRole,
    accent: "from-sky-400 to-violet-600",
    actions: ["Run AI check", "Review claim", "Monitor network"],
  },
];

const workspaces = [
  { title: "Patient", href: "/patient-dashboard", role: "patient" as DemoRole, icon: User, note: "Vault, consent, audit" },
  { title: "Hospital", href: "/hospital-dashboard", role: "hospital" as DemoRole, icon: Building2, note: "Search, prescribe, emergency" },
  { title: "Pharmacy", href: "/pharmacy-dashboard", role: "pharmacy" as DemoRole, icon: Pill, note: "Scan, verify, dispense" },
  { title: "Insurance", href: "/insurance-dashboard", role: "insurance" as DemoRole, icon: Shield, note: "Claims, rules, approvals" },
  { title: "AI Center", href: "/ai-dashboard", role: "patient" as DemoRole, icon: Brain, note: "Safety and anomalies" },
];

const intelligenceSignals = [
  { label: "Signature verified", value: "99.2%", icon: ShieldCheck },
  { label: "Active consent paths", value: "3", icon: Key },
  { label: "Pending intervention", value: "1", icon: ShieldAlert },
];

const BrainVisual = () => (
  <div className="relative h-[340px] w-full overflow-hidden rounded-[28px] border border-cyan-100/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.6)] backdrop-blur-2xl sm:h-[390px] flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.18),transparent_50%)]" />
    
    {/* Glass sphere container layer */}
    <div className="absolute w-[290px] h-[290px] rounded-full border border-cyan-500/20 bg-cyan-500/[0.01] shadow-[0_0_50px_rgba(41,240,224,0.08),inset_0_0_35px_rgba(99,102,241,0.05)] flex items-center justify-center">
      <motion.svg
        viewBox="0 0 200 200"
        className="w-[220px] h-[220px] drop-shadow-[0_0_25px_rgba(41,240,224,0.35)]"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Core brain glow/axis */}
        <circle cx="100" cy="100" r="12" fill="#8bf2ff" opacity="0.4" />
        <circle cx="100" cy="100" r="4" fill="#ffffff" opacity="0.8" />
        
        {/* Horizontal & Vertical Grid Axes */}
        <line x1="30" y1="100" x2="170" y2="100" stroke="#8bf2ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
        <line x1="100" y1="30" x2="100" y2="170" stroke="#8bf2ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

        {/* Orbit Rings / Calibration Marks */}
        <circle cx="100" cy="100" r="35" fill="none" stroke="#29f0e0" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#2990f0" strokeWidth="0.8" strokeDasharray="1 5" opacity="0.4" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.2" />

        {/* Brain Left Hemisphere Outline & Folds */}
        <path 
          d="M 100 50 C 82 50, 58 55, 48 70 C 38 85, 38 100, 46 115 C 40 128, 48 142, 58 148 C 68 154, 82 150, 100 144 Z" 
          fill="url(#leftCerebrumGrad)" 
          stroke="#41f0f0" 
          strokeWidth="1.2" 
          opacity="0.85" 
        />
        <path 
          d="M 85 58 C 72 65, 68 78, 76 88 C 80 94, 65 105, 55 102 C 50 108, 55 118, 62 122 C 68 126, 78 118, 85 125 C 88 132, 80 138, 100 140" 
          fill="none" 
          stroke="#2990f0" 
          strokeWidth="0.8" 
          opacity="0.7" 
        />

        {/* Brain Right Hemisphere Outline & Folds */}
        <path 
          d="M 100 50 C 118 50, 142 55, 152 70 C 162 85, 162 100, 154 115 C 160 128, 152 142, 142 148 C 132 154, 118 150, 100 144 Z" 
          fill="url(#rightCerebrumGrad)" 
          stroke="#8b5cf6" 
          strokeWidth="1.2" 
          opacity="0.85" 
        />
        <path 
          d="M 115 58 C 128 65, 132 78, 124 88 C 120 94, 135 105, 145 102 C 150 108, 145 118, 138 122 C 132 126, 122 118, 115 125 C 112 132, 120 138, 100 140" 
          fill="none" 
          stroke="#8b5cf6" 
          strokeWidth="0.8" 
          opacity="0.7" 
        />

        {/* Neural Circuit Connections */}
        <line x1="75" y1="70" x2="100" y2="100" stroke="#c2f9ff" strokeWidth="1" opacity="0.4" />
        <line x1="125" y1="70" x2="100" y2="100" stroke="#c2f9ff" strokeWidth="1" opacity="0.4" />
        <line x1="70" y1="95" x2="100" y2="100" stroke="#c2f9ff" strokeWidth="1" opacity="0.4" />
        <line x1="130" y1="95" x2="100" y2="100" stroke="#c2f9ff" strokeWidth="1" opacity="0.4" />
        <line x1="80" y1="130" x2="100" y2="100" stroke="#c2f9ff" strokeWidth="1" opacity="0.4" />
        <line x1="120" y1="130" x2="100" y2="100" stroke="#c2f9ff" strokeWidth="1" opacity="0.4" />
        <line x1="55" y1="115" x2="70" y2="95" stroke="#c2f9ff" strokeWidth="1.2" opacity="0.5" />
        <line x1="145" y1="115" x2="130" y2="95" stroke="#c2f9ff" strokeWidth="1.2" opacity="0.5" />
        <line x1="55" y1="115" x2="80" y2="130" stroke="#c2f9ff" strokeWidth="1" opacity="0.5" />
        <line x1="145" y1="115" x2="120" y2="130" stroke="#c2f9ff" strokeWidth="1" opacity="0.5" />

        {/* Glowing Neural Synaptic Nodes */}
        <motion.circle cx="75" cy="70" r="3" fill="#ffffff" animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="125" cy="70" r="3" fill="#ffffff" animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="70" cy="95" r="3.5" fill="#41f0f0" animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }} transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="130" cy="95" r="3.5" fill="#8b5cf6" animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="55" cy="115" r="2.5" fill="#ffffff" animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.9, repeat: Infinity }} />
        <motion.circle cx="145" cy="115" r="2.5" fill="#ffffff" animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
        <motion.circle cx="80" cy="130" r="3" fill="#41f0f0" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3.5, repeat: Infinity }} />
        <motion.circle cx="120" cy="130" r="3" fill="#8b5cf6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3.2, repeat: Infinity }} />

        {/* Defs / Gradients */}
        <defs>
          <linearGradient id="leftCerebrumGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#29f0e0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2990f0" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="rightCerebrumGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2990f0" stopOpacity="0.03" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>

    {/* Labels */}
    <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-cyan-400 shadow-sm backdrop-blur-xl">
      Medical Network AI scan
    </div>
    <div className="absolute bottom-6 right-6 hidden rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 shadow-[0_12px_30px_rgba(16,185,129,0.15)] sm:block">
      Ledger verified
    </div>
  </div>
);

const NetworkPreview = () => {
  const nodes = [
    { label: "Patient", icon: User, className: "left-[8%] top-[42%]" },
    { label: "Hospital", icon: Building2, className: "left-[40%] top-[12%]" },
    { label: "Pharmacy", icon: Pill, className: "right-[8%] top-[42%]" },
    { label: "Insurance", icon: Shield, className: "left-[38%] bottom-[10%]" },
  ];

  return (
    <div className="relative h-[500px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:h-[390px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_24%)]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
      />
      <div className="absolute left-[18%] right-[18%] top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent" />
      <div className="absolute left-1/2 top-[18%] h-[64%] w-px bg-gradient-to-b from-transparent via-cyan-300/65 to-transparent" />
      <div className="absolute left-[25%] top-[25%] h-px w-[50%] rotate-[31deg] bg-cyan-300/35" />
      <div className="absolute left-[25%] bottom-[25%] h-px w-[50%] rotate-[-31deg] bg-cyan-300/35" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/45 bg-cyan-300/15 text-cyan-100 shadow-[0_0_60px_rgba(34,211,238,0.28)] backdrop-blur-xl"
      >
        <Activity className="h-8 w-8" />
      </motion.div>
      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          animate={{ y: [0, index % 2 ? -5 : 5, 0] }}
          transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute ${node.className} flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl`}
        >
          <node.icon className="h-5 w-5 text-cyan-200" />
          <span className="text-sm font-semibold">{node.label}</span>
        </motion.div>
      ))}
      <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
        {intelligenceSignals.map((signal) => (
          <div key={signal.label} className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-200">
              <signal.icon className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">{signal.label}</span>
            </div>
            <div className="mt-2 text-xl font-semibold text-white">{signal.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HomeDashboard() {
  const router = useRouter();
  const { records, grants, prescriptions, login } = useStore();

  const prepareDemo = (role: DemoRole) => {
    const emailByRole: Record<DemoRole, string> = {
      patient: "patient@demo.com",
      hospital: "hospital@demo.com",
      pharmacy: "pharmacy@demo.com",
      insurance: "insurance@demo.com",
    };

    login(emailByRole[role]);
    document.cookie = `healthmesh_token=${role}; path=/; max-age=86400`;
    toast.success(`Preparing ${role} demo workspace`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fdff_0%,#e9f8ff_38%,#ffffff_68%,#dff4ff_100%)] font-sans text-slate-950 md:pl-[80px]">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#f8fdff_0%,#e9f8ff_38%,#ffffff_68%,#dff4ff_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(14,165,233,0.2),transparent_26%),radial-gradient(circle_at_84%_12%,rgba(45,212,191,0.18),transparent_26%),radial-gradient(circle_at_75%_78%,rgba(37,99,235,0.12),transparent_30%)]" />

      <div className="mx-auto w-full max-w-[1500px] px-4 py-4 sm:px-6 md:px-10">
        <nav className="sticky top-4 z-40 mb-8 flex flex-wrap items-center justify-center gap-4 rounded-[28px] border border-white/70 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:justify-between sm:rounded-full sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 text-white shadow-[0_12px_28px_rgba(37,99,235,0.28)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block text-lg font-semibold tracking-tight text-slate-950">Sirona</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Medical Intelligence</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 rounded-full bg-slate-950/5 p-1 text-sm font-medium text-slate-600 lg:flex">
            {[
              ["Map", "#map"],
              ["Network", "#network"],
              ["Workspaces", "#workspaces"],
            ].map(([label, href]) => (
              // anchor tags are correct here — these are in-page hash links, not route navigation
              <a key={label} href={href} className="rounded-full px-4 py-2 transition hover:bg-white hover:text-slate-950">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* Bug 2 fix: <a> → <Link> to prevent full-page reload wiping Zustand store */}
            <Link
              href="/notifications"
              onClick={() => prepareDemo("patient")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/60 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <Link
              href="/patient-dashboard"
              onClick={() => prepareDemo("patient")}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-700"
            >
              Enter Portal
            </Link>
          </div>
        </nav>

        <section className="grid items-center gap-8 pb-12 pt-2 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 shadow-sm backdrop-blur-xl">
              <ShieldCheck className="h-4 w-4" />
              Consent-first medical network
            </div>
            <h1 className="text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">
              Sirona makes patient-owned care feel orderly, fast, and human.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
              One premium front door for the existing vault, consent, prescription, claims, and AI safety features. No duplicate pathways, no decorative dead ends.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* Bug 2 fix: <a> → <Link> for client-side navigation */}
              <Link
                href="/patient-dashboard"
                onClick={() => prepareDemo("patient")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-6 py-4 text-sm font-bold text-white shadow-[0_20px_45px_rgba(37,99,235,0.28)] transition hover:-translate-y-1"
              >
                Open Patient Vault <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/ai-dashboard"
                onClick={() => prepareDemo("patient")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white/70 px-6 py-4 text-sm font-bold text-slate-800 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white"
              >
                <Play className="h-4 w-4" /> Run Safety Review
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [`${records.length}`, "Records ready"],
                [`${grants.length}`, "Consent grants"],
                [`${prescriptions.length}`, "Prescriptions tracked"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                  <div className="text-2xl font-semibold text-slate-950">{value}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.08 }} className="relative pb-12 sm:pb-0">
            <BrainVisual />
            <div className="relative mx-auto -mt-10 w-[92%] rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_22px_65px_rgba(14,116,144,0.16)] backdrop-blur-2xl sm:absolute sm:-bottom-7 sm:left-6 sm:mx-0 sm:w-[58%]">
              <div className="flex items-center gap-3">
                {/* Bug 3 fix: add loading="lazy" so this doesn't block LCP */}
                <img
                  alt="Professional female doctor"
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=420&q=85"
                  decoding="async"
                  loading="lazy"
                  className="h-16 w-16 rounded-2xl object-cover shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                />
                <div>
                  <div className="text-sm font-bold text-slate-950">Dr. Amara Iyer</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">Clinical consent officer</div>
                </div>
              </div>
            </div>
            <div className="absolute right-3 top-6 rounded-3xl border border-cyan-100 bg-white/70 p-4 shadow-[0_24px_70px_rgba(37,99,235,0.16)] backdrop-blur-2xl">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <div className="mt-2 text-xs font-semibold text-slate-600">Ledger intact</div>
            </div>
          </motion.div>
        </section>

        <section id="map" className="py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Streamlined feature map</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Every feature has one obvious place.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              The original master-prompt capabilities are grouped by hospital workflow instead of repeated as separate cards, dashboards, and quick links.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {moduleGroups.map((module, index) => (
              // Bug 2 fix: motion.a → motion(Link) for client-side navigation
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="h-full"
              >
                <Link
                  href={module.href}
                  onClick={() => prepareDemo(module.role)}
                  className="group flex h-full flex-col rounded-[24px] border border-white/75 bg-white/65 p-5 text-left shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
                >
                  <div className={`mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${module.accent} text-white shadow-[0_14px_34px_rgba(14,116,144,0.22)]`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-950">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{module.text}</p>
                  <div className="mt-auto pt-5">
                    <div className="space-y-2">
                      {module.actions.map((action) => (
                        <div key={action} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {action}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
                      Open module <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="network" className="grid gap-8 py-10 xl:grid-cols-[1.15fr_0.85fr]">
          <NetworkPreview />
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Useful novelty, low implementation friction</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Small intelligence layers that reduce work.</h2>
            <div className="mt-6 grid gap-4">
              {[
                {
                  title: "Consent Radar",
                  text: "Surfaces expiring grants, pending pharmacy requests, and unusual access patterns before staff start chart review.",
                  icon: Key,
                },
                {
                  title: "Medication Twin",
                  text: "Compares active medicines, allergies, prescribers, and dispense state to reduce duplicate therapy risk.",
                  icon: Pill,
                },
                {
                  title: "Break-glass Debrief",
                  text: "Turns emergency access into a patient-facing follow-up checklist instead of a cryptic audit row.",
                  icon: FileSignature,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-white/75 bg-white/65 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
                  <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workspaces" className="pb-12 pt-10">
          <div className="rounded-[30px] border border-white/75 bg-white/65 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Role workspaces</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Pick a workspace and continue.</h2>
              </div>
              {/* Bug 2 fix: <a> → <Link> */}
              <Link
                href="/notifications"
                onClick={() => prepareDemo("patient")}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700"
              >
                <Bell className="h-4 w-4" /> Review alerts
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {workspaces.map((workspace) => (
                <Link
                  key={workspace.title}
                  href={workspace.href}
                  onClick={() => prepareDemo(workspace.role)}
                  className="group rounded-[22px] border border-cyan-100/80 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:bg-cyan-50"
                >
                  <workspace.icon className="h-6 w-6 text-cyan-700" />
                  <h3 className="mt-4 font-semibold text-slate-950">{workspace.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{workspace.note}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
                    Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
