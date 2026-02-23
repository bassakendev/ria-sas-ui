import type { Invoice } from '@/consts/invoices';
import apiClient from '@/lib/api';

export interface InvoicesResponse {
  total: number;
  page: number;
  limit: number;
  invoices: Invoice[];
}

export interface InvoiceStatsResponse {
  total: number;
  paid: number;
  unpaid: number;
  draft: number;
  totalRevenue: number;
}

export async function getInvoices(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<InvoicesResponse> {
  const response = await apiClient.get('/invoices', { params });
  return response.data;
}

export async function getInvoiceStats(): Promise<InvoiceStatsResponse> {
  const response = await apiClient.get('/invoices/stats');
  return response.data;
}

export async function getInvoice(id: string): Promise<Invoice> {
  const response = await apiClient.get(`/invoices/${id}`);
  return response.data;
}

export async function createInvoice(data: Partial<Invoice>): Promise<Invoice> {
  const response = await apiClient.post('/invoices', data);
  return response.data;
}

export async function updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
  const response = await apiClient.put(`/invoices/${id}`, data);
  return response.data;
}

export async function deleteInvoice(id: string): Promise<void> {
  await apiClient.delete(`/invoices/${id}`);
}

export async function exportInvoicesCsv(params?: {
  status?: string;
  search?: string;
}): Promise<Blob> {
  const response = await apiClient.get('/invoices/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

export async function downloadInvoicesCsv(params?: {
  status?: string;
  search?: string;
}): Promise<void> {
  const csv = await exportInvoicesCsv(params);
  const url = window.URL.createObjectURL(csv);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function markInvoiceAsPaid(id: string): Promise<Invoice> {
  const response = await apiClient.patch(`/invoices/${id}/mark-paid`);
  return response.data;
}

export async function sendInvoiceEmail(id: string): Promise<Invoice> {
  const response = await apiClient.post(`/invoices/${id}/send-email`);
  return response.data;
}

export async function sendInvoiceWhatsapp(id: string): Promise<Invoice> {
  const response = await apiClient.post(`/invoices/${id}/send-whatsapp`);
  return response.data;
}

export async function getInvoicePdf(id: string): Promise<Blob> {
  const response = await apiClient.get(`/invoices/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

export async function downloadInvoicePdf(id: string, filename?: string): Promise<void> {
  const pdf = await getInvoicePdf(id);
  const url = window.URL.createObjectURL(pdf);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `invoice-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
