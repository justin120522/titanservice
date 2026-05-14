import { NextResponse } from "next/server";

export async function GET() {
  // TODO: const { data, error } = await supabase.from('invoices').select('*');
  return NextResponse.json({ success: true, data: [] });
}
