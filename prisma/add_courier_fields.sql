-- Add new fields to couriers table
ALTER TABLE couriers 
ADD COLUMN IF NOT EXISTS vehicle_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS id_card TEXT;
