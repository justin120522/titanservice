"use client";

const steps = [
  {
    number: "01",
    title: "Describe Your Issue",
    description: "Tell us what appliance needs fixing and describe the problem. Our smart system matches you with the right specialist.",
    icon: "📝",
    color: "from-sky-500 to-blue-600",
  },
  {
    number: "02",
    title: "Choose Date & Time",
    description: "Pick a convenient time slot. We offer same-day appointments and flexible scheduling to fit your busy life.",
    icon: "📅",
    color: "from-violet-500 to-purple-600",
  },
  {
    number: "03",
    title: "Track Your Technician",
    description: "Follow your assigned technician in real-time on the map. Get notified when they are en route and arriving.",
    icon: "📍",
    color: "from-orange-500 to-amber-600",
  },
  {
    number: "04",
    title: "Relax & Rate",
    description: "Your appliance is fixed! Pay securely through the app, download your invoice, and leave a review.",
    icon: "⭐",
    color: "from-emerald-500 to-green-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="heading-display text-4xl md:text-5xl mt-3 mb-5">
            Fixed in{" "}
            <span className="gradient-text-warm">Four Simple Steps</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Getting your appliance repaired has never been easier. Our streamlined process gets you from problem to solution fast.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div className="glass-card text-center relative overflow-hidden">
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-5xl font-bold text-white/[0.03] heading-display">
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
