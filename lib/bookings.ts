// In-memory bookings store (persists until server restart)

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  technicianId?: string;
  technicianName?: string;
  serviceType: string;
  appliance: string;
  issueDescription: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  latitude?: number;
  longitude?: number;
  price: number;
  status: "pending" | "assigned" | "en_route" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  completed_at?: string;
}

const bookings: Booking[] = [];

export function getAllBookings(): Booking[] {
  return [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getBookingsByCustomer(customerId: string): Booking[] {
  return bookings.filter((b) => b.customerId === customerId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getBookingsByTechnician(technicianId: string): Booking[] {
  return bookings.filter((b) => b.technicianId === technicianId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function createBooking(data: Omit<Booking, "id" | "status" | "created_at">): Booking {
  const booking: Booking = {
    ...data,
    id: `BK-${String(bookings.length + 1).padStart(3, "0")}`,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export function assignTechnician(bookingId: string, technicianId: string, technicianName: string): Booking | null {
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;
  booking.technicianId = technicianId;
  booking.technicianName = technicianName;
  booking.status = "assigned";
  return booking;
}

export function updateBookingStatus(bookingId: string, status: Booking["status"]): Booking | null {
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;
  booking.status = status;
  if (status === "completed") {
    booking.completed_at = new Date().toISOString();
  }
  return booking;
}
