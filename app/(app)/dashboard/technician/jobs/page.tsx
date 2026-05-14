"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCurrentUser } from "@/lib/auth";

interface Job {
  id: string;
  customerName: string;
  customerPhone?: string;
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

export default function TechJobsPage() {
  const { user } = useCurrentUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        // Filter bookings assigned to this technician
        const myJobs = data.data.filter((b: Job & { technicianId?: string }) =>
          b.technicianId === user?.id
        );
        setJobs(myJobs);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user, fetchJobs]);

  const markDone = async (jobId: string) => {
    setCompleting(jobId);
    try {
      await fetch(`/api/bookings/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", status: "completed" }),
      });
      await fetchJobs();
    } catch { /* ignore */ }
    setCompleting(null);
  };

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  const statusColors: Record<string, string> = {
    assigned: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    en_route: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    in_progress: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };

  const activeJobs = jobs.filter((j) => j.status !== "completed");
  const completedJobs = jobs.filter((j) => j.status === "completed");

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-display text-3xl">My <span className="gradient-text">Jobs</span></h1>
        <button onClick={fetchJobs} className="btn btn-glass btn-sm text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>
      <p className="text-text-secondary mb-8">Jobs assigned to you by the admin.</p>

      {loading ? (
        <div className="glass-card text-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card text-center py-16">
          <span className="text-5xl block mb-4">🔧</span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Jobs Yet</h3>
          <p className="text-sm text-text-muted">When the admin assigns you a job, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Jobs */}
          {activeJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Active Jobs ({activeJobs.length})
              </h2>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <JobCard key={job.id} job={job} expanded={expandedJob === job.id} onToggle={() => setExpandedJob(expandedJob === job.id ? null : job.id)} onComplete={markDone} completing={completing} statusColors={statusColors} formatTime={formatTime} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text-muted mb-4">Completed ({completedJobs.length})</h2>
              <div className="space-y-3 opacity-70">
                {completedJobs.map((job) => (
                  <JobCard key={job.id} job={job} expanded={expandedJob === job.id} onToggle={() => setExpandedJob(expandedJob === job.id ? null : job.id)} onComplete={markDone} completing={completing} statusColors={statusColors} formatTime={formatTime} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, expanded, onToggle, onComplete, completing, statusColors, formatTime }: {
  job: Job; expanded: boolean; onToggle: () => void; onComplete: (id: string) => void; completing: string | null;
  statusColors: Record<string, string>; formatTime: (t: string) => string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!expanded || !job.latitude || !job.longitude || !mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // After awaiting imports, check if the effect was cleaned up or map already exists
      if (cancelled || mapInstance.current) return;

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false }).setView([job.latitude!, job.longitude!], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41],
      });
      L.marker([job.latitude!, job.longitude!], { icon }).addTo(map);
      mapInstance.current = map;
    };
    initMap();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [expanded, job.latitude, job.longitude]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl">
            {job.serviceType === "repair" ? "🔧" : job.serviceType === "maintenance" ? "⚙️" : job.serviceType === "installation" ? "📦" : job.serviceType === "cleaning" ? "✨" : "🔍"}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{job.appliance} — <span className="capitalize">{job.serviceType}</span></p>
            <p className="text-xs text-text-muted">👤 {job.customerName} · {job.scheduledDate} at {formatTime(job.scheduledTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${statusColors[job.status] || "text-text-muted bg-white/5 border-white/10"}`}>{job.status.replace("_", " ").toUpperCase()}</span>
          <span className="font-bold text-primary">₱{job.price.toFixed(0)}</span>
          <svg className={`w-5 h-5 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 pt-5 border-t border-white/5 space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-muted text-xs block mb-1">Customer</span><p className="font-medium">{job.customerName}</p></div>
            <div><span className="text-text-muted text-xs block mb-1">Phone</span><p className="font-medium">{job.customerPhone || "Not provided"}</p></div>
            <div><span className="text-text-muted text-xs block mb-1">Service</span><p className="font-medium capitalize">{job.serviceType}</p></div>
            <div><span className="text-text-muted text-xs block mb-1">Appliance</span><p className="font-medium">{job.appliance}</p></div>
            <div className="col-span-2"><span className="text-text-muted text-xs block mb-1">Issue</span><p className="font-medium">{job.issueDescription || "No description"}</p></div>
            <div className="col-span-2"><span className="text-text-muted text-xs block mb-1">📍 Address</span><p className="font-medium">{job.serviceAddress}</p></div>
          </div>

          {/* Map */}
          {job.latitude && job.longitude && (
            <div>
              <p className="text-xs text-text-muted mb-2">📍 Customer Location</p>
              <div ref={mapRef} className="w-full h-[200px] rounded-xl border border-white/10 overflow-hidden" style={{ zIndex: 1 }} />
              <a
                href={`https://www.google.com/maps?q=${job.latitude},${job.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass btn-sm text-xs mt-2 inline-flex"
              >
                🗺️ Open in Google Maps
              </a>
            </div>
          )}

          {/* Actions */}
          {job.status !== "completed" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onComplete(job.id)}
                disabled={completing === job.id}
                className="btn btn-primary btn-lg flex-1"
              >
                {completing === job.id ? (
                  <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Completing...</div>
                ) : "✅ Mark as Done"}
              </button>
            </div>
          )}

          {job.status === "completed" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/5 border border-success/20">
              <span className="text-success">✅</span>
              <span className="text-sm text-success font-medium">Job completed</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
