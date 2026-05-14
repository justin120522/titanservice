// Supabase-backed user store
import { supabaseAdmin } from "./supabase";

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "customer" | "technician" | "admin";
  phone?: string;
  address?: string;
  avatar_url?: string;
  specialties?: string[];
  experience?: string;
  certifications?: string;
  service_area?: string;
  bio?: string;
  rating: number;
  jobs_completed: number;
  created_at: string;
}

export async function getAllUsers(): Promise<Omit<StoredUser, "password">[]> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, role, phone, address, avatar_url, specialties, experience, certifications, service_area, bio, rating, jobs_completed, created_at");

  if (error) {
    console.error("getAllUsers error:", error);
    return [];
  }
  return data || [];
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .ilike("email", email)
    .single();

  if (error || !data) return undefined;
  return data as StoredUser;
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return data as StoredUser;
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<Omit<StoredUser, "password"> | null> {
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: "customer" | "technician" | "admin";
  phone?: string;
  address?: string;
  specialties?: string[];
  experience?: string;
  certifications?: string;
  service_area?: string;
  bio?: string;
}): Promise<Omit<StoredUser, "password"> | { error: string }> {
  // Check if email already exists
  const existing = await findUserByEmail(data.email);
  if (existing) {
    return { error: "Email already registered" };
  }

  const { data: newUser, error } = await supabaseAdmin
    .from("users")
    .insert({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      phone: data.phone || null,
      address: data.address || null,
      specialties: data.specialties || null,
      experience: data.experience || null,
      certifications: data.certifications || null,
      service_area: data.service_area || null,
      bio: data.bio || null,
      rating: 5.0,
      jobs_completed: 0,
    })
    .select("id, email, name, role, phone, address, avatar_url, specialties, experience, certifications, service_area, bio, rating, jobs_completed, created_at")
    .single();

  if (error) {
    console.error("createUser error:", error);
    return { error: error.message };
  }

  return newUser as Omit<StoredUser, "password">;
}
