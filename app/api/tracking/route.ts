import { NextResponse } from "next/server";

export async function GET() {
  // TODO: const { data, error } = await supabase.from('tracking').select('*').eq('booking_id', bookingId).single();
  return NextResponse.json({ success: true, data: null });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, latitude, longitude, status } = body;

    if (!bookingId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // TODO: const { data, error } = await supabase.from('tracking').upsert({...}).select().single();
    const trackingUpdate = {
      id: crypto.randomUUID(),
      booking_id: bookingId,
      latitude,
      longitude,
      status: status || "en_route",
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: trackingUpdate });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
