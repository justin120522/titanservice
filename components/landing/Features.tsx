"use client";

const features = [
  {
    icon: "⚡",
    title: "Instant Booking",
    description: "Book a certified technician in under 2 minutes with our streamlined booking wizard.",
    gradient: "from-sky-500/20 to-blue-600/20",
    border: "border-sky-500/20",
    span: "col-span-1",
  },
  {
    icon: "📍",
    title: "Real-Time Tracking",
    description: "Track your technician&apos;s location in real-time. Know exactly when they&apos;ll arrive at your door.",
    gradient: "from-emerald-500/20 to-green-600/20",
    border: "border-emerald-500/20",
    span: "col-span-1",
  },
  {
    icon: "🛡️",
    title: "Verified Professionals",
    description: "Every technician is background-checked, certified, and rated by real customers.",
    gradient: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/20",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: "💳",
    title: "Transparent Pricing",
    description: "No hidden fees. Get upfront pricing before you book. Pay securely through our platform with Stripe integration.",
    gradient: "from-orange-500/20 to-amber-600/20",
    border: "border-orange-500/20",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: "📊",
    title: "Smart Dashboard",
    description: "Manage bookings, track spending, view history, and rate technicians — all from one beautiful dashboard.",
    gradient: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/20",
    span: "col-span-1",
  },
  {
    icon: "🔔",
    title: "Instant Notifications",
    description: "Get real-time updates via push, email, and SMS at every stage of your service.",
    gradient: "from-cyan-500/20 to-teal-600/20",
    border: "border-cyan-500/20",
    span: "col-span-1",
  },
  {
    icon: "⭐",
    title: "Quality Guaranteed",
    description: "90-day warranty on all repairs. If it breaks again, we fix it free.",
    gradient: "from-yellow-500/20 to-amber-600/20",
    border: "border-yellow-500/20",
    span: "col-span-1",
  },
  {
    icon: "🕐",
    title: "24/7 Support",
    description: "Emergency repairs available around the clock. We&apos;re always here when you need us.",
    gradient: "from-red-500/20 to-rose-600/20",
    border: "border-red-500/20",
    span: "col-span-1",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Features
          </span>
          <h2 className="heading-display text-4xl md:text-5xl mt-3 mb-5">
            Everything You Need,{" "}
            <span className="gradient-text">One Platform</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From booking to payment, we handle every step of your appliance service experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`${feature.span} glass-card group cursor-default`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.border} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
