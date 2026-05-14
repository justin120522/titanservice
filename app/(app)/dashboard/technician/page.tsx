"use client";

import { useCurrentUser, getGreeting } from "@/lib/auth";

const stats = [
  { label: "Today's Jobs", value: "3", change: "2 remaining", icon: "📋", color: "from-sky-500/20 to-blue-600/20", border: "border-sky-500/20" },
  { label: "This Month", value: "₱4,280", change: "+12% vs last month", icon: "💰", color: "from-emerald-500/20 to-green-600/20", border: "border-emerald-500/20" },
  { label: "Rating", value: "4.9", change: "Based on 234 reviews", icon: "⭐", color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/20" },
  { label: "Completed", value: "234", change: "+8 this week", icon: "✅", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/20" },
];

const todayJobs = [
  { id: "JB-101", customer: "Emily R.", appliance: "Refrigerator", type: "Repair", time: "9:00 AM", address: "456 Oak Ave, Suite 2", status: "completed", price: 149 },
  { id: "JB-102", customer: "David P.", appliance: "HVAC System", type: "Maintenance", time: "1:00 PM", address: "789 Pine Rd", status: "on_site", price: 129 },
  { id: "JB-103", customer: "Lisa T.", appliance: "Washer", type: "Repair", time: "4:00 PM", address: "321 Elm St, Apt 5A", status: "pending", price: 89 },
];

const incomingJobs = [
  { id: "JB-201", customer: "James W.", appliance: "Dishwasher", type: "Installation", date: "Apr 29", time: "10:00 AM", address: "555 Maple Dr", price: 199 },
  { id: "JB-202", customer: "Sarah J.", appliance: "Oven", type: "Repair", date: "Apr 29", time: "2:00 PM", address: "777 Cedar Ln", price: 149 },
];

const statusStyles: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  on_site: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function TechnicianDashboard() {
  const { user } = useCurrentUser();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="heading-display text-3xl md:text-4xl mb-2">
          {getGreeting()}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-text-secondary">You have 2 jobs remaining today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="text-xs text-success mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 glass-card">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Today&apos;s Schedule</h2>
          <div className="space-y-4">
            {todayJobs.map((job) => (
              <div key={job.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-text-muted">{job.id}</span>
                    <span className={`badge ${statusStyles[job.status]}`}>{job.status.replace("_", " ")}</span>
                  </div>
                  <h3 className="font-semibold text-text-primary">{job.appliance} — {job.type}</h3>
                  <p className="text-sm text-text-secondary mt-1">👤 {job.customer} · 🕐 {job.time} · 📍 {job.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-text-primary">₱{job.price}</p>
                  {job.status === "pending" && <button className="btn btn-primary btn-sm">Start</button>}
                  {job.status === "on_site" && <button className="btn btn-accent btn-sm">Complete</button>}
                  {job.status === "completed" && <span className="text-success text-sm font-medium">Done ✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Jobs */}
        <div className="space-y-5">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Incoming Jobs</h3>
            <div className="space-y-3">
              {incomingJobs.map((job) => (
                <div key={job.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">{job.appliance}</span>
                    <span className="text-sm font-bold text-primary">₱{job.price}</span>
                  </div>
                  <p className="text-xs text-text-muted mb-3">📅 {job.date} · 🕐 {job.time}</p>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm flex-1 text-xs py-2">Accept</button>
                    <button className="btn btn-glass btn-sm flex-1 text-xs py-2">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Mini */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Weekly Earnings</h3>
            <div className="flex items-end gap-1 h-24">
              {[65, 80, 45, 90, 70, 85, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t-md flex items-end overflow-hidden">
                  <div className="w-full bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-md transition-all duration-500" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-text-muted mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (<span key={d}>{d}</span>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
