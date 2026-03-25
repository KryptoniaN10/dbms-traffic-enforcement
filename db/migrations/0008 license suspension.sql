-- Migration: 0008_license_suspension
-- Description: Adds check_license_suspension() function and
--              after_violation_insert_suspend trigger.

-- ============================================================
-- FUNCTION: check_license_suspension()
-- ============================================================
CREATE OR REPLACE FUNCTION check_license_suspension()
RETURNS TRIGGER AS $$
DECLARE
    v_owner_id        INTEGER;
    v_violation_count INTEGER;
BEGIN
    -- Step 1: Resolve owner_id from the inserted violation → vehicle
    SELECT v.owner_id
      INTO v_owner_id
      FROM vehicle v
     WHERE v.vehicle_id = NEW.vehicle_id;

    -- Step 2: Count ALL violations across every vehicle owned by this owner
    SELECT COUNT(*)
      INTO v_violation_count
      FROM violation viol
      JOIN vehicle v ON v.vehicle_id = viol.vehicle_id
     WHERE v.owner_id = v_owner_id;

    -- Step 3: Suspend only if threshold reached AND license is currently ACTIVE
    IF v_violation_count >= 5 THEN
        UPDATE owner
           SET license_status = 'SUSPENDED'
         WHERE owner_id = v_owner_id
           AND license_status = 'ACTIVE';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: after_violation_insert_suspend
-- ============================================================
DROP TRIGGER IF EXISTS after_violation_insert_suspend ON violation;

CREATE TRIGGER after_violation_insert_suspend
    AFTER INSERT ON violation
    FOR EACH ROW
    EXECUTE FUNCTION check_license_suspension();