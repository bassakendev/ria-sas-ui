import { getAdminOverview } from '@/lib/admin/overview';
import type { AdminOverviewResponse } from '@/lib/admin/types';
import { useCallback, useState } from 'react';

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminOverview();
      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
}
