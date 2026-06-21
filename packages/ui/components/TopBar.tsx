"use client";
import React from "react";
import { cn } from "../lib/utils";
import { Search, Bell } from "lucide-react";

export function TopBar({ className }: { className?: string }) {
  return (
    <header className={cn("h-20 flex items-center justify-between px-8 bg-transparent w-full z-40", className)}>
      <div className="flex-1">
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#29F0E0] transition-colors" />
          <input 
            type="text" 
            placeholder="Search network or records..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#29F0E0]/50 focus:bg-white/10 transition-all shadow-[0_0_0px_rgba(41,240,224,0)] focus:shadow-[0_0_15px_rgba(41,240,224,0.15)] backdrop-blur-md"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-white/50 hover:text-white transition-colors hover:scale-110 active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF4D6D] rounded-full shadow-[0_0_8px_rgba(255,77,109,0.8)]" />
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-white group-hover:text-[#29F0E0] transition-colors">John Doe</span>
            <span className="text-xs text-white/40 font-mono">ID: 1111-1111</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
             <span className="text-white/50 text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
