import apiClient from '@/lib/api';

export interface SubscriptionPlanAdmin {
  id: string;
  code: string; // slug/identifiant unique du plan
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    clients?: number;
    invoices?: number;
    storage?: number;
  };
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminPlansResponse {
  plans: SubscriptionPlanAdmin[];
  total: number;
}

/**
 * Get all subscription plans (Admin)
 * GET /api/admin/plans
 */
export async function getAdminPlans(): Promise<AdminPlansResponse> {
  const response = await apiClient.get('/admin/plans');
  return response.data;
}

/**
 * Get single plan details (Admin)
 * GET /api/admin/plans/{plan}
 */
export async function getAdminPlan(planId: string): Promise<SubscriptionPlanAdmin> {
  const response = await apiClient.get(`/admin/plans/${planId}`);
  return response.data;
}

/**
 * Create new subscription plan (SuperAdmin only)
 * POST /api/admin/plans
 */
export async function createAdminPlan(data: Omit<SubscriptionPlanAdmin, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlanAdmin> {
  const response = await apiClient.post('/admin/plans', data);
  return response.data;
}

/**
 * Update subscription plan (Admin & SuperAdmin)
 * PATCH /api/admin/plans/{plan}
 */
export async function updateAdminPlan(planId: string, data: Partial<SubscriptionPlanAdmin>): Promise<SubscriptionPlanAdmin> {
  const response = await apiClient.patch(`/admin/plans/${planId}`, data);
  return response.data;
}

/**
 * Delete subscription plan (SuperAdmin only)
 * DELETE /api/admin/plans/{plan}
 */
export async function deleteAdminPlan(planId: string): Promise<void> {
  await apiClient.delete(`/admin/plans/${planId}`);
}
