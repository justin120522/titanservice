"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How quickly can a technician arrive?",
    answer: "For standard bookings, technicians typically arrive within 2-4 hours. For emergency services, we guarantee arrival within 60 minutes in most service areas. You can track your technician in real-time once they're dispatched.",
  },
  {
    question: "What appliances do you service?",
    answer: "We service all major home appliances including refrigerators, washers, dryers, dishwashers, ovens, stoves, microwaves, HVAC systems, water heaters, and garbage disposals. We also handle commercial appliances for businesses.",
  },
  {
    question: "Are your technicians certified?",
    answer: "Yes! Every technician on our platform undergoes rigorous background checks, holds relevant industry certifications (EPA, NATE, etc.), and maintains a minimum 4.5-star rating. We continuously monitor quality through customer reviews.",
  },
  {
    question: "What if the repair doesn't fix the issue?",
    answer: "All repairs come with a warranty — 30 days for Basic, 90 days for Premium. If the same issue recurs within the warranty period, we'll send a technician back at no additional cost. Your satisfaction is guaranteed.",
  },
  {
    question: "How does pricing work?",
    answer: "We provide upfront, transparent pricing before you confirm your booking. The price includes the service call, diagnosis, labor, and standard parts. If additional parts are needed, your technician will provide a quote for approval before proceeding.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer: "Absolutely! You can cancel or reschedule for free up to 2 hours before your appointment. Cancellations within 2 hours may incur a small fee. Just go to your dashboard or contact our support team.",
  },
  {
    question: "Do you offer maintenance plans?",
    answer: "Yes! Our monthly maintenance plan at ₱49/month includes regular inspections, priority scheduling, 2 free repairs per year, and extended warranties. It's the best way to keep your appliances running smoothly and prevent costly breakdowns.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="heading-display text-4xl md:text-5xl mt-3 mb-5">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Everything you need to know about ServiceTitan.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass-card cursor-pointer transition-all duration-300 ${
                openIndex === index ? "border-primary/20" : ""
              }`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-medium text-text-primary">{faq.question}</h3>
                <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-45" : ""}`}>
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-text-secondary text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
