"use client";

import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: 79,
    period: "per visit",
    description: "Perfect for one-time repairs and quick fixes.",
    features: [
      "Single appliance repair",
      "Standard scheduling",
      "Email support",
      "30-day warranty",
      "Digital invoice",
    ],
    cta: "Book Now",
    popular: false,
  },
  {
    name: "Premium",
    price: 149,
    period: "per visit",
    description: "Most popular choice for comprehensive service.",
    features: [
      "Any appliance type",
      "Priority scheduling",
      "24/7 phone support",
      "90-day warranty",
      "Real-time tracking",
      "Detailed diagnostics report",
      "10% off future bookings",
    ],
    cta: "Get Premium",
    popular: true,
  },
  {
    name: "Maintenance",
    price: 49,
    period: "per month",
    description: "Proactive care for all your home appliances.",
    features: [
      "Monthly inspection",
      "2 free repairs/year",
      "Priority response",
      "Annual deep cleaning",
      "Extended warranty",
      "Dedicated technician",
    ],
    cta: "Subscribe",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="heading-display text-4xl md:text-5xl mt-3 mb-5">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            No hidden fees, no surprises. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card ${
                plan.popular ? "scale-105 border-primary/30 shadow-lg shadow-primary/10 ring-1 ring-primary/20" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-text-primary mb-2">{plan.name}</h3>
              <p className="text-text-secondary text-sm mb-6">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-text-primary heading-display">₱{plan.price}</span>
                <span className="text-text-muted text-sm">{plan.period}</span>
              </div>
              <Link href="/signup" className={`btn w-full ${plan.popular ? "btn-primary" : "btn-glass"}`}>
                {plan.cta}
              </Link>
              <div className="divider my-6" />
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                    <svg className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-primary" : "text-success"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
