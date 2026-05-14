"use client";

import Link from "next/link";

const roles = [
  {
    value: "customer",
    label: "Customer",
    icon: "🏠",
    desc: "Book appliance repairs, track technicians, and manage your home services.",
    features: ["Book repairs in minutes", "Real-time technician tracking", "Transparent pricing", "Service history & invoices"],
    gradient: "from-sky-400 to-blue-600",
    border: "border-sky-400/30",
    bg: "bg-sky-400/5",
    href: "/signup/customer",
  },
  {
    value: "technician",
    label: "Technician",
    icon: "🔧",
    desc: "Join our network of certified pros. Manage jobs, track earnings, and grow your business.",
    features: ["Flexible schedule", "Competitive earnings", "Job matching system", "Rating & reviews"],
    gradient: "from-amber-400 to-orange-600",
    border: "border-amber-400/30",
    bg: "bg-amber-400/5",
    href: "/signup/technician",
  },
];

export default function SignupPage() {
  return (
    <div className="animate-fade-in-up max-w-lg mx-auto">
      <Link href="/" className="flex items-center gap-3 justify-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">ST</div>
        <span className="text-2xl font-bold tracking-tight">Service<span className="text-primary">Titan</span></span>
      </Link>

      <div className="glass-strong p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="heading-display text-2xl mb-2">Create Your Account</h1>
          <p className="text-text-secondary text-sm">Choose how you want to use ServiceTitan</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <Link
              key={role.value}
              href={role.href}
              className={`block p-5 rounded-xl border ${role.border} ${role.bg} hover:scale-[1.02] transition-all duration-300 group cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-text-primary">{role.label}</h3>
                    <svg className="w-5 h-5 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{role.desc}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {role.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-text-muted">
                        <span className="text-success text-[10px]">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
