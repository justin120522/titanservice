import { NextResponse } from "next/server";

export async function GET() {
  // TODO: const { data, error } = await supabase.from('transactions').select('*');
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, amount } = body;

    if (!bookingId || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // TODO: Integrate with Stripe + Supabase
    const payment = {
      id: crypto.randomUUID(),
      booking_id: bookingId,
      amount,
      stripe_payment_id: null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 });
  }
}
