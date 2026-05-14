// Supabase-backed bookings store
import { supabaseAdmin } from "./supabase";

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  technician_id?: string;
  technician_name?: string;
  service_type: string;
  appliance: string;
  issue_description: string;
  scheduled_date: string;
  scheduled_time: string;
  service_address: string;
  latitude?: number;
  longitude?: number;
  price: number;
  status: "pending" | "assigned" | "en_route" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  completed_at?: string;
}

// Map DB rows (snake_case) to the API shape the frontend expects (camelCase)
function toApiBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    customer_id: row.customer_id as string,
    customer_name: row.customer_name as string,
    customer_email: row.customer_email as string,
    customer_phone: row.customer_phone as string | undefined,
    technician_id: row.technician_id as string | undefined,
    technician_name: row.technician_name as string | undefined,
    service_type: row.service_type as string,
    appliance: row.appliance as string,
    issue_description: row.issue_description as string,
    scheduled_date: row.scheduled_date as string,
    scheduled_time: row.scheduled_time as string,
    service_address: row.service_address as string,
    latitude: row.latitude as number | undefined,
    longitude: row.longitude as number | undefined,
    price: Number(row.price),
    status: row.status as Booking["status"],
    created_at: row.created_at as string,
    completed_at: row.completed_at as string | undefined,
  };
}

// Frontend uses camelCase keys — map for backward compatibility
function toFrontendBooking(b: Booking) {
  return {
    id: b.id,
    customerId: b.customer_id,
    customerName: b.customer_name,
    customerEmail: b.customer_email,
    customerPhone: b.customer_phone,
    technicianId: b.technician_id,
    technicianName: b.technician_name,
    serviceType: b.service_type,
    appliance: b.appliance,
    issueDescription: b.issue_description,
    scheduledDate: b.scheduled_date,
    scheduledTime: b.scheduled_time,
    serviceAddress: b.service_address,
    latitude: b.latitude,
    longitude: b.longitude,
    price: b.price,
    status: b.status,
    created_at: b.created_at,
    completed_at: b.completed_at,
  };
}

export async function getAllBookings() {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBookings error:", error);
    return [];
  }
  return (data || []).map(toApiBooking).map(toFrontendBooking);
}

export async function getBookingsByCustomer(customerId: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBookingsByCustomer error:", error);
    return [];
  }
  return (data || []).map(toApiBooking).map(toFrontendBooking);
}

export async function getBookingsByTechnician(technicianId: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("technician_id", technicianId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBookingsByTechnician error:", error);
    return [];
  }
  return (data || []).map(toApiBooking).map(toFrontendBooking);
}

export async function getBookingById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return toFrontendBooking(toApiBooking(data));
}

export async function createBooking(input: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: string;
  appliance: string;
  issueDescription: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  latitude?: number;
  longitude?: number;
  price: number;
}) {
  // Get next booking ID
  const { data: counterData, error: counterError } = await supabaseAdmin
    .rpc("next_booking_id");

  if (counterError) {
    console.error("next_booking_id error:", counterError);
    return null;
  }

  const bookingId = counterData as string;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      id: bookingId,
      customer_id: input.customerId,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone || null,
      service_type: input.serviceType,
      appliance: input.appliance,
      issue_description: input.issueDescription || "",
      scheduled_date: input.scheduledDate,
      scheduled_time: input.scheduledTime,
      service_address: input.serviceAddress,
      latitude: input.latitude || null,
      longitude: input.longitude || null,
      price: input.price || 0,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    console.error("createBooking error:", error);
    return null;
  }

  return toFrontendBooking(toApiBooking(data));
}

export async function assignTechnician(
  bookingId: string,
  technicianId: string,
  technicianName: string
) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({
      technician_id: technicianId,
      technician_name: technicianName,
      status: "assigned",
    })
    .eq("id", bookingId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("assignTechnician error:", error);
    return null;
  }

  return toFrontendBooking(toApiBooking(data));
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
) {
  const updateData: Record<string, unknown> = { status };
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("updateBookingStatus error:", error);
    return null;
  }

  return toFrontendBooking(toApiBooking(data));
}
