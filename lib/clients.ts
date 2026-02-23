import type { Client } from '@/consts/clients';
import apiClient from '@/lib/api';

export interface ClientsResponse {
  total: number;
  page: number;
  limit: number;
  clients: Client[];
}

export interface ClientStatsResponse {
  total: number;
  active: number;
  totalRevenue: number;
  averageInvoices: number;
}

export async function getClients(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ClientsResponse> {
  const response = await apiClient.get('/clients', { params });
  return response.data;
}

export async function getClientStats(): Promise<ClientStatsResponse> {
  const response = await apiClient.get('/clients/stats');
  return response.data;
}

export async function getClient(id: string): Promise<Client> {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data;
}

export async function createClient(data: Partial<Client>): Promise<Client> {
  const response = await apiClient.post('/clients', data);
  return response.data;
}

export async function updateClient(id: string, data: Partial<Client>): Promise<Client> {
  const response = await apiClient.put(`/clients/${id}`, data);
  return response.data;
}

export async function deleteClient(id: string): Promise<void> {
  await apiClient.delete(`/clients/${id}`);
}

export async function exportClientsCsv(params?: {
  search?: string;
}): Promise<Blob> {
  const response = await apiClient.get('/clients/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

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
