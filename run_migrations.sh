#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Default connection variables (can be overridden by environment variables)
DB_USER=${DB_USER:-traffic_user}
DB_NAME=${DB_NAME:-traffic_system}
export PGPASSWORD=${DB_PASS:-traffic_pass}

MIGRATIONS_DIR="./db/migrations"

echo "Connecting to database $DB_NAME as $DB_USER inside Docker container..."

# 1. Ensure the schema_migrations table exists
docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW()
);
"

echo "Checking for new migrations in $MIGRATIONS_DIR..."

# 2. Loop through all .sql files in the migrations directory in sorted order
for file in $(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
    if [ ! -f "$file" ]; then
        echo "No migration files found in $MIGRATIONS_DIR."
        break
    fi

    filename=$(basename "$file")

    # 3. Check if the migration has already been executed
    is_executed=$(docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM schema_migrations WHERE filename = '$filename';")

    if [ "$is_executed" == "1" ]; then
        echo "Skipping $filename (already executed)"
    else
        echo "Executing $filename..."
        
        # 4. Run the migration file and record it in a single transaction
        # We pipe the file content into the container's psql
        cat "$file" | docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -c "
        BEGIN;
        $(cat "$file")
        INSERT INTO schema_migrations (filename) VALUES ('$filename');
        COMMIT;
        "
        
        echo "Successfully applied $filename"
    fi
done

echo "All migrations applied successfully."
