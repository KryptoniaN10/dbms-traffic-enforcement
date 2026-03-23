-- Migration: 0009_users
-- Description: Creates the users table to control system access (RBAC).

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,

    CONSTRAINT chk_role_valid
        CHECK (role IN ('ADMIN', 'OFFICER', 'CLERK'))
);