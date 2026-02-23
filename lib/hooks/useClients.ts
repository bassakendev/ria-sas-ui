import { getClients, getClientStats, type ClientsResponse, type ClientStatsResponse } from '@/lib/clients';
import { useCallback, useState } from 'react';

export function useClients() {
  const [data, setData] = useState<ClientsResponse | null>(null);
  const [stats, setStats] = useState<ClientStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (page = 1, limit = 10, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getClients({ page, limit, search });
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

  const fetchStats = useCallback(async () => {
    try {
      const response = await getClientStats();
      setStats(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    }
  }, []);

  return { data, stats, loading, error, fetch, fetchStats };
}
