import type { SubscriptionPlan } from '@/consts/subscriptions';
import { getPublicPlans } from '@/lib/public';
import { useCallback, useState } from 'react';

export function usePublicPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPublicPlans();
      setPlans(response);
      return response;
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
