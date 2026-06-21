"use client";
import React, { useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { useRouter } from "next/navigation";
import { useStore } from "../../../store/useStore";
import { Shield, User, Building2, Pill, ChevronRight, Lock, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type LoginRole = "patient" | "hospital" | "pharmacy" | "insurance";

const ROLE_CONFIG: Record<LoginRole, {
  label: string;
  icon: any;
  color: string;
  glow: string;
  border: string;
  bg: string;
  demo: string;
  dest: string;
  description: string;
}> = {
  patient: {
    label: "Patient", icon: User,
    color: "text-[#29F0E0]", glow: "shadow-[0_0_20px_rgba(41,240,224,0.25)]",
    border: "border-[#29F0E0]/40", bg: "bg-[#29F0E0]/10",
    demo: "patient@demo.com", dest: "/patient-dashboard",
    description: "Access your health vault, prescriptions & records"
  },
  hospital: {
    label: "Hospital Staff", icon: Building2,
    color: "text-[#2E6FFF]", glow: "shadow-[0_0_20px_rgba(46,111,255,0.25)]",
    border: "border-[#2E6FFF]/40", bg: "bg-[#2E6FFF]/10",
    demo: "hospital@demo.com", dest: "/hospital-dashboard",
    description: "Manage patient records, prescribe medications & view consent"
  },
  pharmacy: {
    label: "Pharmacy Staff", icon: Pill,
    color: "text-[#A855F7]", glow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    border: "border-[#A855F7]/40", bg: "bg-[#A855F7]/10",
    demo: "pharmacy@demo.com", dest: "/pharmacy-dashboard",
    description: "Verify & dispense prescriptions, scan QR codes"
  },
  insurance: {
    label: "Insurance", icon: Shield,
    color: "text-[#F59E0B]", glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    border: "border-[#F59E0B]/40", bg: "bg-[#F59E0B]/10",
    demo: "insurance@demo.com", dest: "/insurance-dashboard",
    description: "Adjudicate claims, verify coverage & audit consent trail"
  },
};

export default function LogInPage() {
  const [selectedRole, setSelectedRole] = useState<LoginRole>("patient");
  const [email, setEmail] = useState("patient@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);

  const cfg = ROLE_CONFIG[selectedRole];

  const handleRoleSelect = (role: LoginRole) => {
    setSelectedRole(role);
    setEmail(ROLE_CONFIG[role].demo);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise(r => setTimeout(r, 700));

      if (password.length < 4) throw new Error("Invalid credentials.");

      // Validate email matches selected role
      const emailRole = email.includes("hospital") ? "hospital"
        : email.includes("pharmacy") ? "pharmacy"
        : email.includes("insurance") ? "insurance"
        : "patient";

      if (emailRole !== selectedRole) {
        throw new Error(`This account is not a ${cfg.label} account.`);
      }

      login(email);
      document.cookie = `healthmesh_token=${selectedRole}; path=/; max-age=86400`;
      toast.success(`Authenticated as ${cfg.label}`);
      router.push(cfg.dest);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      toast.error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#29F0E0] to-[#2E6FFF] shadow-[0_0_30px_rgba(41,240,224,0.3)] mb-4 flex items-center justify-center">
            <Activity className="text-black w-7 h-7" />
          </div>
          <h1 className="text-3xl font-light text-white tracking-tight">Sirona AI</h1>
          <p className="text-white/40 text-sm mt-1">Patient-Owned Prescription Network</p>
        </div>

        <GlassPanel className="p-0 overflow-hidden">
          {/* Role Selector */}
          <div className="grid grid-cols-4 border-b border-white/5">
            {(Object.keys(ROLE_CONFIG) as LoginRole[]).map((role) => {
              const rc = ROLE_CONFIG[role];
              const Icon = rc.icon;
              const isActive = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`relative flex flex-col items-center py-4 px-2 gap-1.5 transition-all ${isActive ? rc.bg : "hover:bg-white/[0.03]"}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? rc.color : "text-white/30"}`} />
                  <span className={`text-[10px] font-medium leading-none text-center ${isActive ? rc.color : "text-white/30"}`}>
                    {role === "insurance" ? "Insurance" : rc.label.split(" ")[0]}
                  </span>
                  {isActive && (
                    <motion.div layoutId="role-indicator" className={`absolute bottom-0 left-0 right-0 h-px ${rc.bg.replace("/10", "")}`}
                      style={{ background: isActive ? rc.color.replace("text-", "").replace("[", "").replace("]", "") : "transparent" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {/* Role Description */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border mb-6 ${cfg.border} ${cfg.bg}`}>
                  <cfg.icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                  <p className={`text-xs ${cfg.color} opacity-80`}>{cfg.description}</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors text-sm"
                        required
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#FF4D6D] text-sm flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`mt-2 w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${cfg.glow}`}
                    style={{ background: `linear-gradient(135deg, ${cfg.color.replace("text-[", "").replace("]", "")}CC, ${cfg.color.replace("text-[", "").replace("]", "")}88)`, color: "white" }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Authenticating...
                      </span>
                    ) : (
                      <>Sign in as {cfg.label} <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                {/* Demo credentials */}
                <div className="mt-6 pt-5 border-t border-white/5">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3">Demo credentials</p>
                  <div className="flex flex-col gap-1.5">
                    {(Object.entries(ROLE_CONFIG) as [LoginRole, typeof cfg][]).map(([role, rc]) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs ${selectedRole === role ? `${rc.bg} ${rc.border} border` : "hover:bg-white/[0.03] border border-transparent"}`}
                      >
                        <span className={selectedRole === role ? rc.color : "text-white/40"}>{rc.demo}</span>
                        <span className="text-white/20">pw: demo1234</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </GlassPanel>

        <p className="text-center text-xs text-white/20 mt-4">
          New organization?{" "}
          <Link href="/sign-up" className="text-white/40 hover:text-white transition-colors underline">Request access</Link>
        </p>
      </div>
    </div>
  );
}
