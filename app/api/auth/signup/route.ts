import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, address, specialties, experience, certifications, service_area, bio } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const result = await createUser({
      email,
      password,
      name,
      role: role || "customer",
      phone,
      address,
      specialties,
      experience,
      certifications,
      service_area,
      bio,
    });

    if ("error" in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: result,
        redirect: `/dashboard/${result.role}`,
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
