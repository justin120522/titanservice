"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/lib/auth";

interface Job {
  id: string;
  customerName: string;
  customerPhone?: string;
  serviceType: string;
  appliance: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  price: number;
  status: string;
  technicianId?: string;
}

const statusColor: Record<string, string> = {
  assigned: "border-sky-400/40 bg-sky-400/5",
  en_route: "border-amber-400/40 bg-amber-400/5",
  in_progress: "border-purple-400/40 bg-purple-400/5",
  completed: "border-emerald-400/40 bg-emerald-400/5",
  cancelled: "border-red-400/40 bg-red-400/5",
};

const statusDot: Record<string, string> = {
  assigned: "bg-sky-400",
  en_route: "bg-amber-400",
  in_progress: "bg-purple-400",
  completed: "bg-emerald-400",
  cancelled: "bg-red-400",
};

export default function SchedulePage() {
  const { user } = useCurrentUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        const myJobs = data.data.filter(
          (b: Job) => b.technicianId === user?.id && b.status !== "cancelled"
        );
        setJobs(myJobs);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchSchedule();
  }, [user, fetchSchedule]);

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  // Group jobs by date
  const grouped = jobs.reduce<Record<string, Job[]>>((acc, job) => {
    const date = job.scheduledDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(job);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-display text-3xl">
          My <span className="gradient-text">Schedule</span>
        </h1>
        <button onClick={fetchSchedule} className="btn btn-glass btn-sm text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      <p className="text-text-secondary mb-8">Your upcoming appointments</p>

      {loading ? (
        <div className="glass-card text-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading schedule...</p>
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="glass-card text-center py-16">
          <span className="text-5xl block mb-4">📅</span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Scheduled Jobs</h3>
          <p className="text-sm text-text-muted">When the admin assigns you jobs, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-text-primary">
                  {formatDate(date)}
                </h2>
                <span className="text-xs text-text-muted glass px-2 py-1 rounded-full">
                  {grouped[date].length} job{grouped[date].length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3 relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                {grouped[date]
                  .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                  .map((job) => (
                    <div key={job.id} className="relative">
                      <div
                        className={`absolute -left-[22px] top-4 w-3 h-3 rounded-full border-2 border-surface ${
                          statusDot[job.status] || "bg-gray-400"
                        }`}
                      />
                      <div
                        className={`glass-card border ${
                          statusColor[job.status] || "border-white/10"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-primary">
                                {formatTime(job.scheduledTime)}
                              </p>
                              <span
                                className={`badge text-xs ${
                                  job.status === "completed"
                                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                    : job.status === "assigned"
                                    ? "text-sky-400 bg-sky-400/10 border-sky-400/20"
                                    : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                                }`}
                              >
                                {job.status.replace("_", " ").toUpperCase()}
                              </span>
                            </div>
                            <h3 className="font-semibold text-text-primary">
                              {job.appliance} —{" "}
                              <span className="capitalize">{job.serviceType}</span>
                            </h3>
                            <p className="text-sm text-text-secondary mt-1">
                              👤 {job.customerName}
                              {job.customerPhone ? ` · 📞 ${job.customerPhone}` : ""} · 📍{" "}
                              {job.serviceAddress}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-text-primary">
                            ₱{job.price.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
