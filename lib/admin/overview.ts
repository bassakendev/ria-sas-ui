import apiClient from '@/lib/api';
import type { AdminOverviewResponse } from './types';

export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  const response = await apiClient.get('/admin/overview');
  return response.data;
}
