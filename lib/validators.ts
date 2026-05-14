import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
  role: z.enum(["customer", "technician"]).default("customer"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const bookingSchema = z.object({
  serviceType: z.enum(["repair", "maintenance", "installation", "cleaning", "inspection"]),
  appliance: z
    .string()
    .min(2, "Appliance name must be at least 2 characters")
    .max(100, "Appliance name must be at most 100 characters"),
  issueDescription: z
    .string()
    .min(10, "Issue description must be at least 10 characters")
    .max(1000, "Issue description must be at most 1000 characters"),
  scheduledDate: z.string().refine((date) => {
    const scheduled = new Date(date);
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return scheduled > now;
  }, "Date must be at least 1 hour from now"),
  scheduledTime: z.string().refine((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 8 && hour <= 18;
  }, "Time must be between 8 AM and 6 PM"),
  serviceAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number (E.164 format)")
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
