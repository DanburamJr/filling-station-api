# Filling Station Management API

Production-ready backend API built with Node.js, Express, PostgreSQL, and Sequelize.

## Project Structure

- `controllers/`
- `routes/`
- `models/`
- `middleware/`
- `config/`
- `services/`
- `utils/`
- `app.js`
- `server.js`

## Setup

1. Copy `.env.example` to `.env`
2. Update database and JWT values
3. Install dependencies:
   - `npm install`
4. Start development server:
   - `npm run dev`

## Main Endpoints (`/api/v1`)

- Auth
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
- Stations
  - `POST /stations`
  - `GET /stations`
  - `GET /stations/:id`
  - `PATCH /stations/:id`
  - `DELETE /stations/:id`
- Products
  - `POST /products`
  - `GET /products?stationId=...`
  - `PATCH /products/:id`
  - `DELETE /products/:id`
- Shifts
  - `POST /shifts` (open shift)
  - `PATCH /shifts/:id/close` (close shift + auto-generate sale)
  - `GET /shifts`
  - `GET /shifts/:id`
- Sales
  - `GET /sales`
- Expenses
  - `POST /expenses`
  - `GET /expenses`
  - `PATCH /expenses/:id`
  - `DELETE /expenses/:id`

## Notes

- JWT bearer authentication is required for protected routes.
- Role-based authorization is enforced (`admin`, `manager`, `attendant`).
- Closing a shift automatically computes `fuelSold` and creates a `Sale`.
