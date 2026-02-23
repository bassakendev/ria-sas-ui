import apiClient from '@/lib/api';
import type { AdminSubscriptionsResponse, AdminSubscriptionSummary } from './types';

export async function getAdminSubscriptions(params?: {
  page?: number;
  limit?: number;
  plan?: 'free' | 'pro';
  status?: 'active' | 'canceled' | 'expired' | 'trialing';
}): Promise<AdminSubscriptionsResponse> {
  const response = await apiClient.get('/admin/subscriptions', { params });
  return response.data;
}

export async function cancelAdminSubscription(subscriptionId: string, reason?: string): Promise<{ message: string }>{
  const response = await apiClient.post(`/admin/subscriptions/${subscriptionId}/cancel`, { reason });
  return response.data;
}

export async function changeAdminSubscriptionPlan(
  subscriptionId: string,
  plan: 'free' | 'pro'
): Promise<AdminSubscriptionSummary> {
  const response = await apiClient.patch(`/admin/subscriptions/${subscriptionId}/plan`, { plan });
  return response.data;
}

export async function forceAdminUserPlan(
  userId: string,
  plan: 'free' | 'pro',
  reason?: string
): Promise<{ message: string }> {
  const response = await apiClient.post(`/admin/users/${userId}/assign-plan`, { plan, reason });
  return response.data;
}
