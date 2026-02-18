# RIA SaaS - Frontend

Professional invoice & client management SaaS UI built with Next.js.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Configuration

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/
├── (public)/                 # Public pages
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   ├── login/page.tsx       # Login
│   ├── register/page.tsx    # Registration
│   └── pricing/page.tsx     # Pricing
├── (dashboard)/             # Protected pages (auth required)
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── dashboard/page.tsx   # Dashboard stats
│   ├── clients/page.tsx     # Clients management
│   ├── services/page.tsx    # Services management
│   └── invoices/
│       ├── page.tsx         # Invoices list
│       ├── new/page.tsx     # Create invoice
│       └── [id]/page.tsx    # Invoice detail
├── layout.tsx              # Root layout
├── globals.css             # Global styles
└── page.tsx                # Landing page routes

components/
├── ui/                      # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Alert.tsx
│   ├── Loader.tsx
│   ├── ConfirmDialog.tsx
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── forms/                   # Form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ClientForm.tsx
│   ├── ServiceForm.tsx
│   └── InvoiceForm.tsx
└── tables/                  # Table components
    ├── ClientsTable.tsx
    ├── ServicesTable.tsx
    └── InvoicesTable.tsx

lib/
├── api.ts                   # Axios client with interceptors
├── auth.ts                  # Authentication utilities
├── types.ts                 # TypeScript types
└── hooks.ts                 # Custom React hooks
```

## 🔐 Authentication Flow

1. User fills login/register form
2. Request sent to backend API
3. Backend returns JWT token
4. Token stored in localStorage
5. Axios interceptor adds token to all requests
6. 401 responses trigger logout & redirect to /login

## 📦 Pages & Features

### Public Pages
- **`/`** - Landing page with features overview
- **`/login`** - Login form
- **`/register`** - Registration form
- **`/pricing`** - Pricing page

### Protected Pages (Dashboard)
- **`/dashboard`** - Stats dashboard (Total Revenue, Unpaid, Clients, Invoices)
- **`/clients`** - Clients list with add/edit/delete
- **`/services`** - Services list with add/edit/delete
- **`/invoices`** - Invoices list
- **`/invoices/new`** - Create new invoice with dynamic items
- **`/invoices/[id]`** - Invoice detail, edit, mark paid, download PDF

## 🛠 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

## 📋 Features

✅ **Authentication**
- Login/Register
- Token-based auth
- Automatic logout on 401

✅ **Clients Management**
- List all clients
- Add new client
- Edit client
- Delete client

✅ **Services Management**
- List all services
- Add new service
- Edit service
- Delete service

✅ **Invoices Management**
- List all invoices
- Create invoice with dynamic items
- Edit invoice
- View invoice details
- Mark invoice as paid
- Download PDF
- Invoice status tracking (draft, sent, paid, overdue)

✅ **Dashboard**
- Total revenue
- Unpaid amount
- Total clients count
- Total invoices count

✅ **UI/UX**
- Responsive design
- Loading states
- Error handling
- Confirmation dialogs
- Input validation
- Form error messages

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563EB)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Gray**: Gray scale (#1F2937 to #F9FAFB)

### Components
- Button (primary, secondary, danger)
- Input fields with validation
- Select dropdowns
- Cards and sections
- Badges for status
- Alerts for messages
- Loader spinners
- Confirm dialogs
- Sidebar navigation
- Topbar header

## 📝 API Contract

### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}
→ { "token": "jwt_token", "user": {...} }
```

### Get Clients
```
GET /clients
→ [{ "id", "name", "email", "phone", "address", "created_at" }]
```

### Get Invoice
```
GET /invoices/:id
→ { 
  "id", "invoice_number", "client_id", "items", 
  "total", "status", "due_date", "created_at"
}
```

### Mark Invoice Paid
```
PATCH /invoices/:id/mark-paid
```

### Download Invoice PDF
```
GET /invoices/:id/download-pdf
```

## 🔒 Security

- Tokens stored in localStorage
- CORS configured on backend
- Automatic token injection in Axios requests
- 401 handling with automatic logout
- Form validation on client-side
- No sensitive data in frontend

## 🐛 Troubleshooting

### 401 Unauthorized errors
- Clear localStorage and login again
- Check if API URL is correct in `.env.local`
- Verify backend is running

### Form validation errors
- Check that all required fields are filled
- Ensure email format is valid
- Ensure numbers are properly formatted

### Page not loading
- Check browser console for errors
- Verify API endpoint is responding
- Check network tab in DevTools

## 🚀 Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Environment
Set `NEXT_PUBLIC_API_URL` to your production API URL

## 📚 Additional Notes

- All calculations on invoices are frontend-only (visual)
- Backend is authoritative for data
- Forms include proper error handling
- Responsive design works on mobile, tablet, desktop
- No dark mode in V1

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
