import apiClient from '@/lib/api';

/**
 * Export - API functions for CSV exports
 * Centralized export (download) functionality
 */

/**
 * Export clients to CSV
 */
export async function exportClientsCsv(params?: {
  search?: string;
}): Promise<Blob> {
  const response = await apiClient.get('/clients/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Download clients CSV file
 */
export async function downloadClientsCsv(params?: {
  search?: string;
}): Promise<void> {
  const csv = await exportClientsCsv(params);
  const url = window.URL.createObjectURL(csv);
  const link = document.createElement('a');
  link.href = url;
  link.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Export invoices to CSV
 */
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

/**
 * Download invoices CSV file
 */
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

/**
 * Export all invoices from dashboard
 */
export async function exportDashboardInvoices(): Promise<Blob> {
  const response = await apiClient.get('/dashboard/export-invoices', {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Download dashboard invoices export
 */
export async function downloadDashboardInvoices(): Promise<void> {
  const csv = await exportDashboardInvoices();
  const url = window.URL.createObjectURL(csv);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dashboard-invoices-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
