-- Create fine table
CREATE TABLE fine (
    fine_id SERIAL PRIMARY KEY,
    violation_id INTEGER UNIQUE NOT NULL REFERENCES violation(violation_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    issued_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL
);

-- Create function generate_fine
CREATE OR REPLACE FUNCTION generate_fine()
RETURNS TRIGGER AS $$
DECLARE
    v_base_fine NUMERIC(10,2);
    v_prev_count INTEGER;
    v_final_amount NUMERIC(10,2);
BEGIN
    -- Get base_fine from violation_type
    SELECT base_fine INTO v_base_fine
    FROM violation_type
    WHERE violation_type_id = NEW.violation_type_id;

    -- Count previous violations for same vehicle and same violation type
    -- Exclude current row using violation_id < NEW.violation_id
    SELECT COUNT(*) INTO v_prev_count
    FROM violation
    WHERE vehicle_id = NEW.vehicle_id
      AND violation_type_id = NEW.violation_type_id
      AND violation_id < NEW.violation_id;

    -- Apply repeat offense multiplier if prior offense exists
    IF v_prev_count >= 1 THEN
        v_final_amount := v_base_fine * 1.5;
    ELSE
        v_final_amount := v_base_fine;
    END IF;

    -- Insert into fine table
    INSERT INTO fine (violation_id, amount, due_date)
    VALUES (
        NEW.violation_id,
        v_final_amount,
        CURRENT_TIMESTAMP + INTERVAL '30 days'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger after_violation_insert
CREATE TRIGGER after_violation_insert
AFTER INSERT ON violation
FOR EACH ROW
EXECUTE FUNCTION generate_fine();
