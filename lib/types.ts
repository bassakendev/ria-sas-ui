// User & Auth
export interface User {
  id: string;
  email: string;
  company_name: string;
}

// Clients
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

// Services
export interface Service {
  id: string;
  name: string;
  description?: string;
  unit_price: number;
  created_at: string;
}

// Invoices
export interface InvoiceItem {
  id?: string;
  service_id: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client?: Client;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_revenue: number;
  total_unpaid: number;
  total_clients: number;
  total_invoices: number;
}

// API Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
