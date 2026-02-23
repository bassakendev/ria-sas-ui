import apiClient from '@/lib/api';
import type { AdminUsersResponse, AdminUserSummary } from './types';

export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  query?: string;
  role?: 'user' | 'admin' | 'superadmin';
  status?: 'active' | 'suspended';
}): Promise<AdminUsersResponse> {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
}

export async function updateAdminUserRole(userId: string, role: AdminUserSummary['role']): Promise<AdminUserSummary> {
  const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
}

export async function suspendAdminUser(userId: string): Promise<{ message: string }>{
  const response = await apiClient.post(`/admin/users/${userId}/suspend`);
  return response.data;
}

export async function activateAdminUser(userId: string): Promise<{ message: string }>{
  const response = await apiClient.post(`/admin/users/${userId}/activate`);
  return response.data;
}

export async function deleteAdminUser(userId: string): Promise<{ message: string }>{
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
}
