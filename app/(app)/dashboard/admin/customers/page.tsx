"use client";

import { useState, useEffect, useCallback } from "react";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: string;
  appliance: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  price: number;
  status: string;
  technicianName?: string;
}

export default function AdminCustomersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = bookings.filter((b) => filter === "all" || b.status === filter);

  const statusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    assigned: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    en_route: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cancelled: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-display text-3xl">Customer <span className="gradient-text">Bookings</span></h1>
        <button onClick={fetchData} className="btn btn-glass btn-sm text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>
      <p className="text-text-secondary mb-8">{bookings.length} total bookings from customers</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "assigned", "completed", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-primary text-white" : "glass text-text-secondary hover:bg-white/5"}`}>
            {f === "all" ? `All (${bookings.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${bookings.filter((b) => b.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card text-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-text-muted">Loading bookings...</p></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card text-center py-16"><span className="text-5xl block mb-4">📋</span><h3 className="text-lg font-semibold mb-2">No Bookings</h3><p className="text-sm text-text-muted">Customer bookings will appear here.</p></div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Status</th><th>Technician</th><th>Price</th></tr></thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="text-xs font-mono text-primary">{b.id}</td>
                    <td>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{b.customerName}</p>
                        <p className="text-xs text-text-muted">{b.customerPhone || b.customerEmail}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{b.appliance}</p>
                        <p className="text-xs text-text-muted capitalize">{b.serviceType}</p>
                      </div>
                    </td>
                    <td className="text-sm text-text-secondary">{b.scheduledDate}<br /><span className="text-xs text-text-muted">{formatTime(b.scheduledTime)}</span></td>
                    <td><span className={`badge ${statusColors[b.status] || ""}`}>{b.status.replace("_", " ").toUpperCase()}</span></td>
                    <td className="text-sm text-text-secondary">{b.technicianName || <span className="text-text-muted italic">Unassigned</span>}</td>
                    <td className="text-sm font-bold text-primary">₱{b.price.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
