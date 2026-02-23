/**
 * Hook personnalisé pour la gestion des feedbacks
 * Abstraits l'API et fournissent des états de chargement
 */

import type {
    Feedback,
    FeedbackStats
} from '@/consts/feedback';
import type { CreateFeedbackRequest } from '@/lib/feedback';
import {
    deleteFeedback,
    getFeedback,
    getFeedbackStats,
    listFeedbacks,
    submitFeedback,
    updateFeedback,
} from '@/lib/feedback';
import { useCallback, useState } from 'react';

/**
 * Hook pour soumettre un feedback
 */
export function useSubmitFeedback() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async (data: CreateFeedbackRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await submitFeedback(data);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { submit, loading, error };
}

/**
 * Hook pour récupérer la liste des feedbacks
 */
export function useFeedbackList() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async (options?: Parameters<typeof listFeedbacks>[0]) => {
        setLoading(true);
        setError(null);

        try {
            const response = await listFeedbacks(options);
            setFeedbacks(response.feedbacks as unknown as Feedback[]);
            setTotal(response.total);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { feedbacks, total, loading, error, fetch };
}

/**
 * Hook pour récupérer un feedback spécifique
 */
export function useFeedback(id: string) {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getFeedback(id);
            setFeedback(data as unknown as Feedback);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [id]);

    return { feedback, loading, error, fetch };
}

/**
 * Hook pour mettre à jour un feedback
 */
export function useUpdateFeedback() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(
        async (id: string, updates: Parameters<typeof updateFeedback>[1]) => {
            setLoading(true);
            setError(null);

            try {
                const response = await updateFeedback(id, updates);
                return response;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erreur inconnue';
                setError(message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { update, loading, error };
}

/**
 * Hook pour supprimer un feedback
 */
export function useDeleteFeedback() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const delete_ = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await deleteFeedback(id);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { delete: delete_, loading, error };
}

/**
 * Hook pour récupérer les statistiques
 */
export function useFeedbackStats() {
    const [stats, setStats] = useState<FeedbackStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getFeedbackStats();
            setStats(data as unknown as FeedbackStats);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { stats, loading, error, fetch };
}
