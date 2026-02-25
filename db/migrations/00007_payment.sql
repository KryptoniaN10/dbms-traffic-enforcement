-- Migration: 0007_payment
-- Description: Creates the payment table to record fine payments.

CREATE TABLE IF NOT EXISTS payment (
    payment_id SERIAL PRIMARY KEY,
    fine_id INT NOT NULL,
    amount_paid NUMERIC(10,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20) NOT NULL,

    CONSTRAINT fk_payment_fine
        FOREIGN KEY (fine_id)
        REFERENCES fine(fine_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_amount_paid_positive
        CHECK (amount_paid > 0),

    CONSTRAINT chk_payment_method_valid
        CHECK (payment_method IN ('CASH', 'CARD', 'UPI', 'NETBANKING'))
);