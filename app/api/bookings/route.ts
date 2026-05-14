import { NextRequest, NextResponse } from "next/server";
import { createBooking, getAllBookings } from "@/lib/bookings";

// Prevent Next.js from caching this route — bookings change frequently
export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = getAllBookings();
  return NextResponse.json({ success: true, data: bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceType, appliance, issueDescription, scheduledDate, scheduledTime, serviceAddress, price, latitude, longitude, customerId, customerName, customerEmail, customerPhone } = body;

  if (!serviceType || !appliance || !scheduledDate || !scheduledTime || !serviceAddress) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  const booking = createBooking({
    customerId: customerId || "guest",
    customerName: customerName || "Guest User",
    customerEmail: customerEmail || "",
    customerPhone: customerPhone || "",
    serviceType,
    appliance,
    issueDescription: issueDescription || "",
    scheduledDate,
    scheduledTime,
    serviceAddress,
    latitude: latitude || undefined,
    longitude: longitude || undefined,
    price: price || 0,
  });

  return NextResponse.json({ success: true, data: booking }, { status: 201 });
}
