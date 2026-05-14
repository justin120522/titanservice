"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/lib/auth";

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  appliance: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  technicianName?: string;
  price: number;
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  assigned: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  en_route: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  in_progress: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function BookingsPage() {
  const { user } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        // Filter bookings belonging to the logged-in customer
        const myBookings = data.data.filter(
          (b: Booking) => b.customerId === user?.id
        );
        setBookings(myBookings);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user, fetchBookings]);

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (
      search &&
      !b.appliance.toLowerCase().includes(search.toLowerCase()) &&
      !b.id.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-display text-3xl mb-1">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-text-secondary text-sm">
            {bookings.length} total bookings
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBookings}
            className="btn btn-glass btn-sm text-xs"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <a
            href="/dashboard/customer/book-service"
            className="btn btn-primary btn-sm"
          >
            + New Booking
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input py-2.5"
            placeholder="Search by appliance or ID..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "assigned", "completed", "cancelled"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-white"
                    : "glass text-text-secondary hover:bg-white/5"
                }`}
              >
                {f === "all"
                  ? `All (${bookings.length})`
                  : `${f
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())} (${
                      bookings.filter((b) => b.status === f).length
                    })`}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="glass-card text-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading bookings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="glass-card flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-text-muted">
                    {b.id}
                  </span>
                  <span className={`badge ${statusStyles[b.status] || ""}`}>
                    {b.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {b.appliance} —{" "}
                  <span className="capitalize">{b.serviceType}</span>
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-text-secondary">
                  <span>
                    📅 {b.scheduledDate} at {formatTime(b.scheduledTime)}
                  </span>
                  <span>
                    🔧 {b.technicianName || <em className="text-amber-400">Unassigned</em>}
                  </span>
                  <span>📍 {b.serviceAddress}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xl font-bold text-text-primary">
                  ₱{b.price.toFixed(0)}
                </p>
                {b.status === "completed" && (
                  <span className="text-success text-sm font-medium flex items-center gap-1">
                    ✅ Done
                  </span>
                )}
                {b.status === "assigned" && (
                  <span className="text-sky-400 text-sm font-medium flex items-center gap-1">
                    🔧 Tech Assigned
                  </span>
                )}
                {b.status === "pending" && (
                  <span className="text-amber-400 text-sm font-medium flex items-center gap-1">
                    ⏳ Awaiting Assignment
                  </span>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="glass-card text-center py-16">
              <span className="text-5xl block mb-4">📋</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Bookings Found
              </h3>
              <p className="text-sm text-text-muted mb-6">
                {bookings.length === 0
                  ? "You haven't made any bookings yet."
                  : "No bookings match your search criteria."}
              </p>
              {bookings.length === 0 && (
                <a
                  href="/dashboard/customer/book-service"
                  className="btn btn-primary"
                >
                  Book Your First Service
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
