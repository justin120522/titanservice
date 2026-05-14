import { NextRequest, NextResponse } from "next/server";
import { assignTechnician, updateBookingStatus, getBookingById } from "@/lib/bookings";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { action, technicianId, technicianName, status } = body;

  if (action === "assign") {
    if (!technicianId || !technicianName) {
      return NextResponse.json({ success: false, error: "Missing technician info" }, { status: 400 });
    }
    const booking = assignTechnician(id, technicianId, technicianName);
    if (!booking) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: booking });
  }

  if (action === "status") {
    const booking = updateBookingStatus(id, status);
    if (!booking) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: booking });
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: booking });
}
