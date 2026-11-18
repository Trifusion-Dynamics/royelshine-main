"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Invalid administrator credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <Image
            src="/images/Royal-Shine-Logo.png"
            alt="Royal Shine Logo"
            fill
            sizes="64px"
            className="object-contain invert brightness-200"
            priority
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A265] font-semibold block">
          Restricted Portal
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] mt-1">
          Royal Shine Administration
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Secure access for authorized catalogue & concierge administrators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#1A1A1A] py-8 px-6 sm:px-10 border border-zinc-800 rounded-sm shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@royalshine.com"
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C5A265] transition-colors"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                Master Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#141414] border border-zinc-700 rounded-sm py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C5A265] transition-colors"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C5A265] hover:bg-[#AA874C] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>{loading ? "Authenticating..." : "Authorize Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-[#C5A265]" />
              <span>TLS 1.3 256-bit Encrypted Admin Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
