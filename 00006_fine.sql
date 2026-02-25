-- Migration: 0006_fine
-- Description: Creates the fine table to store calculated fines for each violation.

CREATE TABLE IF NOT EXISTS fine (
    fine_id SERIAL PRIMARY KEY,
    violation_id INT UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,

    CONSTRAINT fk_fine_violation
        FOREIGN KEY (violation_id)
        REFERENCES violation(violation_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_amount_positive
        CHECK (amount > 0),

    CONSTRAINT chk_due_after_issue
        CHECK (due_date >= issued_date)
);