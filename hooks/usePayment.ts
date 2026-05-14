"use client";

import { useState, useCallback } from "react";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (bookingId: string, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, amount }),
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Payment failed");
        return null;
      }
    } catch {
      setError("Payment processing failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refundPayment = useCallback(async (paymentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/${paymentId}/refund`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) return data.data;
      setError(data.error || "Refund failed");
      return null;
    } catch {
      setError("Refund processing failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, processPayment, refundPayment };
}
