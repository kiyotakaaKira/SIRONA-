"use client";
import React, { useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { Search, User, ArrowRight, Lock, Brain, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_DB: Record<string, any> = {
  "1111-1111": {
    name: "John Doe",
    id: "1111-1111",
    dob: "1984-05-12",
    bloodType: "O Positive",
    allergies: ["Penicillin"],
    records: 12,
    consentStatus: "none",
  },
  "1234-5678": {
    name: "Jane Smith",
    id: "1234-5678",
    dob: "1990-11-22",
    bloodType: "A Negative",
    allergies: ["Peanuts"],
    records: 5,
    consentStatus: "active",
  },
  "4444-5555": {
    name: "Michael Johnson",
    id: "4444-5555",
    dob: "1975-03-14",
    bloodType: "B Positive",
    allergies: ["Latex"],
    records: 24,
    consentStatus: "none",
  },
  "9999-8888": {
    name: "Sarah Williams",
    id: "9999-8888",
    dob: "1988-09-30",
    bloodType: "O Negative",
    allergies: ["None"],
    records: 8,
    consentStatus: "none",
  },
  "5555-4444": {
    name: "Emily Chen",
    id: "5555-4444",
    dob: "1995-07-08",
    bloodType: "AB Positive",
    allergies: ["Shellfish", "Amoxicillin"],
    records: 15,
    consentStatus: "active",
  },
  "7777-6666": {
    name: "Marcus Thorne",
    id: "7777-6666",
    dob: "1962-12-01",
    bloodType: "O Positive",
    allergies: ["Dust Mites"],
    records: 42,
    consentStatus: "active",
  },
  "3333-2222": {
    name: "Olivia Reed",
    id: "3333-2222",
    dob: "2001-02-19",
    bloodType: "A Positive",
    allergies: ["None"],
    records: 3,
    consentStatus: "none",
  }
};

export default function SearchPatientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setSearched(true);
      if (MOCK_DB[searchQuery]) {
        setResult(MOCK_DB[searchQuery]);
      } else {
        setResult(null);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-light tracking-tight text-white mb-2">Patient Directory</h1>
        <p className="text-white/50 text-lg">Query the cryptographic registry by Medical ID.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <GlassPanel accentColor="blue" className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Enter Patient ID (e.g., 1111-1111)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#2E6FFF]/50 transition-colors font-mono"
                />
              </div>
              <button 
                type="submit"
                className="px-8 bg-[#2E6FFF] text-white font-medium rounded-xl hover:bg-[#2E6FFF]/90 shadow-[0_0_20px_rgba(46,111,255,0.3)] transition-all flex items-center gap-2"
              >
                Query <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </GlassPanel>

          <AnimatePresence mode="wait">
             {searched && !result && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <GlassPanel className="p-10 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                   <User className="w-12 h-12 text-white/20 mb-4" />
                   <h3 className="text-white font-medium text-lg">No Patient Found</h3>
                   <p className="text-white/40 text-sm mt-2 max-w-md">The ID provided does not match any registered patients in the cryptographic registry. Check the ID and try again.</p>
                 </GlassPanel>
               </motion.div>
             )}

             {searched && result && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <GlassPanel accentColor={result.consentStatus === 'active' ? 'green' : 'amber'} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="w-24 h-24 rounded-full bg-[#2E6FFF]/10 border-2 border-[#2E6FFF]/30 flex flex-col items-center justify-center shrink-0">
                         <span className="text-2xl text-white font-medium">{result.name.split(' ').map((n:string) => n[0]).join('')}</span>
                       </div>
                       
                       <div className="flex-1">
                         <div className="flex justify-between items-start mb-4">
                           <div>
                             <h2 className="text-2xl text-white font-medium">{result.name}</h2>
                             <p className="text-[#2E6FFF] font-mono text-sm mt-1">{result.id}</p>
                           </div>
                           {result.consentStatus === 'active' ? (
                             <span className="px-3 py-1 rounded-full bg-[#2ED9A3]/10 text-[#2ED9A3] border border-[#2ED9A3]/30 text-xs font-medium flex items-center gap-1">
                               <CheckCircle2 className="w-3.5 h-3.5" /> Access Granted
                             </span>
                           ) : (
                             <span className="px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-xs font-medium flex items-center gap-1">
                               <Lock className="w-3.5 h-3.5" /> Vault Locked
                             </span>
                           )}
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                           <div>
                             <p className="text-[10px] uppercase text-white/40 tracking-wider">DOB</p>
                             <p className="text-sm text-white font-mono">{result.dob}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase text-white/40 tracking-wider">Blood Type</p>
                             <p className="text-sm text-white">{result.bloodType}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase text-white/40 tracking-wider">Known Allergies</p>
                             <p className="text-sm text-[#FF4D6D] font-medium">{result.allergies.join(', ')}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase text-white/40 tracking-wider">Stored Records</p>
                             <p className="text-sm text-white">{result.records} Encrypted</p>
                           </div>
                         </div>

                         <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                           {result.consentStatus === 'active' ? (
                             <>
                               <button onClick={() => router.push(`/patient/${result.id}`)} className="flex-1 py-2.5 bg-[#2ED9A3] text-black font-medium rounded-lg text-sm hover:opacity-90 flex items-center justify-center gap-2">
                                 <FileText className="w-4 h-4" /> View Medical Chart
                               </button>
                               <button className="flex-1 py-2.5 bg-[#29F0E0]/10 text-[#29F0E0] border border-[#29F0E0]/30 font-medium rounded-lg text-sm hover:bg-[#29F0E0]/20 flex items-center justify-center gap-2">
                                 <Brain className="w-4 h-4" /> AI Continuity Capsule
                               </button>
                             </>
                           ) : (
                             <>
                               <button onClick={() => router.push('/requests')} className="flex-1 py-2.5 bg-[#F59E0B] text-black font-medium rounded-lg text-sm hover:opacity-90 flex items-center justify-center gap-2">
                                 <Lock className="w-4 h-4" /> Request Vault Access
                               </button>
                               <button onClick={() => router.push('/break-glass')} className="flex-1 py-2.5 bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/30 font-medium rounded-lg text-sm hover:bg-[#FF4D6D]/20 flex items-center justify-center gap-2">
                                 <ShieldAlert className="w-4 h-4" /> Trigger Break-Glass
                               </button>
                             </>
                           )}
                         </div>
                       </div>
                    </div>
                  </GlassPanel>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
           <GlassPanel className="p-0 overflow-hidden">
             <div className="p-4 border-b border-white/5 bg-white/[0.02]">
               <h3 className="text-sm font-medium text-white">Recently Accessed Patients</h3>
             </div>
             <div className="divide-y divide-white/5">
                {[
                  { name: "Emily Chen", id: "5555-4444", time: "10 mins ago", active: true },
                  { name: "Jane Smith", id: "1234-5678", time: "2 hours ago", active: true },
                  { name: "Marcus Thorne", id: "7777-6666", time: "5 hours ago", active: true },
                  { name: "Michael Johnson", id: "4444-5555", time: "1 day ago", active: false },
                  { name: "Sarah Williams", id: "9999-8888", time: "3 days ago", active: false },
                  { name: "Olivia Reed", id: "3333-2222", time: "1 week ago", active: false },
                  { name: "Alice Baker", id: "1111-2222", time: "1 week ago", active: true },
                  { name: "Robert Brown", id: "2222-3333", time: "2 weeks ago", active: false },
                  { name: "Linda Davis", id: "8888-9999", time: "2 weeks ago", active: true },
                  { name: "David Wilson", id: "6666-7777", time: "3 weeks ago", active: true },
                  { name: "Sophia Martinez", id: "1010-2020", time: "1 month ago", active: false },
                ].map((p, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer" onClick={() => { setSearchQuery(p.id); handleSearch({preventDefault: ()=>{}} as any); }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2E6FFF]/10 flex items-center justify-center text-[#2E6FFF] font-medium text-xs">
                        {p.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-white/40 text-xs font-mono">{p.id}</p>
                      </div>
                    </div>
                    {p.active ? (
                      <span className="text-[10px] text-[#2ED9A3] border border-[#2ED9A3]/30 bg-[#2ED9A3]/10 px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-[10px] text-white/30 border border-white/10 px-2 py-0.5 rounded">Expired</span>
                    )}
                  </div>
                ))}
             </div>
           </GlassPanel>
        </div>
      </div>
    </div>
  );
}
