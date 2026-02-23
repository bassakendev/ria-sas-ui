export type PlanType = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing';

export interface SubscriptionPlan {
    id: PlanType;
    name: string;
    description?: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    limits: {
        invoicesPerMonth: number;
        clients: number;
        storage: string;
        support: string;
    };
}

export interface UserSubscription {
    userId: string;
    plan: PlanType;
    status: SubscriptionStatus;
    startDate: string;
    nextBillingDate?: string;
    canceledAt?: string;
}

// Plans disponibles
export const subscriptionPlans: Record<PlanType, SubscriptionPlan> = {
    free: {
        id: 'free',
        name: 'Plan Gratuit',
        price: 0,
        currency: '€',
        interval: 'month',
        features: [
            'Jusqu\'à 5 factures par mois',
            'Gestion de 3 clients maximum',
            'Stockage de 100 MB',
            'Support par email',
        ],
        limits: {
            invoicesPerMonth: 5,
            clients: 3,
            storage: '100 MB',
            support: 'Email (48h)',
        },
    },
    pro: {
        id: 'pro',
        name: 'Plan Pro',
        price: 12,
        currency: '€',
        interval: 'month',
        features: [
            'Factures illimitées',
            'Clients illimités',
            'Stockage de 10 GB',
            'Support prioritaire',
            'Export CSV avancé',
            'Personnalisation des factures',
            'Filigrane personnalisé',
            'Rapports et statistiques avancés',
        ],
        limits: {
            invoicesPerMonth: -1, // -1 = illimité
            clients: -1,
            storage: '10 GB',
            support: 'Email & Chat (2h)',
        },
    },
};

// Mock subscription data pour le développement
export const mockUserSubscription: UserSubscription = {
    userId: 'user-123',
    plan: 'free', // Changer à 'pro' pour tester le plan Pro
    status: 'active',
    startDate: '2026-01-15T10:00:00Z',
    nextBillingDate: undefined, // Défini seulement pour le plan Pro
};

// Mock Pro subscription pour tester
export const mockProSubscription: UserSubscription = {
    userId: 'user-123',
    plan: 'pro',
    status: 'active',
    startDate: '2026-01-15T10:00:00Z',
    nextBillingDate: '2026-03-15T10:00:00Z', // Prochain paiement dans le futur
};

// Helper pour vérifier si un utilisateur est Pro
export function isPro(subscription: UserSubscription): boolean {
    return subscription.plan === 'pro' && subscription.status === 'active';
}

// Helper pour obtenir les limites d'un plan
export function getPlanLimits(planType: PlanType) {
    return subscriptionPlans[planType].limits;
}

// Helper pour vérifier si une limite est atteinte
export function isLimitReached(
    subscription: UserSubscription,
    type: 'invoices' | 'clients',
    currentCount: number
): boolean {
    const plan = subscriptionPlans[subscription.plan];
    const limit = type === 'invoices' ? plan.limits.invoicesPerMonth : plan.limits.clients;
    
    // -1 signifie illimité
    if (limit === -1) return false;
    
    return currentCount >= limit;
}
