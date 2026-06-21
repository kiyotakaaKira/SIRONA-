"use client";
import React, { useState } from "react";
import { GlassPanel } from "@healthmesh/ui";
import { useRouter } from "next/navigation";
import { useStore } from "../../../store/useStore";
import { Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "hospital" | "pharmacy" | "insurance">("patient");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1200));

      if (password.length < 4) {
        throw new Error("Password must be at least 4 characters.");
      }

      // Mock Login
      login(email);

      // Set cookie to simulate session
      document.cookie = `healthmesh_token=${role}; path=/; max-age=86400`;

      toast.success("Profile initialized successfully.");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassPanel accentColor="cyan" className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#29F0E0] to-[#2E6FFF] shadow-[0_0_20px_rgba(41,240,224,0.3)] mb-4 flex items-center justify-center">
            <Shield className="text-black w-6 h-6" />
          </div>
          <h1 className="text-2xl font-medium text-white">Join Network</h1>
          <p className="text-white/50 text-sm mt-1">Register your cryptographic identity.</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 block">Account Type</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#29F0E0]/50 transition-colors"
            >
              <option value="patient">Patient (Vault Owner)</option>
              <option value="hospital">Hospital / Provider</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="insurance">Insurance Payer</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 block">Full Name / Entity Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#29F0E0]/50 transition-colors"
              required
              placeholder="e.g. John Doe or Apollo Hospital"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#29F0E0]/50 transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#29F0E0]/50 transition-colors"
              required
            />
          </div>

          {error && <p className="text-[#FF4D6D] text-sm">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-[#29F0E0] to-[#2E6FFF] text-black font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(41,240,224,0.2)] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Initialize Profile"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/40">
            Already registered? <Link href="/log-in" className="text-[#29F0E0] hover:underline">Access network.</Link>
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}
