# Filling Station Backend Specification

Frontend-ready API and system specification for the Filling Station Management backend.

## 1) System Overview

- **Base URL (local):** `http://localhost:5000`
- **API Prefix:** `/api/v1`
- **Health Endpoint:** `GET /health`
- **Auth Type:** JWT Bearer token
- **Content-Type:** `application/json`
- **Primary Roles:**
  - `admin`
  - `manager`
  - `attendant`

## 2) Global Request/Response Conventions

### Request Headers

- Public endpoints: no auth header required
- Protected endpoints:
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`

### Success Response Pattern

Most endpoints return:

```json
{
  "success": true,
  "data": {}
}
```

Some delete/update flows may return:

```json
{
  "success": true,
  "message": "Operation successful"
}
```

### Error Response Pattern

```json
{
  "success": false,
  "message": "Input validation failed",
  "details": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

In non-production, a `stack` field can be included.

## 3) Authentication & Authorization Specification

## JWT Flow

1. Client calls `POST /api/v1/auth/login` (or register).
2. API returns `token` and `user`.
3. Client stores token and sends it in `Authorization` header.
4. Auth middleware verifies token and loads user.
5. Role middleware enforces allowed roles for protected routes.

## Roles

- `admin`: full system access
- `manager`: operational management access
- `attendant`: shift and expense operations

## Protected Route Matrix

- **Auth**
  - `GET /api/v1/auth/me` -> any authenticated user
- **Stations**
  - `POST /api/v1/stations` -> `admin`
  - `GET /api/v1/stations` -> authenticated users
  - `GET /api/v1/stations/:id` -> authenticated users
  - `PATCH /api/v1/stations/:id` -> `admin`, `manager`
  - `DELETE /api/v1/stations/:id` -> `admin`
- **Products**
  - `POST /api/v1/products` -> `admin`, `manager`
  - `GET /api/v1/products` -> authenticated users
  - `PATCH /api/v1/products/:id` -> `admin`, `manager`
  - `DELETE /api/v1/products/:id` -> `admin`, `manager`
- **Shifts**
  - `POST /api/v1/shifts` -> `admin`, `manager`, `attendant`
  - `PATCH /api/v1/shifts/:id/close` -> `admin`, `manager`, `attendant`
  - `GET /api/v1/shifts` -> authenticated users
  - `GET /api/v1/shifts/:id` -> authenticated users
- **Sales**
  - `GET /api/v1/sales` -> `admin`, `manager`
- **Expenses**
  - `POST /api/v1/expenses` -> `admin`, `manager`, `attendant`
  - `GET /api/v1/expenses` -> authenticated users
  - `PATCH /api/v1/expenses/:id` -> `admin`, `manager`
  - `DELETE /api/v1/expenses/:id` -> `admin`, `manager`

## 4) API Endpoints by Module

## Auth Module

### POST `/api/v1/auth/register`

- **Purpose:** Create user account
- **Auth:** Public
- **Required request body:**
  - `fullName` (string, required)
  - `email` (valid email, required)
  - `password` (string, min 6 chars, required)
- **Optional body:**
  - `role` (must be one of `admin|manager|attendant`)
  - `stationId` (UUID)
- **Validation rules:**
  - `fullName` -> `notEmpty`
  - `email` -> `isEmail`
  - `password` -> `isLength({ min: 6 })`
  - `role` -> `isIn([admin, manager, attendant])`
  - `stationId` -> `isUUID`
- **Sample request JSON:**

```json
{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

### POST `/api/v1/auth/login`

- **Purpose:** Authenticate and receive JWT
- **Auth:** Public
- **Required request body:**
  - `email` (valid email)
  - `password` (string, non-empty)
- **Validation rules:**
  - `email` -> `isEmail`
  - `password` -> `notEmpty`
- **Sample request JSON:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### GET `/api/v1/auth/me`

- **Purpose:** Get currently authenticated user profile
- **Auth:** JWT required
- **Request body:** none
- **Validation rules:** none
- **Sample request JSON:** `{}` (not used)

## Stations Module

### POST `/api/v1/stations`

- **Purpose:** Create fuel station
- **Auth:** `admin`
- **Required request body:**
  - `name` (string, non-empty)
  - `location` (string, non-empty)
- **Optional body:**
  - `managerId` (UUID)
- **Validation rules:**
  - `name` -> `notEmpty`
  - `location` -> `notEmpty`
  - `managerId` -> `isUUID` (optional)
- **Sample request JSON:**

```json
{
  "name": "Main Station",
  "location": "Downtown, Block A",
  "managerId": "11111111-1111-1111-1111-111111111111"
}
```

### GET `/api/v1/stations`

- **Purpose:** List all stations
- **Auth:** authenticated users
- **Request body:** none
- **Validation rules:** none
- **Sample request JSON:** `{}`

### GET `/api/v1/stations/:id`

- **Purpose:** Get one station by ID
- **Auth:** authenticated users
- **Request body:** none
- **Validation rules:**
  - `id` path param -> `isUUID`
- **Sample request JSON:** `{}`

### PATCH `/api/v1/stations/:id`

- **Purpose:** Update station
- **Auth:** `admin`, `manager`
- **Request body:** flexible update payload
- **Validation rules:**
  - `id` path param -> `isUUID`
  - `managerId` (if supplied) -> `isUUID`
- **Sample request JSON:**

```json
{
  "name": "Main Station Updated",
  "location": "Downtown, Block B"
}
```

### DELETE `/api/v1/stations/:id`

- **Purpose:** Delete station
- **Auth:** `admin`
- **Request body:** none
- **Validation rules:**
  - `id` path param -> `isUUID`
- **Sample request JSON:** `{}`

## Products Module

### POST `/api/v1/products`

- **Purpose:** Create station product (fuel type + price)
- **Auth:** `admin`, `manager`
- **Required request body:**
  - `name` (enum: `PMS|AGO|DPK`)
  - `unitPrice` (float >= 0)
  - `stationId` (UUID)
- **Validation rules:**
  - `name` -> `isIn([PMS, AGO, DPK])`
  - `unitPrice` -> `isFloat({ min: 0 })`
  - `stationId` -> `isUUID`
- **Sample request JSON:**

```json
{
  "name": "PMS",
  "unitPrice": 850.5,
  "stationId": "22222222-2222-2222-2222-222222222222"
}
```

### GET `/api/v1/products`

- **Purpose:** List products (optionally by station)
- **Auth:** authenticated users
- **Query params (optional):**
  - `stationId` (UUID)
- **Validation rules:**
  - `stationId` -> `isUUID` (optional)
- **Sample request JSON:** `{}`

### PATCH `/api/v1/products/:id`

- **Purpose:** Update product
- **Auth:** `admin`, `manager`
- **Request body:** flexible update payload
- **Validation rules:**
  - `id` path param -> `isUUID`
  - `unitPrice` (if supplied) -> `isFloat({ min: 0 })`
- **Sample request JSON:**

```json
{
  "unitPrice": 870
}
```

### DELETE `/api/v1/products/:id`

- **Purpose:** Delete product
- **Auth:** `admin`, `manager`
- **Request body:** none
- **Validation rules:**
  - `id` path param -> `isUUID`
- **Sample request JSON:** `{}`

## Shifts Module

### POST `/api/v1/shifts`

- **Purpose:** Open a shift record
- **Auth:** `admin`, `manager`, `attendant`
- **Required request body:**
  - `stationId` (UUID)
  - `productId` (UUID)
  - `openingStock` (float >= 0)
- **Optional body:**
  - `attendantId` (UUID) - defaults to authenticated user ID
  - `shiftDate` (date)
- **Validation rules:**
  - `stationId` -> `isUUID`
  - `productId` -> `isUUID`
  - `attendantId` -> `isUUID` (optional)
  - `shiftDate` -> `isDate` (optional)
  - `openingStock` -> `isFloat({ min: 0 })`
- **Business guard:**
  - Prevents duplicate open shift for same `stationId + productId + shiftDate`
- **Sample request JSON:**

```json
{
  "stationId": "22222222-2222-2222-2222-222222222222",
  "productId": "33333333-3333-3333-3333-333333333333",
  "openingStock": 15000
}
```

### PATCH `/api/v1/shifts/:id/close`

- **Purpose:** Close shift, compute sold liters, auto-create sale, upsert stock
- **Auth:** `admin`, `manager`, `attendant`
- **Required request body:**
  - `closingStock` (float >= 0)
- **Optional body:**
  - `unitPrice` (float >= 0) - fallback is product unit price
- **Validation rules:**
  - `id` path param -> `isUUID`
  - `closingStock` -> `isFloat({ min: 0 })`
  - `unitPrice` -> `isFloat({ min: 0 })` (optional)
- **Business guards:**
  - Shift must exist
  - Shift must be open
  - `closingStock <= openingStock`
- **Sample request JSON:**

```json
{
  "closingStock": 14500,
  "unitPrice": 860
}
```

### GET `/api/v1/shifts`

- **Purpose:** List shifts with optional filters
- **Auth:** authenticated users
- **Query params (optional):**
  - `stationId` (UUID)
  - `productId` (UUID)
  - `status` (`open|closed`)
  - `fromDate` (date)
  - `toDate` (date)
- **Validation rules:**
  - `stationId` -> `isUUID`
  - `productId` -> `isUUID`
  - `status` -> `isIn([open, closed])`
  - `fromDate` -> `isDate`
  - `toDate` -> `isDate`
- **Sample request JSON:** `{}`

### GET `/api/v1/shifts/:id`

- **Purpose:** Get shift by ID
- **Auth:** authenticated users
- **Validation rules:**
  - `id` path param -> `isUUID`
- **Sample request JSON:** `{}`

## Sales Module

### GET `/api/v1/sales`

- **Purpose:** List generated sales
- **Auth:** `admin`, `manager`
- **Query params (optional):**
  - `stationId` (UUID)
  - `saleDate` (date)
- **Validation rules:**
  - `stationId` -> `isUUID`
  - `saleDate` -> `isDate`
- **Sample request JSON:** `{}`

## Expenses Module

### POST `/api/v1/expenses`

- **Purpose:** Record daily station expense
- **Auth:** `admin`, `manager`, `attendant`
- **Required request body:**
  - `stationId` (UUID)
  - `category` (string, non-empty)
  - `amount` (float >= 0)
- **Optional body:**
  - `addedBy` (UUID) - defaults to authenticated user ID
  - `expenseDate` (date)
  - `description` (string)
- **Validation rules:**
  - `stationId` -> `isUUID`
  - `addedBy` -> `isUUID` (optional)
  - `expenseDate` -> `isDate` (optional)
  - `category` -> `notEmpty`
  - `description` -> `isString` (optional)
  - `amount` -> `isFloat({ min: 0 })`
- **Sample request JSON:**

```json
{
  "stationId": "22222222-2222-2222-2222-222222222222",
  "category": "Generator Fuel",
  "description": "Top-up for generator",
  "amount": 32000
}
```

### GET `/api/v1/expenses`

- **Purpose:** List expenses
- **Auth:** authenticated users
- **Query params (optional):**
  - `stationId` (UUID)
  - `expenseDate` (date)
- **Validation rules:**
  - `stationId` -> `isUUID`
  - `expenseDate` -> `isDate`
- **Sample request JSON:** `{}`

### PATCH `/api/v1/expenses/:id`

- **Purpose:** Update expense
- **Auth:** `admin`, `manager`
- **Request body:** flexible update payload
- **Validation rules:**
  - `id` path param -> `isUUID`
  - `amount` (if supplied) -> `isFloat({ min: 0 })`
- **Sample request JSON:**

```json
{
  "amount": 30000,
  "description": "Corrected amount"
}
```

### DELETE `/api/v1/expenses/:id`

- **Purpose:** Delete expense
- **Auth:** `admin`, `manager`
- **Request body:** none
- **Validation rules:**
  - `id` path param -> `isUUID`
- **Sample request JSON:** `{}`

## 5) Response Structure Examples (By Module)

## Auth Response Example

```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid",
      "fullName": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "stationId": null,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

## Stations Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "station-uuid",
      "name": "Main Station",
      "location": "Downtown",
      "managerId": "manager-uuid",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "manager": {
        "id": "manager-uuid",
        "fullName": "Station Manager",
        "email": "manager@example.com",
        "role": "manager"
      }
    }
  ]
}
```

## Products Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "product-uuid",
      "name": "PMS",
      "unitPrice": "860.00",
      "stationId": "station-uuid",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

## Shifts Response Example

```json
{
  "success": true,
  "data": {
    "id": "shift-uuid",
    "stationId": "station-uuid",
    "productId": "product-uuid",
    "attendantId": "user-uuid",
    "shiftDate": "2026-04-28",
    "openingStock": "15000.00",
    "closingStock": "14500.00",
    "fuelSold": "500.00",
    "status": "closed"
  }
}
```

## Sales Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "sale-uuid",
      "stationId": "station-uuid",
      "productId": "product-uuid",
      "shiftId": "shift-uuid",
      "litersSold": "500.00",
      "unitPrice": "860.00",
      "totalAmount": "430000.00",
      "saleDate": "2026-04-28",
      "product": {
        "id": "product-uuid",
        "name": "PMS"
      },
      "station": {
        "id": "station-uuid",
        "name": "Main Station"
      }
    }
  ]
}
```

