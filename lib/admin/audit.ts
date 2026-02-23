import apiClient from '@/lib/api';
import type { AdminAuditLogResponse } from './types';

export async function getAdminAuditLogs(params?: {
  page?: number;
  limit?: number;
  actorId?: string;
  action?: string;
}): Promise<AdminAuditLogResponse> {
  const response = await apiClient.get('/admin/audit-logs', { params });
  return response.data;
}
