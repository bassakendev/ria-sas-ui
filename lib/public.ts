import type { SubscriptionPlan } from '@/consts/subscriptions';
import apiClient from '@/lib/api';

export interface PublicPlansResponse {
  plans: SubscriptionPlan[];
}

export async function getPublicPlans(): Promise<SubscriptionPlan[]> {
  try {
    const response = await apiClient.get('/public/plans');
    return response.data.plans || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error);
    throw error;
  }
}
