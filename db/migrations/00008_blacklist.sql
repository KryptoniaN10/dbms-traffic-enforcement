-- Migration: 0008_blacklist
-- Description: Creates the blacklist table to store blacklisted vehicles.

CREATE TABLE IF NOT EXISTS blacklist (
    blacklist_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    blacklisted_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_blacklist_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicle(vehicle_id)
        ON DELETE CASCADE
);