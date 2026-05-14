"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  phone?: string;
  rating: number;
  jobs_completed: number;
  created_at: string;
}

const roleColors: Record<string, string> = {
  customer: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  technician: "text-accent bg-accent/10 border-accent/20",
  admin: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const roleIcons: Record<string, string> = {
  customer: "🏠",
  technician: "🔧",
  admin: "🛡️",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch {
      // fallback
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.role !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: users.length,
    customer: users.filter((u) => u.role === "customer").length,
    technician: users.filter((u) => u.role === "technician").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-display text-3xl">User <span className="gradient-text">Management</span></h1>
        <button onClick={fetchUsers} className="btn btn-glass btn-sm text-xs" title="Refresh">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Users", count: counts.all, icon: "👥", color: "from-sky-500/20 to-blue-600/20" },
          { label: "Customers", count: counts.customer, icon: "🏠", color: "from-emerald-500/20 to-green-600/20" },
          { label: "Technicians", count: counts.technician, icon: "🔧", color: "from-amber-500/20 to-orange-600/20" },
          { label: "Admins", count: counts.admin, icon: "🛡️", color: "from-rose-500/20 to-red-600/20" },
        ].map((s) => (
          <div key={s.label} className="glass-card py-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-text-primary">{s.count}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input py-2.5 pl-10" placeholder="Search by name or email..." />
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "technician", "admin"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-primary text-white" : "glass text-text-secondary hover:bg-white/5"}`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card text-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <span className="text-4xl block mb-3">👥</span>
          <p className="text-text-muted">No users found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead><tr><th>User</th><th>Role</th><th>Phone</th><th>Rating</th><th>Joined</th></tr></thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          u.role === "admin" ? "bg-gradient-to-br from-rose-400 to-red-600" :
                          u.role === "technician" ? "bg-gradient-to-br from-amber-400 to-orange-600" :
                          "bg-gradient-to-br from-sky-400 to-blue-600"
                        }`}>
                          {u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{u.name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${roleColors[u.role]}`}>
                        {roleIcons[u.role]} {u.role}
                      </span>
                    </td>
                    <td className="text-sm text-text-secondary">{u.phone || "—"}</td>
                    <td className="text-sm text-text-primary">⭐ {u.rating}</td>
                    <td className="text-sm text-text-secondary">
                      {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
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
