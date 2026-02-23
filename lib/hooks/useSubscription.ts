/**
 * Hooks pour la gestion des souscriptions
 */

import type { PlanType, SubscriptionPlan } from '@/consts/subscriptions';
import type {
    Invoice,
    SubscriptionResponse,
    UsageStats,
} from '@/lib/subscriptions';
import {
    cancelSubscription,
    downgradePlan,
    getAvailablePlans,
    getCurrentSubscription,
    getInvoiceHistory,
    getUsageStats,
    reactivateSubscription,
    upgradePlan,
} from '@/lib/subscriptions';
import { useCallback, useState } from 'react';

/**
 * Hook pour obtenir la souscription actuelle
 */
export function useCurrentSubscription() {
    const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getCurrentSubscription();
            setSubscription(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { subscription, loading, error, fetch };
}

/**
 * Hook pour obtenir les plans disponibles
 */
export function useAvailablePlans() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAvailablePlans();
            setPlans(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { plans, loading, error, fetch };
}

/**
 * Hook pour upgrader le plan
 */
export function useUpgradePlan() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upgrade = useCallback(async (planId: PlanType, billingPeriod: 'month' | 'year' = 'month') => {
        setLoading(true);
        setError(null);

        try {
            const response = await upgradePlan(planId, billingPeriod);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { upgrade, loading, error };
}

/**
 * Hook pour downgrader le plan
 */
export function useDowngradePlan() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downgrade = useCallback(async (planId: PlanType, effectiveDate?: Date) => {
        setLoading(true);
        setError(null);

        try {
            const response = await downgradePlan(planId, effectiveDate);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { downgrade, loading, error };
}

/**
 * Hook pour annuler la souscription
 */
export function useCancelSubscription() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancel = useCallback(async (reason?: string, feedback?: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cancelSubscription(reason, feedback);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { cancel, loading, error };
}

/**
 * Hook pour réactiver la souscription
 */
export function useReactivateSubscription() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reactivate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await reactivateSubscription();
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { reactivate, loading, error };
}

/**
 * Hook pour obtenir l'historique des factures
 */
export function useInvoiceHistory() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async (options?: {
        page?: number;
        limit?: number;
        status?: 'paid' | 'pending' | 'failed';
    }) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getInvoiceHistory(options);
            setInvoices(data.invoices);
            setTotal(data.total);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { invoices, total, loading, error, fetch };
}

/**
 * Hook pour obtenir les statistiques d'utilisation
 */
export function useUsageStats() {
    const [usage, setUsage] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getUsageStats();
            setUsage(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { usage, loading, error, fetch };
}
