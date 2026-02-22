/**
 * Stripe API functions
 * Centralized Stripe-related API calls for reusability
 */

import { getToken } from './auth';

/**
 * Create a Stripe checkout session for Pro plan subscription
 * @returns The checkout session URL
 */
export async function createCheckoutSession(): Promise<string> {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Erreur lors de la création de la session');
    }

    const data = await response.json();
    return data.url;
}

/**
 * Create a Stripe customer portal session for managing subscription
 * @returns The customer portal URL
 */
export async function createPortalSession(): Promise<string> {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Impossible d\'ouvrir le portail de facturation');
    }

    const data = await response.json();
    return data.url;
}

/**
 * Cancel the current user's Pro subscription
 * The user will retain access until the end of the billing period
 */
export async function cancelSubscription(): Promise<void> {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Impossible d\'annuler l\'abonnement');
    }
}
