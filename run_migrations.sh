#!/bin/bash

set -e

DB_USER=${DB_USER:-traffic_user}
DB_NAME=${DB_NAME:-traffic_system}
export PGPASSWORD=${DB_PASS:-traffic_pass}

MIGRATIONS_DIR="./db/migrations"

echo "Connecting to database $DB_NAME as $DB_USER inside Docker container..."

# Wait for DB readiness
for i in {1..30}; do
  if docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW()
);
"

shopt -s nullglob
mapfile -t migration_files < <(printf '%s\n' "$MIGRATIONS_DIR"/*.sql | sort -V)

for file in "${migration_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "No migration files found in $MIGRATIONS_DIR."
        break
    fi

    filename=$(basename "$file")

    if [[ "$filename" == *"test_query.sql" ]]; then
        echo "Skipping $filename (test helper script)"
        continue
    fi

    is_executed=$(docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM schema_migrations WHERE filename = '$filename';")

    if [ "$is_executed" == "1" ]; then
        echo "Skipping $filename (already executed)"
    else
        echo "Executing $filename..."

        docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 < "$file"
        docker compose exec -T -e PGPASSWORD="$PGPASSWORD" db psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -c "INSERT INTO schema_migrations (filename) VALUES ('$filename');"

        echo "Successfully applied $filename"
    fi
done

echo "All migrations applied successfully."
