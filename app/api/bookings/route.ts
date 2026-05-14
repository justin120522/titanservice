import { NextRequest, NextResponse } from "next/server";
import { createBooking, getAllBookings } from "@/lib/bookings";
import { findUserById } from "@/lib/users";

// Prevent Next.js from caching this route — bookings change frequently
export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await getAllBookings();
  return NextResponse.json({ success: true, data: bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceType, appliance, issueDescription, scheduledDate, scheduledTime, serviceAddress, price, latitude, longitude, customerId, customerName, customerEmail, customerPhone } = body;

  if (!serviceType || !appliance || !scheduledDate || !scheduledTime || !serviceAddress) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  // Look up the real customer info from the database
  let realName = customerName || "Guest User";
  let realEmail = customerEmail || "";
  let realPhone = customerPhone || "";

  if (customerId && customerId !== "guest") {
    const dbUser = await findUserById(customerId);
    if (dbUser) {
      realName = dbUser.name;
      realEmail = dbUser.email;
      realPhone = dbUser.phone || realPhone;
    } else {
      return NextResponse.json({ success: false, error: "Customer not found. Please log out and log back in." }, { status: 400 });
    }
  }

  const booking = await createBooking({
    customerId: customerId || "guest",
    customerName: realName,
    customerEmail: realEmail,
    customerPhone: realPhone,
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

  if (!booking) {
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: booking }, { status: 201 });
}
