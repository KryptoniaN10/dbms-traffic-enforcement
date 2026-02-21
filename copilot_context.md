You are assisting in building a university DBMS project named Smart Traffic Violation and Enforcement Management System.

Architecture rules:

Database‑first design

PostgreSQL is the primary backend logic engine

Business logic lives inside SQL (constraints, functions, triggers, views)

API (Node.js) and frontend (React) will be added later

The database must remain normalized (no redundant columns)

Prefer constraints over triggers, triggers over manual updates

Every change must be migration‑based and reproducible

Project goals:
The system manages vehicles, owners, officers, violations, fines and payments.
It automatically handles repeat offenses, late penalties, blacklisting and license suspension.

Important requirements:

Team project → deterministic setup (everyone runs same DB)

No manual DB editing

Everything reproducible via Docker + migrations

Clean folder structure for future API integration

Folder philosophy:
migrations = schema evolution
functions = stored procedures
triggers = business automation
seeds = sample data

You must generate minimal safe code only. Avoid over‑engineering and avoid adding frameworks unless asked.