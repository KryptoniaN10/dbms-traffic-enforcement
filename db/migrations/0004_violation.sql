CREATE TABLE violation (
    violation_id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(vehicle_id) ON DELETE CASCADE,
    officer_id INTEGER NOT NULL REFERENCES officer(officer_id),
    violation_type_id INTEGER NOT NULL REFERENCES violation_type(violation_type_id),
    violation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID'))
);
