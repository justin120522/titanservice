"use client";

import { useState, useEffect, useCallback } from "react";

interface Booking {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail: string;
  technicianId?: string;
  technicianName?: string;
  serviceType: string;
  appliance: string;
  issueDescription: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  latitude?: number;
  longitude?: number;
  price: number;
  status: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [busyTechIds, setBusyTechIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, usersRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/users"),
      ]);
      const bookingsData = await bookingsRes.json();
      const usersData = await usersRes.json();

      if (bookingsData.success) {
        setBookings(bookingsData.data);
        const busy = new Set<string>();
        bookingsData.data.forEach((b: Booking) => {
          if (b.technicianId && b.status !== "completed" && b.status !== "cancelled") {
            busy.add(b.technicianId);
          }
        });
        setBusyTechIds(busy);
      }
      if (usersData.success) {
        setTechnicians(usersData.data.filter((u: Technician) => u.role === "technician"));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const assignTech = async (bookingId: string) => {
    if (!selectedTech) return;
    const tech = technicians.find((t) => t.id === selectedTech);
    if (!tech) return;

    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign", technicianId: tech.id, technicianName: tech.name }),
      });
      setAssigningId(null);
      setSelectedTech("");
      await fetchData();
    } catch { /* ignore */ }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", status: "cancelled" }),
      });
      await fetchData();
    } catch { /* ignore */ }
  };

  const filtered = bookings.filter((b) => filter === "all" || b.status === filter);

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  const statusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    assigned: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    en_route: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cancelled: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  const availableTechs = technicians.filter((t) => !busyTechIds.has(t.id));

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-display text-3xl">Booking <span className="gradient-text">Management</span></h1>
        <button onClick={fetchData} className="btn btn-glass btn-sm text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>
      <p className="text-text-secondary mb-6">{bookings.length} total bookings · {availableTechs.length} technicians available</p>

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
        <div className="glass-card text-center py-16"><span className="text-5xl block mb-4">📋</span><h3 className="text-lg font-semibold mb-2">No Bookings</h3><p className="text-sm text-text-muted">Bookings from customers will appear here.</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="glass-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl">
                    {b.serviceType === "repair" ? "🔧" : b.serviceType === "maintenance" ? "⚙️" : b.serviceType === "installation" ? "📦" : b.serviceType === "cleaning" ? "✨" : "🔍"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary">{b.id}</span>
                      <span className={`badge text-xs ${statusColors[b.status] || ""}`}>{b.status.replace("_", " ").toUpperCase()}</span>
                    </div>
                    <p className="font-semibold text-text-primary">{b.appliance} — <span className="capitalize">{b.serviceType}</span></p>
                    <p className="text-xs text-text-muted">👤 {b.customerName} {b.customerPhone ? `· 📞 ${b.customerPhone}` : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">₱{b.price.toFixed(0)}</p>
                  <p className="text-xs text-text-muted">{b.scheduledDate} · {formatTime(b.scheduledTime)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div><span className="text-text-muted text-xs">📍 Address</span><p className="text-text-primary text-xs mt-0.5">{b.serviceAddress}</p></div>
                <div><span className="text-text-muted text-xs">📝 Issue</span><p className="text-text-primary text-xs mt-0.5 line-clamp-2">{b.issueDescription || "No description"}</p></div>
                <div>
                  <span className="text-text-muted text-xs">🔧 Technician</span>
                  <p className="text-text-primary text-xs mt-0.5 font-medium">{b.technicianName || <span className="text-amber-400 italic">Unassigned</span>}</p>
                </div>
              </div>

              {b.latitude && b.longitude && (
                <div className="mt-2">
                  <a href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    🗺️ View on Google Maps ({b.latitude.toFixed(4)}, {b.longitude.toFixed(4)})
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {b.status === "pending" && (
                  <>
                    {assigningId === b.id ? (
                      <div className="flex gap-2 items-center flex-1">
                        <select
                          value={selectedTech}
                          onChange={(e) => setSelectedTech(e.target.value)}
                          className="glass-input py-2 text-sm flex-1"
                        >
                          <option value="" className="bg-surface">Select technician...</option>
                          {availableTechs.map((t) => (
                            <option key={t.id} value={t.id} className="bg-surface">{t.name} (Available)</option>
                          ))}
                        </select>
                        <button onClick={() => assignTech(b.id)} disabled={!selectedTech} className="btn btn-primary btn-sm text-xs disabled:opacity-40">Confirm</button>
                        <button onClick={() => { setAssigningId(null); setSelectedTech(""); }} className="btn btn-glass btn-sm text-xs">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => setAssigningId(b.id)} className="btn btn-primary btn-sm text-xs">
                          🔧 Assign Technician
                        </button>
                        <button onClick={() => cancelBooking(b.id)} className="btn btn-danger btn-sm text-xs">Cancel</button>
                      </>
                    )}
                  </>
                )}
                {b.status === "assigned" && (
                  <button onClick={() => cancelBooking(b.id)} className="btn btn-danger btn-sm text-xs">Cancel Booking</button>
                )}
                {b.status === "completed" && (
                  <div className="flex items-center gap-2 text-success text-xs"><span>✅</span> Completed</div>
                )}
                {b.status === "cancelled" && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs"><span>❌</span> Cancelled</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
