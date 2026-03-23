-- Migration: 0005_violation
-- Description: Creates the violation table to record each traffic offense event.

CREATE TABLE IF NOT EXISTS violation (
    violation_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    officer_id INT NOT NULL,
    violation_type_id INT NOT NULL,
    violation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(150) NOT NULL,
    status VARCHAR(10) NOT NULL,

    CONSTRAINT fk_violation_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicle(vehicle_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_violation_officer
        FOREIGN KEY (officer_id)
        REFERENCES officer(officer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_violation_type
        FOREIGN KEY (violation_type_id)
        REFERENCES violation_type(violation_type_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_status_valid
        CHECK (status IN ('PAID', 'UNPAID'))
);