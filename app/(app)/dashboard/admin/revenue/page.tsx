"use client";

const revenueByService = [
  { service: "Repair", amount: 98400, pct: 42, color: "bg-sky-400" },
  { service: "Maintenance", amount: 52100, pct: 22, color: "bg-emerald-400" },
  { service: "Installation", amount: 45200, pct: 19, color: "bg-violet-400" },
  { service: "Cleaning", amount: 21800, pct: 9, color: "bg-amber-400" },
  { service: "Inspection", amount: 17000, pct: 8, color: "bg-pink-400" },
];

const monthlyRevenue = [
  { month: "Jan", value: 18500 }, { month: "Feb", value: 22300 }, { month: "Mar", value: 19800 },
  { month: "Apr", value: 24100 }, { month: "May", value: 21700 }, { month: "Jun", value: 26400 },
  { month: "Jul", value: 23800 }, { month: "Aug", value: 28900 }, { month: "Sep", value: 25600 },
  { month: "Oct", value: 30200 }, { month: "Nov", value: 27800 }, { month: "Dec", value: 34500 },
];

const topServices = [
  { name: "Refrigerator Repair", count: 1240, revenue: "₱184,760" },
  { name: "HVAC Maintenance", count: 980, revenue: "₱127,400" },
  { name: "Washer Repair", count: 856, revenue: "₱76,184" },
  { name: "Oven Installation", count: 432, revenue: "₱85,968" },
  { name: "Dishwasher Repair", count: 398, revenue: "₱39,402" },
];

const maxRev = Math.max(...monthlyRevenue.map((d) => d.value));

export default function AdminRevenuePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-display text-3xl mb-1">Revenue <span className="gradient-text-warm">Reports</span></h1>
          <p className="text-text-secondary text-sm">Financial overview and analytics</p>
        </div>
        <button className="btn btn-glass btn-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="glass-card">
          <p className="text-sm text-text-muted mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-text-primary heading-display">₱234,500</p>
          <p className="text-xs text-success mt-1">+18% vs last year</p>
        </div>
        <div className="glass-card">
          <p className="text-sm text-text-muted mb-1">Avg. Per Booking</p>
          <p className="text-3xl font-bold text-text-primary heading-display">₱128</p>
          <p className="text-xs text-success mt-1">+5% vs last quarter</p>
        </div>
        <div className="glass-card">
          <p className="text-sm text-text-muted mb-1">Platform Commission</p>
          <p className="text-3xl font-bold text-primary heading-display">₱35,175</p>
          <p className="text-xs text-text-muted mt-1">15% commission rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 glass-card">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-2 h-52">
            {monthlyRevenue.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-muted">${(d.value / 1000).toFixed(0)}k</span>
                <div className="w-full bg-white/5 rounded-t-md overflow-hidden" style={{ height: "180px" }}>
                  <div className="w-full bg-gradient-to-t from-emerald-500/60 to-emerald-500/20 rounded-t-md" style={{ height: `${(d.value / maxRev) * 100}%`, marginTop: `${100 - (d.value / maxRev) * 100}%` }} />
                </div>
                <span className="text-[10px] text-text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Service */}
        <div className="glass-card">
          <h2 className="text-lg font-semibold text-text-primary mb-6">By Service Type</h2>
          <div className="space-y-4">
            {revenueByService.map((s) => (
              <div key={s.service}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-text-secondary">{s.service}</span>
                  <span className="text-text-primary font-medium">${(s.amount / 1000).toFixed(1)}k</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Top Services</h2>
        <div className="overflow-x-auto">
          <table className="glass-table">
            <thead><tr><th>#</th><th>Service</th><th>Bookings</th><th>Revenue</th></tr></thead>
            <tbody>
              {topServices.map((s, i) => (
                <tr key={i}>
                  <td className="text-sm text-text-muted font-medium">{i + 1}</td>
                  <td className="text-sm font-medium text-text-primary">{s.name}</td>
                  <td className="text-sm text-text-secondary">{s.count.toLocaleString()}</td>
                  <td className="text-sm font-bold text-primary">{s.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
