"use client";

import { useState, useEffect, useCallback } from "react";

interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rating: number;
  jobs_completed: number;
  specialties?: string[];
  created_at: string;
}

interface Booking {
  technicianId?: string;
  status: string;
}

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/bookings"),
      ]);
      const usersData = await usersRes.json();
      const bookingsData = await bookingsRes.json();

      if (usersData.success) {
        setTechnicians(usersData.data.filter((u: Technician & { role: string }) => u.role === "technician"));
      }
      if (bookingsData.success) {
        const busy = new Set<string>();
        bookingsData.data.forEach((b: Booking) => {
          if (b.technicianId && b.status !== "completed" && b.status !== "cancelled") {
            busy.add(b.technicianId);
          }
        });
        setBusyIds(busy);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-display text-3xl">All <span className="gradient-text">Technicians</span></h1>
        <button onClick={fetchData} className="btn btn-glass btn-sm text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>
      <p className="text-text-secondary mb-8">{technicians.length} registered technicians</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-lg">🔧</div><div><p className="text-xl font-bold text-text-primary">{technicians.length}</p><p className="text-xs text-text-muted">Total</p></div></div></div>
        <div className="glass-card py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center text-lg">✅</div><div><p className="text-xl font-bold text-success">{technicians.filter((t) => !busyIds.has(t.id)).length}</p><p className="text-xs text-text-muted">Available</p></div></div></div>
        <div className="glass-card py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-600/20 flex items-center justify-center text-lg">🚗</div><div><p className="text-xl font-bold text-amber-400">{technicians.filter((t) => busyIds.has(t.id)).length}</p><p className="text-xs text-text-muted">On Job</p></div></div></div>
      </div>

      {loading ? (
        <div className="glass-card text-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-text-muted">Loading technicians...</p></div>
      ) : technicians.length === 0 ? (
        <div className="glass-card text-center py-16"><span className="text-5xl block mb-4">🔧</span><h3 className="text-lg font-semibold mb-2">No Technicians</h3><p className="text-sm text-text-muted">Technicians who register will appear here.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicians.map((t) => {
            const isBusy = busyIds.has(t.id);
            return (
              <div key={t.id} className="glass-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text-primary">{t.name}</p>
                      <span className={`badge text-xs ${isBusy ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"}`}>
                        {isBusy ? "🚗 On Job" : "✅ Available"}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{t.email}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/[0.02] rounded-lg py-2"><p className="text-sm font-bold text-text-primary">⭐ {t.rating}</p><p className="text-[10px] text-text-muted">Rating</p></div>
                  <div className="bg-white/[0.02] rounded-lg py-2"><p className="text-sm font-bold text-text-primary">{t.jobs_completed}</p><p className="text-[10px] text-text-muted">Jobs</p></div>
                  <div className="bg-white/[0.02] rounded-lg py-2"><p className="text-sm font-bold text-text-primary">{t.phone || "—"}</p><p className="text-[10px] text-text-muted">Phone</p></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
