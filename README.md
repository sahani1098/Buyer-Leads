# Buyer Lead Intake - Minimal Scaffold

This is a minimal, runnable scaffold for the "Buyer Lead Intake" assignment (Next.js + TypeScript + Prisma/SQLite + Zod).  
It includes:

- Prisma schema + migrations (SQLite)
- Basic API routes for create/list/update/import/export
- Zod validation on server
- Simple SSR list page and form pages
- CSV import/export endpoints (server-side validation + transactional insert)
- One unit test (budget validator)
- Simple per-IP in-memory rate limit for create/update

## Quickstart (local)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize Prisma & SQLite DB:
   ```bash
   npx prisma generate
   npm run migrate
   ```

3. Run dev:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## What’s included / Notes

- `prisma/schema.prisma` contains `Buyer` and `BuyerHistory` models matching the assignment.
- Server-side validation lives in `src/lib/validators.ts` (Zod).
- API routes are under `src/app/api`.
- Import endpoint accepts CSV and validates per-row; valid rows are inserted inside a transaction.
- Ownership: `ownerId` is currently a demo value ("demo-user") — replace with proper auth.
- Rate limit: simple in-memory limiter in `src/lib/ratelimit.ts` (dev-friendly).
- Test: `tests/validators.test.ts` uses Vitest.

This is a scaffold intended to be extended; UI is intentionally minimal but functional.
