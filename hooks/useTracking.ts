"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrackingData } from "@/types";

export function useTracking(bookingId: string | null) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTracking = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tracking?bookingId=${bookingId}`);
      const data = await res.json();
      if (data.success) {
        setTracking(data.data);
      }
    } catch {
      // Silent fail for tracking
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchTracking();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchTracking, 10000);
    return () => clearInterval(interval);
  }, [fetchTracking]);

  const updateLocation = useCallback(
    async (latitude: number, longitude: number, status?: string) => {
      if (!bookingId) return;
      try {
        await fetch("/api/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, latitude, longitude, status }),
        });
      } catch {
        // Silent fail
      }
    },
    [bookingId]
  );

  return { tracking, loading, updateLocation, refresh: fetchTracking };
}
