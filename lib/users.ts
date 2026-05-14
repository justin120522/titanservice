// Simple in-memory user store (persists until server restart)
// In production, this would be Supabase queries

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

// Pre-seeded admin account
const users: StoredUser[] = [
  {
    id: "admin-001",
    email: "admin@servicetitan.com",
    password: "Admin123!@#",
    name: "Admin User",
    role: "admin",
    phone: "+639171234567",
    rating: 5.0,
    jobs_completed: 0,
    created_at: new Date().toISOString(),
  },
];

export function getAllUsers(): Omit<StoredUser, "password">[] {
  return users.map(({ password: _, ...user }) => user);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): StoredUser | undefined {
  return users.find((u) => u.id === id);
}

export function validateCredentials(email: string, password: string): Omit<StoredUser, "password"> | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function createUser(data: {
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
}): Omit<StoredUser, "password"> | { error: string } {
  // Check if email already exists
  if (findUserByEmail(data.email)) {
    return { error: "Email already registered" };
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    ...data,
    rating: 5.0,
    jobs_completed: 0,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  const { password: _, ...safeUser } = newUser;
  return safeUser;
}
