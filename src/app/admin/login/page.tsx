"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setIsLoading(false);
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    } else {
      setIsLoading(false);
    }
  };

  return (
    <main data-header-surface="dark" className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-8">
        <header className="space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
            AFTAZA_Internal
          </p>
          <h1 className="text-2xl font-display font-black uppercase tracking-tight">
            Admin Access
          </h1>
          <p className="text-xs text-slate-400">
            Restricted console for publishing and governing insights.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:border-[#c8a34d] focus:ring-1 focus:ring-[#c8a34d] placeholder:text-slate-500"
              placeholder="admin@aftaza.internal"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:border-[#c8a34d] focus:ring-1 focus:ring-[#c8a34d] placeholder:text-slate-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-medium">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#c8a34d] text-slate-950 hover:bg-[#e4c56a] text-[10px] font-black uppercase tracking-[0.25em] py-3"
          >
            {isLoading && <Loader2 className="animate-spin" size={14} />}
            {isLoading ? "Verifying" : "Enter Console"}
          </Button>
        </form>

        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest text-center">
          Authorized Personnel Only
        </p>
      </div>
    </main>
  );
}
