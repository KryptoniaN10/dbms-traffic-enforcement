-- Migration: 0007_blacklist_logic
-- Description: Adds check_and_blacklist() function and after_fine_insert_blacklist trigger.
--              Assumes blacklist table already exists (created in 0008_blacklist or equivalent).

-- ============================================================
-- FUNCTION: check_and_blacklist()
-- ============================================================
CREATE OR REPLACE FUNCTION check_and_blacklist()
RETURNS TRIGGER AS $$
DECLARE
    v_vehicle_id    INTEGER;
    v_total_unpaid  NUMERIC;
BEGIN
    -- Step 1: Resolve vehicle_id from the inserted fine → violation
    SELECT viol.vehicle_id
      INTO v_vehicle_id
      FROM violation viol
     WHERE viol.violation_id = NEW.violation_id;

    -- Step 2: Sum all UNPAID fines for this vehicle
    SELECT COALESCE(SUM(f.amount), 0)
      INTO v_total_unpaid
      FROM fine f
      JOIN violation viol ON viol.violation_id = f.violation_id
     WHERE viol.vehicle_id = v_vehicle_id
       AND viol.status = 'UNPAID';

    -- Step 3: If total unpaid fines exceed 10000, blacklist the vehicle
    IF v_total_unpaid > 10000 THEN

        -- Update vehicle flag (safe to re-run; no-op if already TRUE)
        UPDATE vehicle
           SET is_blacklisted = TRUE
         WHERE vehicle_id = v_vehicle_id;

        -- Insert into blacklist only if not already present
        INSERT INTO blacklist (vehicle_id, reason, blacklisted_date)
        SELECT v_vehicle_id,
               'Total unpaid fines exceeded ₹10,000 (current total: ₹' || v_total_unpaid || ')',
               CURRENT_TIMESTAMP
         WHERE NOT EXISTS (
             SELECT 1
               FROM blacklist
              WHERE vehicle_id = v_vehicle_id
         );

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: after_fine_insert_blacklist
-- ============================================================
DROP TRIGGER IF EXISTS after_fine_insert_blacklist ON fine;

CREATE TRIGGER after_fine_insert_blacklist
    AFTER INSERT ON fine
    FOR EACH ROW
    EXECUTE FUNCTION check_and_blacklist();
