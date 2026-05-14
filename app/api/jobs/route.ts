import { NextRequest, NextResponse } from "next/server";
import { getAllBookings } from "@/lib/bookings";

// Prevent Next.js from caching this route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const technicianId = searchParams.get("technicianId");

  let bookings = await getAllBookings();

  // Filter by technician if provided
  if (technicianId) {
    bookings = bookings.filter((b: Record<string, unknown>) => b.technicianId === technicianId);
  }

  return NextResponse.json({ success: true, data: bookings });
}
