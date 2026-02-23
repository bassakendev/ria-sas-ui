import apiClient from '@/lib/api';
import type { AdminSettingsResponse } from './types';

export async function getAdminSettings(): Promise<AdminSettingsResponse> {
  const response = await apiClient.get('/admin/settings');
  return response.data;
}

export async function updateAdminSettings(payload: Partial<AdminSettingsResponse>): Promise<AdminSettingsResponse> {
  const response = await apiClient.patch('/admin/settings', payload);
  return response.data;
}
