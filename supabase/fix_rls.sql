-- Run this in Supabase SQL Editor to fix RLS blocking
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_counter DISABLE ROW LEVEL SECURITY;

-- Seed the booking counter
INSERT INTO booking_counter (id, current_count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Seed admin user
INSERT INTO users (email, password, name, role, phone, rating, jobs_completed)
VALUES ('admin@servicetitan.com', 'Admin123!@#', 'Admin User', 'admin', '+639171234567', 5.0, 0)
ON CONFLICT (email) DO NOTHING;
