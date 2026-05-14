"use client";

import { useCurrentUser, getGreeting } from "@/lib/auth";

const platformStats = [
  { label: "Total Users", value: "12,458", change: "+342 this month", icon: "👥", color: "from-sky-500/20 to-blue-600/20", border: "border-sky-500/20" },
  { label: "Total Bookings", value: "8,234", change: "+156 this week", icon: "📋", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/20" },
  { label: "Revenue", value: "₱234.5K", change: "+18% this month", icon: "💰", color: "from-emerald-500/20 to-green-600/20", border: "border-emerald-500/20" },
  { label: "Active Jobs", value: "47", change: "12 en route", icon: "🔧", color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/20" },
];

const monthlyRevenue = [
  { month: "Jan", value: 18500 }, { month: "Feb", value: 22300 }, { month: "Mar", value: 19800 },
  { month: "Apr", value: 24100 }, { month: "May", value: 21700 }, { month: "Jun", value: 26400 },
  { month: "Jul", value: 23800 }, { month: "Aug", value: 28900 }, { month: "Sep", value: 25600 },
  { month: "Oct", value: 30200 }, { month: "Nov", value: 27800 }, { month: "Dec", value: 34500 },
];

const topTechnicians = [
  { name: "Mike Johnson", jobs: 234, rating: 4.9, earned: "₱18,450", initials: "MJ", gradient: "from-sky-400 to-blue-600" },
  { name: "Sarah Lee", jobs: 198, rating: 4.8, earned: "₱15,320", initials: "SL", gradient: "from-pink-400 to-rose-600" },
  { name: "Tom Kim", jobs: 176, rating: 4.9, earned: "₱14,100", initials: "TK", gradient: "from-emerald-400 to-green-600" },
  { name: "Ana Garcia", jobs: 152, rating: 4.7, earned: "₱12,800", initials: "AG", gradient: "from-violet-400 to-purple-600" },
];

const recentActivity = [
  { action: "New booking", detail: "Emily R. booked Refrigerator Repair", time: "2m ago", icon: "📅" },
  { action: "Payment received", detail: "₱149.00 from David P.", time: "15m ago", icon: "💳" },
  { action: "New user", detail: "james.w@email.com registered", time: "32m ago", icon: "👤" },
  { action: "Job completed", detail: "Mike J. finished HVAC Maintenance", time: "1h ago", icon: "✅" },
  { action: "Review posted", detail: "5 stars from Lisa T.", time: "2h ago", icon: "⭐" },
];

const maxRev = Math.max(...monthlyRevenue.map((d) => d.value));

export default function AdminDashboard() {
  const { user } = useCurrentUser();
  const firstName = user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="heading-display text-3xl md:text-4xl mb-2">
          {getGreeting()}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-text-secondary">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {platformStats.map((stat, i) => (
          <div key={i} className="glass-card group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="text-xs text-success mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="glass-card border-success/20 bg-success/5 flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
        <div>
          <p className="text-sm font-semibold text-success">All Systems Operational</p>
          <p className="text-xs text-text-muted">API latency: 45ms · Uptime: 99.98%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Revenue Trend</h2>
          <div className="flex items-end gap-2 h-48">
            {monthlyRevenue.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-white/5 rounded-t-md overflow-hidden" style={{ height: "160px" }}>
                  <div className="w-full bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-md" style={{ height: `${(d.value / maxRev) * 100}%`, marginTop: `${100 - (d.value / maxRev) * 100}%` }} />
                </div>
                <span className="text-[10px] text-text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{a.action}</p>
                  <p className="text-xs text-text-muted truncate">{a.detail}</p>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Technicians */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Top Technicians</h2>
          <a href="/dashboard/admin/users" className="text-sm text-primary hover:text-primary-light">View All →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topTechnicians.map((t, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold mx-auto mb-3`}>{t.initials}</div>
              <p className="font-semibold text-text-primary text-sm">{t.name}</p>
              <p className="text-xs text-text-muted mt-1">⭐ {t.rating} · {t.jobs} jobs</p>
              <p className="text-sm font-bold text-primary mt-2">{t.earned}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
