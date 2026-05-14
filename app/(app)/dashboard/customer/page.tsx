"use client";

import Link from "next/link";
import { useCurrentUser, getGreeting } from "@/lib/auth";

const stats = [
  { label: "Total Bookings", value: "24", change: "+3 this week", icon: "📋", color: "from-sky-500/20 to-blue-600/20", border: "border-sky-500/20" },
  { label: "Completed", value: "18", change: "75% completion", icon: "✅", color: "from-emerald-500/20 to-green-600/20", border: "border-emerald-500/20" },
  { label: "Pending", value: "4", change: "2 scheduled today", icon: "⏳", color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/20" },
  { label: "Total Spent", value: "₱2,340", change: "+₱149 this month", icon: "💳", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/20" },
];

const recentBookings = [
  { id: "BK-001", appliance: "Refrigerator", type: "Repair", date: "Apr 28, 2026", status: "en_route", tech: "Mike J.", price: 149 },
  { id: "BK-002", appliance: "Washer", type: "Maintenance", date: "Apr 25, 2026", status: "completed", tech: "Sarah L.", price: 89 },
  { id: "BK-003", appliance: "HVAC System", type: "Inspection", date: "Apr 22, 2026", status: "completed", tech: "Tom K.", price: 129 },
  { id: "BK-004", appliance: "Dishwasher", type: "Repair", date: "Apr 20, 2026", status: "completed", tech: "Mike J.", price: 99 },
  { id: "BK-005", appliance: "Oven", type: "Installation", date: "Apr 30, 2026", status: "pending", tech: "Unassigned", price: 199 },
];

const statusStyles: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  matched: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  en_route: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function CustomerDashboard() {
  const { user } = useCurrentUser();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="heading-display text-3xl md:text-4xl mb-2">
          {getGreeting()}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-text-secondary">Here&apos;s what&apos;s happening with your services.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="text-xs text-success mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Active Booking Highlight */}
      <div className="glass-card border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge text-blue-400 bg-blue-400/10 border-blue-400/20">En Route</span>
              <span className="text-xs text-text-muted">BK-001</span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">Refrigerator Repair</h3>
            <p className="text-text-secondary text-sm mb-3">Mike Johnson is on his way · ETA 15 minutes</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">MJ</div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Mike Johnson</p>
                  <p className="text-xs text-text-muted">4.9 ⭐ · 234 jobs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-glass btn-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Track
            </button>
            <button className="btn btn-primary btn-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Recent Bookings + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bookings Table */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Recent Bookings</h2>
            <Link href="/dashboard/customer/bookings" className="text-sm text-primary hover:text-primary-light transition-colors">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Appliance</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono text-xs text-text-muted">{b.id}</td>
                    <td>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{b.appliance}</p>
                        <p className="text-xs text-text-muted">{b.type}</p>
                      </div>
                    </td>
                    <td className="text-sm text-text-secondary">{b.date}</td>
                    <td>
                      <span className={`badge ${statusStyles[b.status] || ""}`}>
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-sm font-medium text-text-primary">₱{b.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-5">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/customer/book-service" className="btn btn-primary w-full">
                <span>📅</span> Book New Service
              </Link>
              <Link href="/dashboard/customer/bookings" className="btn btn-glass w-full">
                <span>📋</span> View All Bookings
              </Link>
              <Link href="/dashboard/customer/profile" className="btn btn-glass w-full">
                <span>👤</span> Edit Profile
              </Link>
            </div>
          </div>

          {/* Upcoming */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Upcoming</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-lg">🔥</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">Oven Installation</p>
                  <p className="text-xs text-text-muted">Apr 30 · 10:00 AM</p>
                </div>
                <span className="badge text-amber-400 bg-amber-400/10 border-amber-400/20 text-[10px]">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
