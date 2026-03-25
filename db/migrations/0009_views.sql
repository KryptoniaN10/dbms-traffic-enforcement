-- Migration: 0009_views
-- Description: Creates useful views for reporting and querying the traffic violation system.

-- ============================================================
-- VIEW 1: vw_unpaid_fines
-- Shows all unpaid fines with vehicle and violation details
-- ============================================================
CREATE OR REPLACE VIEW vw_unpaid_fines AS
SELECT
    v.vehicle_id,
    v.license_plate,
    viol.violation_id,
    viol.violation_type,
    viol.violation_date,
    f.fine_id,
    f.amount,
    f.due_date
FROM vehicle v
JOIN violation viol ON viol.vehicle_id = v.vehicle_id
JOIN fine f         ON f.violation_id  = viol.violation_id
WHERE viol.status = 'UNPAID';


-- ============================================================
-- VIEW 2: vw_blacklisted_vehicles
-- Shows all blacklisted vehicles with blacklist reason and date
-- ============================================================
CREATE OR REPLACE VIEW vw_blacklisted_vehicles AS
SELECT
    v.vehicle_id,
    v.license_plate,
    v.owner_name,
    b.blacklist_id,
    b.reason,
    b.blacklisted_date
FROM vehicle v
JOIN blacklist b ON b.vehicle_id = v.vehicle_id
WHERE v.is_blacklisted = TRUE;


-- ============================================================
-- VIEW 3: vw_payment_history
-- Shows full payment history per vehicle with fine and violation context
-- ============================================================
CREATE OR REPLACE VIEW vw_payment_history AS
SELECT
    v.vehicle_id,
    v.license_plate,
    v.owner_name,
    viol.violation_id,
    viol.violation_type,
    viol.violation_date,
    f.fine_id,
    f.amount        AS fine_amount,
    f.due_date,
    p.payment_id,
    p.amount_paid,
    p.payment_date,
    p.payment_method,
    CASE
        WHEN p.payment_date > f.due_date THEN 'LATE'
        ELSE 'ON TIME'
    END AS payment_status
FROM vehicle v
JOIN violation viol ON viol.vehicle_id = v.vehicle_id
JOIN fine f         ON f.violation_id  = viol.violation_id
JOIN payment p      ON p.fine_id       = f.fine_id;


-- ============================================================
-- VIEW 4: vw_violation_summary
-- Aggregated stats per vehicle: total violations, total fines,
-- total paid, total unpaid, blacklist status
-- ============================================================
CREATE OR REPLACE VIEW vw_violation_summary AS
SELECT
    v.vehicle_id,
    v.license_plate,
    v.owner_name,
    v.is_blacklisted,
    COUNT(DISTINCT viol.violation_id)                          AS total_violations,
    COUNT(DISTINCT f.fine_id)                                  AS total_fines,
    COALESCE(SUM(f.amount), 0)                                 AS total_fine_amount,
    COALESCE(SUM(CASE WHEN viol.status = 'UNPAID'  THEN f.amount ELSE 0 END), 0) AS total_unpaid,
    COALESCE(SUM(CASE WHEN viol.status = 'PAID'    THEN f.amount ELSE 0 END), 0) AS total_paid
FROM vehicle v
LEFT JOIN violation viol ON viol.vehicle_id = v.vehicle_id
LEFT JOIN fine f         ON f.violation_id  = viol.violation_id
GROUP BY v.vehicle_id, v.license_plate, v.owner_name, v.is_blacklisted;


-- ============================================================
-- VIEW 5: vw_overdue_fines
-- Fines that are still UNPAID and have passed their due_date
-- ============================================================
CREATE OR REPLACE VIEW vw_overdue_fines AS
SELECT
    v.vehicle_id,
    v.license_plate,
    v.owner_name,
    viol.violation_id,
    viol.violation_type,
    f.fine_id,
    f.amount,
    f.due_date,
    (CURRENT_TIMESTAMP - f.due_date) AS overdue_by
FROM vehicle v
JOIN violation viol ON viol.vehicle_id = v.vehicle_id
JOIN fine f         ON f.violation_id  = viol.violation_id
WHERE viol.status = 'UNPAID'
  AND f.due_date < CURRENT_TIMESTAMP;