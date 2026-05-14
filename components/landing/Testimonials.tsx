"use client";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    comment: "ServiceTitan saved my Thanksgiving! My oven broke down the day before, and they had a technician at my door within 2 hours. Absolutely incredible service.",
    initials: "SJ",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Michael Chen",
    role: "Property Manager",
    rating: 5,
    comment: "I manage 40+ rental units and ServiceTitan has been a game-changer. The dashboard lets me track all repairs across properties. Highly recommended!",
    initials: "MC",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Homeowner",
    rating: 5,
    comment: "The real-time tracking feature is amazing. I could see exactly when the technician was arriving. The repair was quick, professional, and fairly priced.",
    initials: "ER",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "David Park",
    role: "Restaurant Owner",
    rating: 5,
    comment: "Our commercial refrigerator went down and ServiceTitan had it fixed the same day. Their technicians really know their stuff. Five stars!",
    initials: "DP",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    name: "Lisa Thompson",
    role: "Homeowner",
    rating: 4,
    comment: "Great experience from start to finish. The booking process was smooth, pricing was transparent, and the technician was very knowledgeable.",
    initials: "LT",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    name: "James Wilson",
    role: "Real Estate Agent",
    rating: 5,
    comment: "I recommend ServiceTitan to all my clients. The quality of service is consistently excellent and the pricing is very competitive.",
    initials: "JW",
    gradient: "from-red-500 to-rose-600",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="heading-display text-4xl md:text-5xl mt-3 mb-5">
            Loved by <span className="gradient-text-warm">Thousands</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Real reviews from real customers who trust ServiceTitan for their appliance needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card group">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className={`w-4 h-4 ${j < t.rating ? "text-warning" : "text-white/10"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
