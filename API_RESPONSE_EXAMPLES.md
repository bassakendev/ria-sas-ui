# API Response Format Examples

## Setup & Authentication

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "company_name": "ABC Corporation"
  }
}
```

## Dashboard

### GET /api/dashboard Response
```json
{
  "total_revenue": 15250.50,
  "total_unpaid": 3420.00,
  "total_clients": 8,
  "total_invoices": 24
}
```

## Clients Data

### GET /api/clients Response
```json
[
  {
    "id": "client_456def",
    "name": "John Smith",
    "email": "john.smith@company.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Business Avenue, Suite 100",
    "created_at": "2026-01-15T09:30:00Z"
  },
  {
    "id": "client_789ghi",
    "name": "Jane Doe",
    "email": "jane.doe@enterprise.com",
    "phone": "+1 (555) 987-6543",
    "address": "456 Corporate Plaza",
    "created_at": "2026-02-10T14:20:00Z"
  }
]
```

### POST /api/clients Request
```json
{
  "name": "New Client",
  "email": "client@example.com",
  "phone": "+1 (555) 123-4567",
  "address": "789 Main Street"
}
```

### POST /api/clients Response (201)
```json
{
  "id": "client_new123",
  "name": "New Client",
  "email": "client@example.com",
  "phone": "+1 (555) 123-4567",
  "address": "789 Main Street",
  "created_at": "2026-02-18T10:00:00Z"
}
```

## Services Data

### GET /api/services Response
```json
[
  {
    "id": "svc_001",
    "name": "Web Development",
    "description": "Custom web application development",
    "unit_price": 150.00,
    "created_at": "2026-01-10T08:00:00Z"
  },
  {
    "id": "svc_002",
    "name": "UI/UX Design",
    "description": "User interface and user experience design",
    "unit_price": 120.00,
    "created_at": "2026-01-12T09:15:00Z"
  },
  {
    "id": "svc_003",
    "name": "Project Management",
    "description": "Project coordination and management",
    "unit_price": 100.00,
    "created_at": "2026-02-01T10:30:00Z"
  }
]
```

### POST /api/services Request
```json
{
  "name": "Consulting",
  "description": "Strategic consulting services",
  "unit_price": 200.00
}
```

## Invoices Data

### GET /api/invoices Response
```json
[
  {
    "id": "inv_12345",
    "invoice_number": "INV-2026-001",
    "client_id": "client_456def",
    "client": {
      "id": "client_456def",
      "name": "John Smith",
      "email": "john.smith@company.com",
      "phone": "+1 (555) 123-4567",
      "address": "123 Business Avenue"
    },
    "items": [
      {
        "id": "item_a",
        "service_id": "svc_001",
        "quantity": 40,
        "unit_price": 150.00,
        "total": 6000.00
      },
      {
        "id": "item_b",
        "service_id": "svc_002",
        "quantity": 20,
        "unit_price": 120.00,
        "total": 2400.00
      }
    ],
    "subtotal": 8400.00,
    "tax": 840.00,
    "total": 9240.00,
    "status": "paid",
    "due_date": "2026-03-15T00:00:00Z",
    "created_at": "2026-02-18T09:00:00Z",
    "updated_at": "2026-02-18T14:30:00Z"
  },
  {
    "id": "inv_12346",
    "invoice_number": "INV-2026-002",
    "client_id": "client_789ghi",
    "client": {
      "id": "client_789ghi",
      "name": "Jane Doe",
      "email": "jane.doe@enterprise.com",
      "phone": "+1 (555) 987-6543",
      "address": "456 Corporate Plaza"
    },
    "items": [
      {
        "id": "item_c",
        "service_id": "svc_003",
        "quantity": 10,
        "unit_price": 100.00,
        "total": 1000.00
      }
    ],
    "subtotal": 1000.00,
    "tax": 100.00,
    "total": 1100.00,
    "status": "sent",
    "due_date": "2026-02-25T00:00:00Z",
    "created_at": "2026-02-18T10:15:00Z",
    "updated_at": "2026-02-18T10:15:00Z"
  }
]
```

### POST /api/invoices Request
```json
{
  "client_id": "client_456def",
  "due_date": "2026-03-18",
  "items": [
    {
      "service_id": "svc_001",
      "quantity": 40,
      "unit_price": 150.00
    },
    {
      "service_id": "svc_002",
      "quantity": 20,
      "unit_price": 120.00
    }
  ]
}
```

### POST /api/invoices Response (201)
```json
{
  "id": "inv_12347",
  "invoice_number": "INV-2026-003",
  "client_id": "client_456def",
  "client": {
    "id": "client_456def",
    "name": "John Smith",
    "email": "john.smith@company.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Business Avenue"
  },
  "items": [
    {
      "id": "item_d",
      "service_id": "svc_001",
      "quantity": 40,
      "unit_price": 150.00,
      "total": 6000.00
    },
    {
      "id": "item_e",
      "service_id": "svc_002",
      "quantity": 20,
      "unit_price": 120.00,
      "total": 2400.00
    }
  ],
  "subtotal": 8400.00,
  "tax": 840.00,
  "total": 9240.00,
  "status": "draft",
  "due_date": "2026-03-18T00:00:00Z",
  "created_at": "2026-02-18T11:30:00Z",
  "updated_at": "2026-02-18T11:30:00Z"
}
```

### GET /api/invoices/:id Response
Same as POST response above

### PUT /api/invoices/:id Request/Response
Same format as POST

### PATCH /api/invoices/:id/mark-paid Response (200)
```json
{
  "id": "inv_12347",
  "invoice_number": "INV-2026-003",
  "status": "paid",
  "updated_at": "2026-02-18T14:00:00Z"
}
```

### GET /api/invoices/:id/download-pdf Response
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="INV-2026-003.pdf"`
- Binary PDF file data

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 422 Validation Error
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required", "Must be valid email format"],
    "password": ["Password must be at least 6 characters"],
    "name": ["Name is required"]
  }
}
```

### 404 Not Found
```json
{
  "message": "Invoice not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

## Data Type Requirements

### Numbers
- All monetary amounts: `number` type (e.g., 150.00)
- Support 2 decimal places minimum
- No string representations of numbers

### Dates
- Format: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- Timezone: UTC
- Examples:
  - "2026-02-18T10:00:00Z"
  - "2026-03-18T00:00:00Z"

### Status Values (Invoices)
- `draft` - Not sent to client
- `sent` - Sent to client, awaiting payment
- `paid` - Payment received
- `overdue` - Payment due date passed

### Token Format
- JWT (JSON Web Token)
- Include in Authorization header: `Bearer {token}`

## Important Notes

1. **Calculations**
   - Backend should recalculate and validate totals
   - Frontend calculations are visual only
   - Item total = quantity × unit_price
   - Invoice total = subtotal + tax

2. **Required Fields**
   - Client: name, email (phone and address optional)
   - Service: name, unit_price
   - Invoice Item: service_id, quantity, unit_price
   - Invoice: client_id, due_date, items (array of at least 1 item)

3. **IDs**
   - Can be UUID, Mongo ID, or numeric ID
   - Must be unique within resource type
   - Include in responses

4. **Timestamps**
   - created_at: Set when resource created
   - updated_at: Set when resource created or modified
   - Always in UTC ISO format

5. **CORS**
   - Frontend origin: http://localhost:3000
   - Allow credentials if using cookies
   - Include in preflight responses
