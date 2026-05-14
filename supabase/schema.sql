-- ============================================
-- ServiceTitan Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  address VARCHAR(500),
  rating DOUBLE PRECISION DEFAULT 5.0,
  jobs_completed INTEGER DEFAULT 0,
  specialties TEXT[],
  experience VARCHAR(100),
  certifications VARCHAR(255),
  service_area VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(20) PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
  technician_name VARCHAR(255),
  service_type VARCHAR(50) NOT NULL,
  appliance VARCHAR(100) NOT NULL,
  issue_description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  service_address VARCHAR(500) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKING COUNTER (for BK-001 style IDs)
-- ============================================

CREATE TABLE IF NOT EXISTS booking_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_count INTEGER NOT NULL DEFAULT 0
);

-- Insert initial counter row
INSERT INTO booking_counter (id, current_count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Function to get next booking ID
CREATE OR REPLACE FUNCTION next_booking_id()
RETURNS VARCHAR(20) AS $$
DECLARE
  next_num INTEGER;
BEGIN
  UPDATE booking_counter SET current_count = current_count + 1 WHERE id = 1 RETURNING current_count INTO next_num;
  RETURN 'BK-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);

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

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY — DISABLED
-- We use supabaseAdmin (service_role key) in
-- API routes, which bypasses RLS entirely.
-- Enable RLS later when adding Supabase Auth.
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_counter DISABLE ROW LEVEL SECURITY;

-- ============================================
-- SEED: Admin User
-- ============================================

INSERT INTO users (email, password, name, role, phone, rating, jobs_completed)
VALUES ('admin@servicetitan.com', 'Admin123!@#', 'Admin User', 'admin', '+639171234567', 5.0, 0)
ON CONFLICT (email) DO NOTHING;
