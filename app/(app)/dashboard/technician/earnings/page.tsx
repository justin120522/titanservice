"use client";

const monthlyData = [
  { month: "Jan", amount: 3200 }, { month: "Feb", amount: 3800 }, { month: "Mar", amount: 4100 },
  { month: "Apr", amount: 4280 }, { month: "May", amount: 0 }, { month: "Jun", amount: 0 },
];

const recentPayments = [
  { id: "PAY-001", date: "Apr 28", customer: "Emily R.", service: "Refrigerator Repair", amount: 149, status: "paid" },
  { id: "PAY-002", date: "Apr 25", customer: "David P.", service: "HVAC Maintenance", amount: 129, status: "paid" },
  { id: "PAY-003", date: "Apr 22", customer: "Lisa T.", service: "Washer Repair", amount: 89, status: "paid" },
  { id: "PAY-004", date: "Apr 20", customer: "James W.", service: "Dishwasher Install", amount: 199, status: "pending" },
  { id: "PAY-005", date: "Apr 18", customer: "Sarah J.", service: "Oven Repair", amount: 149, status: "paid" },
];

const maxAmount = Math.max(...monthlyData.map((d) => d.amount), 1);

export default function EarningsPage() {
  return (
    <div className="animate-fade-in-up">
      <h1 className="heading-display text-3xl mb-2">My <span className="gradient-text-warm">Earnings</span></h1>
      <p className="text-text-secondary mb-8">Track your income and payment history</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="glass-card">
          <p className="text-sm text-text-muted mb-1">This Month</p>
          <p className="text-3xl font-bold text-text-primary">₱4,280</p>
          <p className="text-xs text-success mt-1">+12% vs last month</p>
        </div>
        <div className="glass-card">
          <p className="text-sm text-text-muted mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-text-primary">₱15,380</p>
          <p className="text-xs text-text-muted mt-1">Since Jan 2025</p>
        </div>
        <div className="glass-card">
          <p className="text-sm text-text-muted mb-1">Pending Payout</p>
          <p className="text-3xl font-bold text-accent">₱199</p>
          <p className="text-xs text-text-muted mt-1">1 pending payment</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Monthly Earnings</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-text-primary">{d.amount > 0 ? `$${(d.amount / 1000).toFixed(1)}k` : ""}</span>
              <div className="w-full bg-white/5 rounded-t-lg overflow-hidden" style={{ height: "160px" }}>
                <div className="w-full bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-lg transition-all duration-700 mt-auto" style={{ height: `${(d.amount / maxAmount) * 100}%`, marginTop: `${100 - (d.amount / maxAmount) * 100}%` }} />
              </div>
              <span className="text-xs text-text-muted">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="glass-table">
            <thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-xs text-text-muted">{p.id}</td>
                  <td className="text-sm text-text-secondary">{p.date}</td>
                  <td className="text-sm text-text-primary">{p.customer}</td>
                  <td className="text-sm text-text-secondary">{p.service}</td>
                  <td className="text-sm font-medium text-text-primary">${p.amount}</td>
                  <td><span className={`badge ${p.status === "paid" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
