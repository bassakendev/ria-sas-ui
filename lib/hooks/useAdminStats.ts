import { getAdminStats } from '@/lib/admin/stats';
import type { AdminStatsResponse } from '@/lib/admin/types';
import { useCallback, useEffect, useState } from 'react';

export function useAdminStats(period: 'week' | 'month' | 'year' = 'week') {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminStats(period);
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, isLoading, error, fetch };
}
