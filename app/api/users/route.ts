import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/users";

// Prevent Next.js from caching this route
export const dynamic = "force-dynamic";

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json({ success: true, data: users });
}
