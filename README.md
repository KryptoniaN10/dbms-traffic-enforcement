# Smart Traffic Violation and Enforcement Management System

This project now includes:
- PostgreSQL database with migration scripts
- Node.js backend API with JWT auth
- React frontend with a modern CRUD dashboard
- Docker Compose orchestration for all services

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Run the full stack

```bash
docker compose up -d --build
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5433

## Apply migrations

```bash
bash run_migrations.sh
```

## Useful commands

```bash
docker compose logs -f
docker compose stop
docker compose down
docker exec -it traffic_db psql -U traffic_user -d traffic_system
```

## API summary

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Protected CRUD:
  - `GET/POST /api/:resource`
  - `GET/PUT/DELETE /api/:resource/:id`

Available resources:
`owners`, `officers`, `vehicles`, `violation-types`, `violations`, `fines`, `payments`, `blacklist`
