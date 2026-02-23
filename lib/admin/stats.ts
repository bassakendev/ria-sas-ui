import apiClient from '@/lib/api';
import type { AdminStatsResponse } from './types';

export async function getAdminStats(period: 'week' | 'month' | 'year' = 'week'): Promise<AdminStatsResponse> {
  const response = await apiClient.get(`/admin/stats`, { params: { period } });
  return response.data;
}
