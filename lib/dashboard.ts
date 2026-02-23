import type { Invoice } from '@/consts/invoices';
import apiClient from '@/lib/api';

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
  averageInvoiceValue: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentInvoices: Invoice[];
  chartData: Array<{
    date: string;
    revenue: number;
    invoices: number;
  }>;
}

export async function getDashboardData(): Promise<DashboardResponse> {
  const response = await apiClient.get('/dashboard');
  return response.data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
}

export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  const response = await apiClient.get('/dashboard/recent-invoices', { params: { limit } });
  return response.data;
}

export async function getRevenueChartData(period = '30d'): Promise<Array<{ date: string; revenue: number; invoices: number }>> {
  const response = await apiClient.get('/dashboard/revenue-chart', { params: { period } });
  return response.data;
}
