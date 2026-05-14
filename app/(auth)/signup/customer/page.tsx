"use client";

import { useState } from "react";
import Link from "next/link";
import { saveUser } from "@/lib/auth";

export default function CustomerSignupPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));
  const pwStr = () => { const p = form.password; let s = 0; if(p.length>=8) s++; if(/[A-Z]/.test(p)) s++; if(/[0-9]/.test(p)) s++; if(/[^A-Za-z0-9]/.test(p)) s++; return s; };
  const strLbl = ["","Weak","Fair","Good","Strong"];
  const strClr = ["","bg-danger","bg-warning","bg-primary","bg-success"];
  const match = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const valid = form.firstName && form.email && form.password.length >= 8 && match && agreed;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          role: "customer",
          phone: form.phone,
          address: form.address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        saveUser(data.data.user);
        window.location.href = data.data.redirect;
      } else {
        setError(data.error || "Registration failed");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto">
      <Link href="/" className="flex items-center gap-3 justify-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">ST</div>
        <span className="text-2xl font-bold tracking-tight">Service<span className="text-primary">Titan</span></span>
      </Link>
      <div className="glass-strong p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/signup" className="btn btn-glass btn-icon w-9 h-9"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7"/></svg></Link>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm">🏠</div>
              <h1 className="heading-display text-xl">Customer Registration</h1>
            </div>
            <p className="text-text-secondary text-xs mt-0.5">Create your account to book repairs</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button className="btn btn-glass text-sm py-3"><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Google</button>
          <button className="btn btn-glass text-sm py-3"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.12-.098.246-.198.373-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.03z"/></svg>Discord</button>
        </div>
        <div className="flex items-center gap-4 mb-5"><div className="flex-1 divider"/><span className="text-text-muted text-xs uppercase tracking-wider">or</span><div className="flex-1 divider"/></div>

        {error && (
          <div className="mb-5 flex items-center gap-3 py-3 px-4 rounded-lg bg-danger/5 border border-danger/20">
            <span className="text-danger text-sm">⚠</span>
            <span className="text-sm text-danger">{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-text-secondary mb-2">First Name *</label><input type="text" value={form.firstName} onChange={e=>update("firstName",e.target.value)} className="glass-input" placeholder="John" required/></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label><input type="text" value={form.lastName} onChange={e=>update("lastName",e.target.value)} className="glass-input" placeholder="Doe"/></div>
          </div>
          <div><label className="block text-sm font-medium text-text-secondary mb-2">Email *</label><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} className="glass-input" placeholder="john@example.com" required/></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-2">Phone</label><input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} className="glass-input" placeholder="+1 (555) 123-4567"/></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-2">Home Address</label><input type="text" value={form.address} onChange={e=>update("address",e.target.value)} className="glass-input" placeholder="123 Main St, New York, NY"/></div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password *</label>
            <div className="relative">
              <input type={showPw?"text":"password"} value={form.password} onChange={e=>update("password",e.target.value)} className="glass-input pr-12" placeholder="Min. 8 characters" required minLength={8}/>
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>
            </div>
            {form.password && <div className="mt-2"><div className="flex gap-1 mb-1">{[1,2,3,4].map(i=>(<div key={i} className={`flex-1 h-1 rounded-full ${i<=pwStr()?strClr[pwStr()]:"bg-white/10"}`}/>))}</div><p className={`text-xs ${pwStr()>=3?"text-success":pwStr()>=2?"text-warning":"text-danger"}`}>{strLbl[pwStr()]}</p></div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password *</label>
            <input type="password" value={form.confirmPassword} onChange={e=>update("confirmPassword",e.target.value)} className="glass-input" placeholder="Re-enter password" required/>
            {form.confirmPassword && <p className={`text-xs mt-1 ${match?"text-success":"text-danger"}`}>{match?"✓ Passwords match":"✗ Passwords do not match"}</p>}
          </div>
          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"/>
            <span className="text-sm text-text-secondary">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
          </label>
          <button type="submit" disabled={loading||!valid} className="btn btn-primary w-full btn-lg disabled:opacity-40 disabled:cursor-not-allowed">
            {loading?<div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Creating...</div>:"Create Customer Account"}
          </button>
        </form>
        <p className="text-center text-sm text-text-secondary mt-6">Already have an account? <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">Sign in</Link></p>
      </div>
    </div>
  );
}
