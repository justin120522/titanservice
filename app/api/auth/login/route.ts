import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const user = validateCredentials(email, password);

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Check role matches if provided
    if (role && user.role !== role) {
      return NextResponse.json({ success: false, error: `This account is not registered as a ${role}` }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        redirect: `/dashboard/${user.role}`,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
