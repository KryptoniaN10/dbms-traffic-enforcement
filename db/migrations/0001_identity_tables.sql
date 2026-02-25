-- Migration: 0001_identity_tables
-- Description: Creates the base identity tables for owners and officers.

-- Create owner table
CREATE TABLE IF NOT EXISTS owner (
    owner_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE,
    address TEXT,
    license_number VARCHAR(25) UNIQUE NOT NULL,
    license_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT chk_license_status CHECK (license_status IN ('ACTIVE', 'SUSPENDED'))
);

-- Create officer table
CREATE TABLE IF NOT EXISTS officer (
    officer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    badge_number VARCHAR(20) UNIQUE NOT NULL,
    assigned_area VARCHAR(100)
);
