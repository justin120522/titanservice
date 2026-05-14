import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
  const { id } = await ctx.params;
  // TODO: const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    // TODO: const { data, error } = await supabase.from('users').update(body).eq('id', id).select().single();
    return NextResponse.json({ success: true, data: { id, ...body } });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
