-- Migration V10: Create drivers table
-- Safe for production - Idempotent and transaction-safe
-- Created: 2025-10-16
-- Commit: feb97aa - Zero Downtime Deploy implementation
-- Fix: Corrige erro SQL "DEFAULT" não pode estar no mesmo comando ALTER TYPE

-- Create drivers table if not exists
CREATE TABLE IF NOT EXISTS drivers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    cpf VARCHAR(14),
    cnh VARCHAR(20),
    vehicle VARCHAR(255) NOT NULL,
    plate VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_deliveries INTEGER DEFAULT 0,
    last_active TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON drivers(phone);
CREATE INDEX IF NOT EXISTS idx_drivers_rating ON drivers(rating);
CREATE INDEX IF NOT EXISTS idx_drivers_created_at ON drivers(created_at);

-- If table already exists, ensure the rating column is correct
-- This is safe because it only runs if the column needs fixing
DO $$ 
BEGIN
    -- Check if rating column exists and has wrong type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' 
        AND column_name = 'rating'
        AND data_type != 'numeric'
    ) THEN
        -- Fix the column type first
        ALTER TABLE drivers ALTER COLUMN rating TYPE DECIMAL(3,2);
    END IF;
    
    -- Ensure default value is set
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' 
        AND column_name = 'rating'
    ) THEN
        -- Set default value (this is separate from type change)
        ALTER TABLE drivers ALTER COLUMN rating SET DEFAULT 0.0;
        
        -- Update NULL values to 0.0 (safe for existing data)
        UPDATE drivers SET rating = 0.0 WHERE rating IS NULL;
    END IF;
    
    -- Same for total_deliveries
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' 
        AND column_name = 'total_deliveries'
    ) THEN
        ALTER TABLE drivers ALTER COLUMN total_deliveries SET DEFAULT 0;
        UPDATE drivers SET total_deliveries = 0 WHERE total_deliveries IS NULL;
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON TABLE drivers IS 'Delivery drivers - Created by V10 migration (2025-10-16)';

