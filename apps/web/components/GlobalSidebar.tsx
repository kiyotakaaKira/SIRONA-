"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "../store/useStore";
import {
  Home, Activity, Shield, Pill, Settings,
  Bell, LogOut, User, Building2, Brain,
  ScanBarcode, FileText, Search, ClipboardList
} from "lucide-react";
import Link from "next/link";

type NavLink = { icon: React.ElementType; label: string; href: string };

const ROLE_LINKS: Record<string, NavLink[]> = {
  patient: [
    { icon: Home, label: "Home", href: "/" },
    { icon: User, label: "My Dashboard", href: "/patient-dashboard" },
    { icon: Shield, label: "Health Vault", href: "/vault" },
    { icon: Pill, label: "Prescriptions", href: "/prescriptions" },
    { icon: FileText, label: "Consent", href: "/consent" },
    { icon: Brain, label: "AI Insights", href: "/ai-insights" },
  ],
  hospital: [
    { icon: Home, label: "Home", href: "/" },
    { icon: Building2, label: "Dashboard", href: "/hospital-dashboard" },
    { icon: Search, label: "Search Patients", href: "/search" },
    { icon: ClipboardList, label: "Consent Requests", href: "/requests" },
    { icon: Brain, label: "AI Centre", href: "/ai-dashboard" },
  ],
  pharmacy: [
    { icon: Home, label: "Home", href: "/" },
    { icon: Pill, label: "Dashboard", href: "/pharmacy-dashboard" },
    { icon: ScanBarcode, label: "Scan QR", href: "/scan" },
    { icon: Activity, label: "Dispense", href: "/dispense" },
    { icon: Brain, label: "AI Centre", href: "/ai-dashboard" },
  ],
  insurance: [
    { icon: Home, label: "Home", href: "/" },
    { icon: Shield, label: "Dashboard", href: "/insurance-dashboard" },
    { icon: Brain, label: "AI Centre", href: "/ai-dashboard" },
  ],
};

export function GlobalSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const notifications = useStore(state => state.notifications);
  const [expanded, setExpanded] = useState(false);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    document.cookie = "healthmesh_token=; path=/; max-age=0";
    logout();
    router.push("/log-in");
  };

  const links = ROLE_LINKS[user.role] ?? ROLE_LINKS.patient;

  const roleColor = user.role === "hospital" ? "#3182CE"
    : user.role === "pharmacy" ? "#805AD5"
    : user.role === "insurance" ? "#ED8936"
    : "#38B2AC";

  return (
    <motion.div
      className="h-screen bg-[#0A1628]/90 backdrop-blur-xl border-r border-white/8 flex flex-col justify-between py-6 z-50 fixed left-0 top-0 shadow-2xl"
      animate={{ width: expanded ? 240 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Header */}
      <div className="flex flex-col gap-6 px-4">
        <Link href="/" className="flex items-center gap-3 px-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#38B2AC] to-[#3182CE] p-[1px] shrink-0">
            <div className="w-full h-full bg-[#0A1628] rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#38B2AC]" />
            </div>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap">
                <span className="text-white font-medium tracking-tight text-sm">Sirona AI</span>
                <p className="text-white/30 text-[10px] capitalize">{user.role} Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all text-left ${isActive ? "text-white" : "text-white/45 hover:bg-white/5 hover:text-white"}`}
                style={isActive ? { background: `${roleColor}15` } : {}}
              >
                {React.createElement(Icon as any, { className: `w-5 h-5 shrink-0`, style: isActive ? { color: roleColor } : undefined })}
                <AnimatePresence>
                  {expanded && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-medium">
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 flex flex-col gap-1">
        {/* Notifications */}
        <button
          onClick={() => router.push("/notifications")}
          className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all relative ${pathname === "/notifications" ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5 hover:text-white"}`}
        >
          <div className="relative shrink-0">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E53E3E] text-[9px] font-bold flex items-center justify-center text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-medium">
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Settings */}
        <button
          onClick={() => router.push("/settings")}
          className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all ${pathname === "/settings" ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5 hover:text-white"}`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-medium">
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="h-px bg-white/5 my-1" />

        {/* Logout */}
        <button onClick={handleLogout} className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-[#E53E3E]/60 hover:bg-[#E53E3E]/10 hover:text-[#E53E3E] transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-medium">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
