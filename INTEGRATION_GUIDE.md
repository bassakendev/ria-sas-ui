# RIA SaaS - Frontend & Backend Integration Guide

## API Contracts

### 1. Authentication

#### POST /auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "company_name": "My Company"
  }
}
```

#### POST /auth/register
Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "company_name": "My Company"
}
```

Response (200): Same as login

### 2. Dashboard

#### GET /dashboard
Headers: `Authorization: Bearer {token}`

Response:
```json
{
  "total_revenue": 5000.00,
  "total_unpaid": 1500.00,
  "total_clients": 12,
  "total_invoices": 25
}
```

### 3. Clients

#### GET /clients
Headers: `Authorization: Bearer {token}`

Response:
```json
[
  {
    "id": "client_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "created_at": "2026-02-18T10:00:00Z"
  }
]
```

#### POST /clients
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

Response (201): Client object

#### PUT /clients/{id}
Same as POST

#### DELETE /clients/{id}
Headers: `Authorization: Bearer {token}`

Response: (204 No Content)

### 4. Services

#### GET /services
Headers: `Authorization: Bearer {token}`

Response:
```json
[
  {
    "id": "service_id",
    "name": "Web Development",
    "description": "Custom web development service",
    "unit_price": 100.00,
    "created_at": "2026-02-18T10:00:00Z"
  }
]
```

#### POST /services
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Web Development",
  "description": "Custom web development service",
  "unit_price": 100.00
}
```

Response (201): Service object

#### PUT /services/{id}
Same as POST

#### DELETE /services/{id}
Response: (204 No Content)

### 5. Invoices

#### GET /invoices
Headers: `Authorization: Bearer {token}`

Response:
```json
[
  {
    "id": "invoice_id",
    "invoice_number": "INV-001",
    "client_id": "client_id",
    "client": { "id", "name", "email", "phone", "address" },
    "items": [
      {
        "id": "item_id",
        "service_id": "service_id",
        "quantity": 10,
        "unit_price": 100.00,
        "total": 1000.00
      }
    ],
    "subtotal": 1000.00,
    "tax": 0.00,
    "total": 1000.00,
    "status": "draft|sent|paid|overdue",
    "due_date": "2026-03-18T00:00:00Z",
    "created_at": "2026-02-18T10:00:00Z",
    "updated_at": "2026-02-18T10:00:00Z"
  }
]
```

#### POST /invoices
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "client_id": "client_id",
  "due_date": "2026-03-18",
  "items": [
    {
      "service_id": "service_id",
      "quantity": 10,
      "unit_price": 100.00
    }
  ]
}
```

Response (201): Invoice object

#### GET /invoices/{id}
Response: Single invoice object

#### PUT /invoices/{id}
Same request/response as POST

#### PATCH /invoices/{id}/mark-paid
Response (200):
```json
{
  "status": "paid"
}
```

#### GET /invoices/{id}/download-pdf
Response: PDF file (application/pdf)

## Key Requirements

1. **Authentication**
   - Token should be JWT format
   - Include Authorization header in all protected routes
   - Return 401 for invalid/expired tokens

2. **Financial Data**
   - All amounts should be numbers (not strings)
   - Prices support 2 decimal places
   - Backend should validate and recalculate totals

3. **Dates**
   - Use ISO 8601 format (YYYY-MM-DD or ISO timestamp)
   - Timezone should be UTC

4. **Status Field** (Invoices)
   - Possible values: `draft`, `sent`, `paid`, `overdue`
   - Frontend only displays these statuses
   - Backend determines actual status

5. **CORS**
   - Allow requests from frontend origin
   - Include credentials if needed

## Frontend Implementation Details

### Axios Interceptor
- All requests automatically include `Authorization: Bearer {token}` header
- 401 responses trigger logout and redirect to /login
- Token stored in localStorage

### Form Validation
- Client-side: React Hook Form + Zod
- Server-side: Your endpoint should validate and return appropriate errors
- Error format expected:
  ```json
  {
    "message": "Validation failed",
    "errors": {
      "email": ["Invalid email format"],
      "password": ["Must be at least 6 characters"]
    }
  }
  ```

### Loading States
- Forms show loading state during submission
- Pages show loader while fetching data
- Buttons show "Loading..." while submitting

## Testing Integration

1. Start backend on `http://localhost:3001`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:3001/api` in `.env.local`
3. Start frontend: `npm run dev`
4. Navigate to `http://localhost:3000`
5. Register or login to test

## Common Issues

### CORS Error
- Ensure backend has CORS enabled
- Check that frontend origin is allowed

### 401 Errors
- Clear localStorage
- Check that token is valid
- Verify backend is returning correct token format

### Form Validation Fails
- Ensure backend returns proper error format
- Check browser console for details

### Invoice Creation Fails
- Verify client exists
- Verify services exist and are valid
- Check that quantities and prices are positive numbers
