"use client";

import { useState } from "react";
import Link from "next/link";
import { saveUser } from "@/lib/auth";

const roles = [
  { value: "customer", label: "Customer", icon: "🏠", desc: "Book & manage repairs", gradient: "from-sky-400 to-blue-600", border: "border-sky-400/30", bg: "bg-sky-400/5" },
  { value: "technician", label: "Technician", icon: "🔧", desc: "Manage jobs & earnings", gradient: "from-amber-400 to-orange-600", border: "border-amber-400/30", bg: "bg-amber-400/5" },
  { value: "admin", label: "Admin", icon: "🛡️", desc: "Platform management", gradient: "from-rose-400 to-red-600", border: "border-rose-400/30", bg: "bg-rose-400/5" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select a role first"); return; }
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();

      if (data.success) {
        saveUser(data.data.user);
        window.location.href = data.data.redirect;
      } else {
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const roleData = selectedRole ? roles.find((r) => r.value === selectedRole) : null;

  return (
    <div className="animate-fade-in-up">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 justify-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
          ST
        </div>
        <span className="text-2xl font-bold tracking-tight">
          Service<span className="text-primary">Titan</span>
        </span>
      </Link>

      <div className="glass-strong p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="heading-display text-2xl mb-2">Welcome Back</h1>
          <p className="text-text-secondary text-sm">Select your role and sign in to continue</p>
        </div>

        {/* Role Selection Cards */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-3">I am a...</label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => { setSelectedRole(role.value); setError(""); }}
                className={`relative p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer group ${
                  selectedRole === role.value
                    ? `${role.border} ${role.bg} scale-[1.02]`
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                }`}
              >
                {selectedRole === role.value && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-success flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                )}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.gradient} flex items-center justify-center text-lg mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  {role.icon}
                </div>
                <p className="text-sm font-semibold text-text-primary">{role.label}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{role.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Role Indicator */}
        {roleData && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${roleData.bg} border ${roleData.border} mb-5 transition-all duration-300`}>
            <span className="text-sm">{roleData.icon}</span>
            <span className="text-xs font-medium text-text-primary">Signing in as <strong>{roleData.label}</strong></span>
          </div>
        )}

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button className="btn btn-glass text-sm py-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className="btn btn-glass text-sm py-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
            </svg>
            Discord
          </button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 divider" />
          <span className="text-text-muted text-xs uppercase tracking-wider">or</span>
          <div className="flex-1 divider" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card border-danger/20 bg-danger/5 mb-5 flex items-center gap-3 py-3 px-4">
            <span className="text-danger text-sm">⚠</span>
            <span className="text-sm text-danger">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:text-primary-light transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedRole}
            className={`w-full btn btn-lg relative overflow-hidden transition-all ${
              !selectedRole
                ? "glass text-text-muted cursor-not-allowed opacity-50"
                : roleData?.value === "admin"
                ? "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-500/20"
                : roleData?.value === "technician"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20"
                : "btn-primary"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : !selectedRole ? (
              "Select a role to continue"
            ) : (
              <>
                Sign In as {roleData?.label}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary-light font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
