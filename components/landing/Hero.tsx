"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-glow-primary">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="stagger-item animate-fade-in-up inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-text-secondary">
                Trusted by 50,000+ homeowners
              </span>
            </div>

            {/* Heading */}
            <h1 className="stagger-item animate-fade-in-up delay-100 heading-display text-5xl md:text-6xl lg:text-7xl mb-6">
              Expert Repairs,{" "}
              <span className="gradient-text">Delivered Fast</span>
            </h1>

            {/* Subtitle */}
            <p className="stagger-item animate-fade-in-up delay-200 text-lg md:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Book certified appliance technicians in minutes. Real-time tracking,
              transparent pricing, and guaranteed satisfaction.
            </p>

            {/* CTA Buttons */}
            <div className="stagger-item animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="btn btn-primary btn-lg group">
                Book a Repair
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="#how-it-works" className="btn btn-glass btn-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </Link>
            </div>

            {/* Social Proof */}
            <div className="stagger-item animate-fade-in-up delay-400 mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[
                  "bg-gradient-to-br from-sky-400 to-blue-600",
                  "bg-gradient-to-br from-orange-400 to-red-500",
                  "bg-gradient-to-br from-green-400 to-emerald-600",
                  "bg-gradient-to-br from-purple-400 to-violet-600",
                  "bg-gradient-to-br from-pink-400 to-rose-600",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${bg} border-2 border-bg flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {["JD", "AK", "MR", "TS", "LW"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-text-secondary">
                  <span className="text-text-primary font-semibold">4.9/5</span> from 12K+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              {/* Floating Cards */}
              <div className="absolute top-0 right-0 glass-card p-6 w-64 animate-float stagger-item animate-fade-in-up delay-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">15min</p>
                    <p className="text-xs text-text-secondary">Avg. Response Time</p>
                  </div>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-primary to-primary-light rounded-full" />
                </div>
              </div>

              <div className="absolute top-36 left-0 glass-card p-6 w-72 animate-float stagger-item animate-fade-in-up delay-400" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">98.5%</p>
                    <p className="text-xs text-text-secondary">Satisfaction Rate</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[85, 92, 78, 95, 88, 90, 96].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-full overflow-hidden h-16 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-success/60 to-success/20 rounded-full transition-all duration-500"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-8 right-8 glass-card p-6 w-60 animate-float stagger-item animate-fade-in-up delay-600" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl">
                    🔧
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">150K+</p>
                    <p className="text-xs text-text-secondary">Jobs Completed</p>
                  </div>
                </div>
                <p className="text-xs text-success flex items-center gap-1 mt-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +23% this month
                </p>
              </div>

              {/* Decorative ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/[0.03] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
