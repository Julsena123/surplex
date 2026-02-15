# Surplex Vehicle Tracker

Next.js + Prisma + SQLite app for vehicle auction workflows.

## Setup
1. `npm install`
2. `npm run prisma:migrate -- --name init`
3. `npm run prisma:seed`
4. `npm run dev`

## Features
- Vehicle CRUD with status auto-compute (PENDING/SOLD/NOT_SOLD)
- Image uploads saved under `public/uploads`
- Reminder center (today/week/overdue), browser notifications, and ICS export
- Excel import (`/api/import/excel`) from Sheet1 with exact header mapping
- CSV export (`/api/export/csv`) with original headers + new columns
- Dashboard KPIs and next auction deadlines

## Notes
- Browser notifications require permission and a tab open.
- SQLite DB file is at `prisma/dev.db`.
