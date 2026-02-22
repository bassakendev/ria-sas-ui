/**
 * CSV Export Utilities
 * Functions to request CSV exports from the backend
 */

import { getToken } from './auth';

/**
 * Download a blob as a file
 * @param blob Blob to download
 * @param filename Name of the file (with extension)
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export invoices to CSV from backend
 * @param filters Optional filters to apply (search term, status filter)
 */
export async function exportInvoicesCSV(filters?: {
  search?: string;
  status?: string;
}): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);

  const response = await fetch(`/api/invoices/export?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'export des factures');
  }

  const blob = await response.blob();
  const filename = `factures_${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(blob, filename);
}

/**
 * Export clients to CSV from backend
 * @param filters Optional filters to apply (search term, status filter)
 */
export async function exportClientsCSV(filters?: {
  search?: string;
  status?: string;
}): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);

  const response = await fetch(`/api/clients/export?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'export des clients');
  }

  const blob = await response.blob();
  const filename = `clients_${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(blob, filename);
}

/**
 * Export recent invoices (dashboard) to CSV from backend
 */
export async function exportDashboardInvoicesCSV(): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch('/api/dashboard/export-invoices', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'export des factures récentes');
  }

  const blob = await response.blob();
  const filename = `dashboard_factures_recentes_${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(blob, filename);
}
