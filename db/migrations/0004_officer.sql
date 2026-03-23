-- Migration: 0004_officer
-- Description: Creates the officer table to store traffic police details.

CREATE TABLE IF NOT EXISTS officer (
    officer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    assigned_area VARCHAR(100)
);