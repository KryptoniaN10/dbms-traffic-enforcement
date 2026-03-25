-- Migration: 0010_mark_violation_paid
-- Description: Creates mark_violation_paid() function and
--              after_payment_insert_update_status trigger.

-- ============================================================
-- FUNCTION: mark_violation_paid()
-- ============================================================
CREATE OR REPLACE FUNCTION mark_violation_paid()
RETURNS TRIGGER AS $$
DECLARE
    v_violation_id INTEGER;
BEGIN
    -- Step 1: Resolve violation_id from the inserted payment → fine
    SELECT violation_id
      INTO v_violation_id
      FROM fine
     WHERE fine_id = NEW.fine_id;

    -- Step 2: Mark violation as PAID only if currently UNPAID
    UPDATE violation
       SET status = 'PAID'
     WHERE violation_id = v_violation_id
       AND status = 'UNPAID';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: after_payment_insert_update_status
-- ============================================================
DROP TRIGGER IF EXISTS after_payment_insert_update_status ON payment;

CREATE TRIGGER after_payment_insert_update_status
    AFTER INSERT ON payment
    FOR EACH ROW
    EXECUTE FUNCTION mark_violation_paid();