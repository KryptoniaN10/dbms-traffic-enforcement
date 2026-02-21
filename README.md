# Smart Traffic Violation and Enforcement Management System

This project uses a Dockerized PostgreSQL database to ensure a deterministic and reproducible development environment for the team.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Database Commands

### Start the database
Run the database in the background:
```bash
docker-compose up -d
```

### Stop the database
Stop the container without deleting the data:
```bash
docker-compose stop
```
*(To stop and remove the container, use `docker-compose down`)*

### Connect using psql
Connect to the running database container using the `psql` CLI:
```bash
docker exec -it traffic_db psql -U traffic_user -d traffic_system
```

## Project Structure
- `/db/migrations`: Schema evolution scripts (tables, alters).
- `/db/schema`: Base schema definitions (if separated from migrations).
- `/db/functions`: Stored procedures and functions.
- `/db/triggers`: Business automation triggers.
- `/db/seeds`: Sample data for testing.
