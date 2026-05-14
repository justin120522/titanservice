-- ============================================
-- ServiceTitan Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension (already enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin');
CREATE TYPE service_type AS ENUM ('repair', 'maintenance', 'installation', 'cleaning', 'inspection');
CREATE TYPE booking_status AS ENUM ('pending', 'matched', 'en_route', 'on_site', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid');
CREATE TYPE transaction_status AS ENUM ('pending', 'succeeded', 'failed');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  address VARCHAR(500),
  rating DOUBLE PRECISION DEFAULT 5.0,
  jobs_completed INTEGER DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0.00,
  specialties TEXT[],
  experience VARCHAR(20),
  certifications VARCHAR(255),
  service_area VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
  appliance VARCHAR(100) NOT NULL,
  service_type service_type NOT NULL,
  issue_description TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  service_address VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES TABLE
-- ============================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  service_fee DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  status invoice_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  issued_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payment_id VARCHAR(255),
  status transaction_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRACKING TABLE
-- ============================================

CREATE TABLE tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status VARCHAR(50),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_technician ON bookings(technician_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_invoices_booking ON invoices(booking_id);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_reviews_technician ON reviews(technician_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_tracking_booking ON tracking(booking_id);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert for registration
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (true);

-- Customers see their own bookings
CREATE POLICY "Customers see own bookings" ON bookings
  FOR SELECT USING (auth.uid() = customer_id);

-- Technicians see assigned bookings
CREATE POLICY "Technicians see assigned bookings" ON bookings
  FOR SELECT USING (auth.uid() = technician_id);

-- Customers can create bookings
CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Allow booking updates (status changes)
CREATE POLICY "Allow booking updates" ON bookings
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = technician_id);

-- Invoices visible to booking owner
CREATE POLICY "Invoice access" ON invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = invoices.booking_id AND (bookings.customer_id = auth.uid() OR bookings.technician_id = auth.uid()))
  );

-- Transactions visible to booking owner
CREATE POLICY "Transaction access" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = transactions.booking_id AND (bookings.customer_id = auth.uid() OR bookings.technician_id = auth.uid()))
  );

-- Reviews are publicly readable
CREATE POLICY "Reviews are public" ON reviews
  FOR SELECT USING (true);

-- Customers can write reviews
CREATE POLICY "Customers write reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Tracking visible to booking participants
CREATE POLICY "Tracking access" ON tracking
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = tracking.booking_id AND (bookings.customer_id = auth.uid() OR bookings.technician_id = auth.uid()))
  );

-- Technicians can update tracking
CREATE POLICY "Technicians update tracking" ON tracking
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = tracking.booking_id AND bookings.technician_id = auth.uid())
  );

-- ============================================
-- ADMIN POLICIES (full access)
-- ============================================

CREATE POLICY "Admins full access users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins full access bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins full access invoices" ON invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins full access transactions" ON transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins full access reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins full access tracking" ON tracking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );
