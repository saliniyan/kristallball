# Military Asset Backend (Express + MongoDB)

## Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install deps: `npm install`
3. Seed sample data: `npm run seed`
4. Start server: `npm run dev` (requires nodemon) or `npm start`

## API Endpoints (summary)

Auth:
- POST /api/auth/login { username, password }

Refs (require auth):
- GET /api/refs/bases
- GET /api/refs/equipment-types

Dashboard:
- GET /api/dashboard/summary?from&to&baseId&equipmentType
- GET /api/dashboard/net-movement-details?from&to&baseId&equipmentType

Purchases, Transfers, Assignments, Expenditures:
- GET /api/<resource>
- POST /api/<resource>  (payload documented in frontend contract)

RBAC and audit header:
- All requests (except login) require Authorization: Bearer <token>
- Mutations will receive an `x-audit-id` response header for tracking.

