-- Migration: 0003_violation_type
-- Description: Creates the violation_type table to store different types of traffic offenses.

CREATE TABLE IF NOT EXISTS violation_type (
    violation_type_id SERIAL PRIMARY KEY,
    violation_name VARCHAR(100) UNIQUE NOT NULL,
    base_fine NUMERIC(10,2) NOT NULL,
    CONSTRAINT chk_base_fine_positive CHECK (base_fine > 0)
);
