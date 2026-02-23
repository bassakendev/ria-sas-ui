/**
 * Subscription API - Appels API pour la gestion des souscriptions
 * 
 * Endpoints:
 * GET    /api/subscription              - Obtenir la souscription actuelle
 * GET    /api/subscription/plans        - Lister tous les plans disponibles
 * POST   /api/subscription/upgrade      - Upgrader vers un plan
 * POST   /api/subscription/downgrade    - Downgrader vers un plan
 * POST   /api/subscription/cancel       - Annuler la souscription
 * POST   /api/subscription/reactivate   - Réactiver la souscription
 * GET    /api/subscription/invoices     - Historique des factures
 * GET    /api/subscription/usage        - Utilisation actuelle
 */

import {
    PlanType,
    SubscriptionPlan,
    subscriptionPlans,
    UserSubscription
} from '@/consts/subscriptions';
import { API_BASE_URL } from './api';

/**
 * Interface pour la réponse de souscription
 */
export interface SubscriptionResponse {
    subscription: UserSubscription;
    plan: SubscriptionPlan;
}

/**
 * Interface pour les factures
 */
export interface Invoice {
    id: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    invoiceDate: string;
    dueDate: string;
    paidDate?: string;
    pdfUrl?: string;
}

/**
 * Interface pour l'utilisation
 */
export interface UsageStats {
    invoicesThisMonth: number;
    invoicesLimit: number;
    clientsCreated: number;
    clientsLimit: number;
    storageUsed: string;
    storageLimit: string;
    percentageUsed: number;
}

/**
 * Obtenir la souscription actuelle de l'utilisateur
 * GET /api/subscription
 * 
 * @returns Promise<SubscriptionResponse>
 * 
 * @example
 * const { subscription, plan } = await getCurrentSubscription();
 * console.log(`Plan: ${subscription.plan}, Statut: ${subscription.status}`);
 */
export async function getCurrentSubscription(): Promise<SubscriptionResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const subscription = await response.json();
        return {
            subscription,
            plan: subscriptionPlans[subscription.plan as PlanType],
        };
    } catch (error) {
        console.error('Erreur lors de la récupération de la souscription:', error);
        throw error;
    }
}

/**
 * Lister tous les plans disponibles
 * GET /api/subscription/plans
 * 
 * @returns Promise<SubscriptionPlan[]>
 * 
 * @example
 * const plans = await getAvailablePlans();
 * plans.forEach(plan => console.log(plan.name));
 */
export async function getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/plans`);

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des plans:', error);
        throw error;
    }
}

/**
 * Upgrader vers un nouveau plan
 * POST /api/subscription/upgrade
 * 
 * @param planId - ID du nouveau plan
 * @param billingPeriod - Période de facturation (month ou year)
 * @returns Promise<SubscriptionResponse>
 * 
 * @example
 * const result = await upgradePlan('pro', 'month');
 * console.log(`Vous êtes maintenant sur le plan ${result.plan.name}`);
 */
export async function upgradePlan(
    planId: PlanType,
    billingPeriod: 'month' | 'year' = 'month'
): Promise<SubscriptionResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
                planId,
                billingPeriod,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const subscription = await response.json();
        return {
            subscription,
            plan: subscriptionPlans[subscription.plan as PlanType],
        };
    } catch (error) {
        console.error('Erreur lors de l\'upgrade:', error);
        throw error;
    }
}

/**
 * Downgrader vers un plan inférieur
 * POST /api/subscription/downgrade
 * 
 * @param planId - ID du nouveau plan
 * @param effectiveDate - Date effective du downgrade (null = immédiat)
 * @returns Promise<SubscriptionResponse>
 * 
 * @example
 * const result = await downgradePlan('free', new Date('2026-03-15'));
 * console.log(`Downgrade effectif le ${result.subscription.nextBillingDate}`);
 */
export async function downgradePlan(
    planId: PlanType,
    effectiveDate?: Date
): Promise<SubscriptionResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/downgrade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
                planId,
                effectiveDate: effectiveDate?.toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const subscription = await response.json();
        return {
            subscription,
            plan: subscriptionPlans[subscription.plan as PlanType],
        };
    } catch (error) {
        console.error('Erreur lors du downgrade:', error);
        throw error;
    }
}

/**
 * Annuler la souscription
 * POST /api/subscription/cancel
 * 
 * @param reason - Raison de l'annulation
 * @param feedback - Feedback optionnel
 * @returns Promise<{ message: string; canceledAt: string }>
 * 
 * @example
 * await cancelSubscription('Trop cher', 'J\'ai trouvé une meilleure solution');
 */
export async function cancelSubscription(
    reason?: string,
    feedback?: string
): Promise<{ message: string; canceledAt: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
                reason,
                feedback,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
        throw error;
    }
}

/**
 * Réactiver une souscription annulée
 * POST /api/subscription/reactivate
 * 
 * @returns Promise<SubscriptionResponse>
 * 
 * @example
 * const result = await reactivateSubscription();
 * console.log(`Souscription réactivée au plan ${result.plan.name}`);
 */
export async function reactivateSubscription(): Promise<SubscriptionResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/reactivate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const subscription = await response.json();
        return {
            subscription,
            plan: subscriptionPlans[subscription.plan as PlanType],
        };
    } catch (error) {
        console.error('Erreur lors de la réactivation:', error);
        throw error;
    }
}

/**
 * Obtenir l'historique des factures
 * GET /api/subscription/invoices?page=1&limit=10
 * 
 * @param options - Options de pagination
 * @returns Promise<{ invoices: Invoice[]; total: number }>
 * 
 * @example
 * const { invoices } = await getInvoiceHistory({ page: 1, limit: 10 });
 * invoices.forEach(inv => console.log(`€${inv.amount}`));
 */
export async function getInvoiceHistory(options?: {
    page?: number;
    limit?: number;
    status?: 'paid' | 'pending' | 'failed';
}): Promise<{ invoices: Invoice[]; total: number }> {
    try {
        const params = new URLSearchParams();
        if (options?.page) params.append('page', String(options.page));
        if (options?.limit) params.append('limit', String(options.limit));
        if (options?.status) params.append('status', options.status);

        const queryString = params.toString();
        const url = queryString ? `${API_BASE_URL}/subscription/invoices?${queryString}` : `${API_BASE_URL}/subscription/invoices`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        throw error;
    }
}

/**
 * Obtenir les statistiques d'utilisation
 * GET /api/subscription/usage
 * 
 * @returns Promise<UsageStats>
 * 
 * @example
 * const usage = await getUsageStats();
 * console.log(`${usage.percentageUsed}% utilisé`);
 */
export async function getUsageStats(): Promise<UsageStats> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/usage`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques d\'utilisation:', error);
        throw error;
    }
}

/**
 * Helper pour obtenir le token d'authentification
 * @internal
 */
function getAuthToken(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken') || '';
    }
    return '';
}
