"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        password: form.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }

    // Auto sign in
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MindWell Psychological Clinic" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join MindWell to book and manage appointments</p>
        </div>

        {error && (
          <div className="alert alert-error mb-6 text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name *</label>
              <input className="form-control" type="text" required placeholder="Jane" value={form.firstName} onChange={update("firstName")}/>
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input className="form-control" type="text" required placeholder="Smith" value={form.lastName} onChange={update("lastName")}/>
            </div>
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <input className="form-control" type="email" required placeholder="jane@email.com" value={form.email} onChange={update("email")}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input className="form-control" type="tel" placeholder="(212) 555-0100" value={form.phone} onChange={update("phone")}/>
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <input className="form-control" type="date" value={form.dateOfBirth} onChange={update("dateOfBirth")}/>
            </div>
          </div>
          <div>
            <label className="form-label">Password * <span className="text-slate-400 font-normal">(min. 8 characters)</span></label>
            <input className="form-control" type="password" required minLength={8} placeholder="••••••••" value={form.password} onChange={update("password")}/>
          </div>
          <div>
            <label className="form-label">Confirm Password *</label>
            <input className="form-control" type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={update("confirmPassword")}/>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>{" "}
            and consent to the collection of your health information for appointment management.
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}
