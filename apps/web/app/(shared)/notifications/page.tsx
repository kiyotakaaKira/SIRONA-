"use client";
import React from "react";
import { GlassPanel, motionVariants } from "@healthmesh/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Activity, Pill, Shield, Clock, FileText, CheckCheck, Trash2 } from "lucide-react";
import { useStore } from "../../../store/useStore";

const TYPE_CONFIG = {
  prescription: { icon: Pill, color: "text-[#2ED9A3]", bg: "bg-[#2ED9A3]/10" },
  record: { icon: FileText, color: "text-[#29F0E0]", bg: "bg-[#29F0E0]/10" },
  consent: { icon: Shield, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  ai: { icon: Activity, color: "text-[#2E6FFF]", bg: "bg-[#2E6FFF]/10" },
  system: { icon: Bell, color: "text-white/60", bg: "bg-white/10" },
};

export default function NotificationsPage() {
  const notifications = useStore(state => state.notifications);
  const user = useStore(state => state.user);
  const markNotificationRead = useStore(state => state.markNotificationRead);
  const markAllNotificationsRead = useStore(state => state.markAllNotificationsRead);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 md:p-10 max-w-[800px] mx-auto min-h-screen">
      <header className="mb-8 flex justify-between items-end">
        <motion.div initial="initial" animate="animate" variants={motionVariants.staggerContainer}>
          <motion.p variants={motionVariants.resolveIn} className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#29F0E0]/80 mb-2">
            {user?.name ?? "Activity Feed"}
          </motion.p>
          <motion.h1 variants={motionVariants.resolveIn} className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-[#29F0E0]/10 border border-[#29F0E0]/30 text-[#29F0E0]">
                {unreadCount} new
              </span>
            )}
          </motion.h1>
        </motion.div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </header>

      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <GlassPanel className="p-10 flex flex-col items-center gap-3 text-white/30">
              <Bell className="w-8 h-8" />
              <p className="text-sm">No notifications yet</p>
            </GlassPanel>
          ) : notifications.map((item, i) => {
            const tc = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system;
            const Icon = tc.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  className={`w-full text-left transition-all rounded-xl border ${item.read ? "border-white/5 hover:border-white/10 hover:bg-white/[0.02]" : "border-[#29F0E0]/20 bg-[#29F0E0]/[0.03]"}`}
                  onClick={() => markNotificationRead(item.id)}
                >
                  <GlassPanel className={`p-5 flex items-start gap-4 !p-0 !border-0 !shadow-none`}>
                    <div className="p-5 flex items-start gap-4 w-full">
                      <div className={`p-3 rounded-xl ${tc.bg} shrink-0 relative`}>
                        <Icon className={`w-5 h-5 ${tc.color}`} />
                        {!item.read && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#29F0E0] border-2 border-[#0A0A0A]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${item.read ? "text-white/70" : "text-white"}`}>{item.title}</h4>
                        <p className="text-sm text-white/40 mt-0.5 leading-relaxed">{item.description}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-white/25 font-mono">
                          <Clock className="w-3 h-3" /> {item.time}
                        </div>
                      </div>
                      {!item.read && (
                        <div className="w-2 h-2 rounded-full bg-[#29F0E0] mt-1 shrink-0" />
                      )}
                    </div>
                  </GlassPanel>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
