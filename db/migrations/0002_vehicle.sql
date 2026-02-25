-- Migration: 0002_vehicle
-- Description: Creates the vehicle table linked to the owner table.

CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES owner(owner_id) ON DELETE CASCADE,
    vehicle_type VARCHAR(30) NOT NULL,
    model VARCHAR(50),
    color VARCHAR(30),
    is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE
);