## Expenses Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "expense-uuid",
      "stationId": "station-uuid",
      "addedBy": "user-uuid",
      "expenseDate": "2026-04-28",
      "category": "Generator Fuel",
      "description": "Top-up",
      "amount": "32000.00"
    }
  ]
}
```

## 6) Database Model Specification

## `users` table (User)

- `id` -> UUID, PK, default UUIDV4
- `fullName` -> STRING(120), required
- `email` -> STRING(120), required, unique, email format
- `password` -> STRING(120), required, hashed with bcrypt hook
- `role` -> ENUM(`admin`, `manager`, `attendant`), default `attendant`
- `stationId` -> UUID, nullable (FK to stations)
- `createdAt`, `updatedAt` -> managed by Sequelize

## `stations` table (Station)

- `id` -> UUID, PK
- `name` -> STRING(120), required
- `location` -> STRING(200), required
- `managerId` -> UUID, nullable (FK to users)
- `createdAt`, `updatedAt`

## `products` table (Product)

- `id` -> UUID, PK
- `name` -> ENUM(`PMS`, `AGO`, `DPK`), required
- `unitPrice` -> DECIMAL(12,2), required, min 0
- `stationId` -> UUID, required (FK to stations)
- Unique index -> `(stationId, name)`
- `createdAt`, `updatedAt`

## `shifts` table (Shift)

- `id` -> UUID, PK
- `stationId` -> UUID, required (FK to stations)
- `productId` -> UUID, required (FK to products)
- `attendantId` -> UUID, required (FK to users)
- `shiftDate` -> DATEONLY, required
- `openingStock` -> DECIMAL(12,2), required
- `closingStock` -> DECIMAL(12,2), nullable
- `fuelSold` -> DECIMAL(12,2), nullable
- `status` -> ENUM(`open`, `closed`), default `open`
- `createdAt`, `updatedAt`

## `sales` table (Sale)

- `id` -> UUID, PK
- `stationId` -> UUID, required (FK to stations)
- `productId` -> UUID, required (FK to products)
- `shiftId` -> UUID, required, unique (FK to shifts)
- `litersSold` -> DECIMAL(12,2), required
- `unitPrice` -> DECIMAL(12,2), required
- `totalAmount` -> DECIMAL(14,2), required
- `saleDate` -> DATEONLY, required
- `createdAt`, `updatedAt`

## `expenses` table (Expense)

- `id` -> UUID, PK
- `stationId` -> UUID, required (FK to stations)
- `addedBy` -> UUID, required (FK to users)
- `expenseDate` -> DATEONLY, required
- `category` -> STRING(80), required
- `description` -> STRING(255), nullable
- `amount` -> DECIMAL(14,2), required, min 0
- `createdAt`, `updatedAt`

## `stocks` table (Stock)

- `id` -> UUID, PK
- `stationId` -> UUID, required (FK to stations)
- `productId` -> UUID, required (FK to products)
- `stockDate` -> DATEONLY, required
- `quantity` -> DECIMAL(12,2), required
- Unique index -> `(stationId, productId, stockDate)`
- `createdAt`, `updatedAt`

## Relationships

- Station `hasMany` Users (`users.stationId`)
- User `belongsTo` Station (`station`)
- Station `belongsTo` User as `manager` (`stations.managerId`)
- User `hasMany` Stations as `managedStations`
- Station `hasMany` Products
- Station `hasMany` Shifts
- Shift `belongsTo` Product
- Shift `belongsTo` User as `attendant`
- Station `hasMany` Sales
- Sale `belongsTo` Product
- Sale `belongsTo` Shift
- Station `hasMany` Expenses
- Expense `belongsTo` User as `addedByUser`
- Station `hasMany` Stocks
- Stock `belongsTo` Product

## 7) Business Logic Flow

## Shift Lifecycle

1. User opens shift with station, product, opening stock.
2. System checks no open duplicate for same station/product/date.
3. Shift is created with `status = open`.
4. On close request, system validates:
   - shift exists
   - shift not already closed
   - closing stock is not greater than opening stock
5. System computes `fuelSold = openingStock - closingStock`.
6. Shift updates to `status = closed`, with closing stock and sold liters.

## Sales Calculation

On closing shift (transactional flow):

1. Determine unit price:
   - use request `unitPrice` if provided
   - else fallback to current product `unitPrice`
2. Create `Sale`:
   - `litersSold = fuelSold`
   - `totalAmount = litersSold * unitPrice`
   - linked to `shiftId` (unique one-to-one with shift)
3. Upsert `Stock` for that station/product/date with `quantity = closingStock`

This entire close operation runs in a Sequelize transaction to keep data consistent.

## Expense Recording

1. Authorized user submits expense payload.
2. If `addedBy` is omitted, API uses authenticated user ID.
3. Expense is stored with station, category, amount, date, description.
4. Managers/admins can edit or delete existing expense records.

## 8) Frontend Integration Notes (Lovable/UI-UX Ready)

- Use centralized API client with:
  - Base URL env var
  - Bearer token interceptor
  - standard error parser for `{ success, message, details }`
- Suggested UX blocks:
  - Auth pages (`register`, `login`)
  - Station dashboard
  - Product pricing manager
  - Shift open/close workflow with stock calculator
  - Sales reports (filters: date, station)
  - Expense ledger (create, list, edit, delete)
- Recommended frontend enums:
  - Roles: `admin`, `manager`, `attendant`
  - Fuel types: `PMS`, `AGO`, `DPK`
  - Shift status: `open`, `closed`
