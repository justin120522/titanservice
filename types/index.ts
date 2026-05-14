// ============================================================
// ServiceTitan - Core Type Definitions
// ============================================================

// Enums
export type UserRole = 'customer' | 'technician' | 'admin';
export type ServiceType = 'repair' | 'maintenance' | 'installation' | 'cleaning' | 'inspection';
export type BookingStatus = 'pending' | 'matched' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type InvoiceStatus = 'draft' | 'sent' | 'paid';
export type TransactionStatus = 'pending' | 'succeeded' | 'failed';

// User
export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  address?: string;
  rating: number;
  jobs_completed: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}

// Booking
export interface Booking {
  id: string;
  customer_id: string;
  technician_id?: string;
  appliance: string;
  service_type: ServiceType;
  issue_description?: string;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time: string;
  service_address: string;
  price: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: User;
  technician?: User;
  reviews?: Review[];
  tracking?: TrackingData;
}

// Invoice
export interface Invoice {
  id: string;
  booking_id: string;
  invoice_number: string;
  service_fee: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  created_at: string;
  issued_at?: string;
  paid_at?: string;
  // Relations
  booking?: Booking;
}

// Transaction
export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  stripe_payment_id?: string;
  status: TransactionStatus;
  created_at: string;
  // Relations
  booking?: Booking;
}

// Review
export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  technician_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  // Relations
  booking?: Booking;
  customer?: User;
  technician?: User;
}

// Tracking
export interface TrackingData {
  id: string;
  booking_id: string;
  latitude: number;
  longitude: number;
  status: string;
  updated_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeJobs: number;
}

export interface TechnicianStats extends DashboardStats {
  totalEarned: number;
  jobsToday: number;
  monthlyEarnings: number[];
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  monthlyRevenue: number[];
  monthlyBookings: number[];
  systemHealth: 'healthy' | 'degraded' | 'down';
}

// Booking Wizard
export interface BookingFormData {
  serviceType: ServiceType;
  appliance: string;
  issueDescription: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  price: number;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// Chart Data
export interface ChartDataPoint {
  label: string;
  value: number;
}

// Pricing Plan
export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

// Testimonial
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

// FAQ
export interface FAQItem {
  question: string;
  answer: string;
}
