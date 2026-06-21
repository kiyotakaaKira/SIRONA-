"use client";
import React, { useState } from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion } from "framer-motion";
import { User, Shield, Bell, Key, Smartphone, Lock, LogOut, Building2, Pill, Activity } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    document.cookie = "healthmesh_token=; path=/; max-age=0";
    logout();
    router.push("/log-in");
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  const RoleIcon = user?.role === "hospital" ? Building2
    : user?.role === "pharmacy" ? Pill
    : user?.role === "insurance" ? Shield
    : User;

  const roleColor = user?.role === "hospital" ? "text-[#2E6FFF]"
    : user?.role === "pharmacy" ? "text-[#A855F7]"
    : user?.role === "insurance" ? "text-[#F59E0B]"
    : "text-[#29F0E0]";

  return (
    <div className="p-6 md:p-10 max-w-[1100px] mx-auto min-h-screen">
      <header className="mb-8">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className={`text-[11px] font-mono uppercase tracking-[0.25em] mb-2 ${roleColor} opacity-80`}>
            {user?.role ?? "Account"} · {user?.name}
          </motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight">Profile & Settings</motion.h1>
        </motion.div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-1">
          {[
            { id: "profile" as const, label: "Profile", icon: User },
            { id: "security" as const, label: "Security", icon: Key },
            { id: "notifications" as const, label: "Notifications", icon: Bell },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === tab.id ? `${roleColor.replace("text-", "bg-").replace("]", "/10]")} ${roleColor} font-medium` : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
          <div className="h-px bg-white/5 my-2" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF4D6D]/70 hover:bg-[#FF4D6D]/10 hover:text-[#FF4D6D] transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>

            {activeTab === "profile" && (
              <div className="flex flex-col gap-5">
                <GlassPanel className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                      <RoleIcon className={`w-7 h-7 ${roleColor}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-white/40 text-sm">{user?.email}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border mt-1 inline-block capitalize ${roleColor} border-current opacity-60`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Display Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-white/25 text-sm transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Email</label>
                      <input type="email" defaultValue={user?.email} disabled className="w-full bg-white/5 border border-transparent rounded-xl py-2.5 px-4 text-white/40 cursor-not-allowed text-sm font-mono" />
                    </div>
                    {user?.patientId && (
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Patient ID</label>
                        <input type="text" value={user.patientId} disabled className="w-full bg-white/5 border border-transparent rounded-xl py-2.5 px-4 text-white/40 cursor-not-allowed text-sm font-mono" />
                      </div>
                    )}
                    {user?.stakeholderId && (
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Stakeholder ID</label>
                        <input type="text" value={user.stakeholderId} disabled className="w-full bg-white/5 border border-transparent rounded-xl py-2.5 px-4 text-white/40 cursor-not-allowed text-sm font-mono" />
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${saved ? "bg-[#2ED9A3] text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>
                      {saved ? "✓ Saved" : "Save Changes"}
                    </button>
                  </div>
                </GlassPanel>
              </div>
            )}

            {activeTab === "security" && (
              <div className="flex flex-col gap-5">
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#2ED9A3]" /> Cryptographic Security
                  </h2>
                  <div className="p-4 rounded-xl border border-[#2ED9A3]/25 bg-[#2ED9A3]/5 mb-5">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-[#2ED9A3]" />
                      <div>
                        <p className="text-white font-medium text-sm">Device Enclave Active</p>
                        <p className="text-white/40 text-xs mt-0.5">Private key secured via WebCrypto API. Never leaves this device.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-white/30" />
                        <div>
                          <p className="text-white text-sm font-medium">Current Device</p>
                          <p className="text-white/30 text-xs">Last used: Just now</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#2ED9A3] border border-[#2ED9A3]/30 px-2 py-1 rounded-lg">Active</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/5">
                    <button className="text-[#FF4D6D] text-sm font-medium hover:underline flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Revoke all other devices
                    </button>
                  </div>
                </GlassPanel>
              </div>
            )}

            {activeTab === "notifications" && (
              <GlassPanel className="p-6">
                <h2 className="text-lg font-medium text-white mb-5 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#29F0E0]" /> Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Consent requests", desc: "When a provider requests access to your records", on: true },
                    { label: "Prescription updates", desc: "When a prescription is issued or dispensed", on: true },
                    { label: "AI insights", desc: "Continuity capsule and fraud alerts", on: true },
                    { label: "Record changes", desc: "When records are added or removed from your vault", on: false },
                    { label: "Security alerts", desc: "Unusual login activity or access attempts", on: true },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <div>
                        <p className="text-white text-sm font-medium">{pref.label}</p>
                        <p className="text-white/30 text-xs mt-0.5">{pref.desc}</p>
                      </div>
                      <button className={`w-11 h-6 rounded-full border transition-all relative ${pref.on ? "bg-[#29F0E0]/20 border-[#29F0E0]/40" : "bg-white/5 border-white/10"}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${pref.on ? "left-[calc(100%-22px)] bg-[#29F0E0]" : "left-0.5 bg-white/20"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all">
                    {saved ? "✓ Saved" : "Save Preferences"}
                  </button>
                </div>
              </GlassPanel>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
