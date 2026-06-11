"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in as admin → go straight to dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [session, status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Access denied.");
      return;
    }

    const res = await fetch("/api/auth/session");
    const sess = await res.json();
    if (sess?.user?.role !== "ADMIN") {
      setError("This portal is for clinic staff only.");
      await fetch("/api/auth/signout", { method: "POST" });
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none"/>

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-400 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Staff Access Only
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400"/>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <svg className="text-white" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">MindWell Admin</h1>
                <p className="text-slate-500 text-xs mt-1">Clinic Management Portal</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 text-red-400 rounded-xl p-4 mb-6 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username / Email</label>
                <input
                  type="text" required autoComplete="username"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="admin"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password" required autoComplete="current-password"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Sign In to Portal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo credentials */}
          <div className="px-8 pb-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold mb-2">Demo Credentials</p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div>
                  <span className="text-slate-500 text-xs">ID</span>
                  <p className="text-white font-mono font-semibold">admin</p>
                </div>
                <div className="w-px h-8 bg-slate-700"/>
                <div>
                  <span className="text-slate-500 text-xs">Password</span>
                  <p className="text-white font-mono font-semibold">admin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
            <p className="text-slate-600 text-xs">Authorised personnel only</p>
            <a href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">← Back to site</a>
          </div>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          Patient?{" "}
          <a href="/login" className="text-slate-500 hover:text-slate-300 transition-colors underline">Use patient login</a>
        </p>
      </div>
    </div>
  );
}
