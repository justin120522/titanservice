"use client";

import { useState, useCallback } from "react";
import type { BookingFormData, Booking } from "@/types";

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        setError(data.error || "Failed to fetch bookings");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (formData: BookingFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => [data.data, ...prev]);
        return data.data;
      } else {
        setError(data.error || "Failed to create booking");
        return null;
      }
    } catch {
      setError("Network error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
        );
      }
    } catch {
      setError("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookings, loading, error, fetchBookings, createBooking, cancelBooking };
}
