"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="glass-strong p-12 md:p-16 rounded-3xl">
          <h2 className="heading-display text-4xl md:text-5xl mb-6">
            Ready to Get Your Appliances{" "}
            <span className="gradient-text">Fixed?</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
            Join 50,000+ homeowners who trust ServiceTitan. Book your first repair today and get 20% off with code WELCOME20.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get Started Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="#pricing" className="btn btn-glass btn-lg">
              View Pricing
            </Link>
          </div>
          <p className="text-text-muted text-sm mt-6">No credit card required · Free cancellation · 24/7 support</p>
        </div>
      </div>
    </section>
  );
}
