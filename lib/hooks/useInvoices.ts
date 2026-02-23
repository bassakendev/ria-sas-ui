import { getInvoices, getInvoiceStats, type InvoicesResponse, type InvoiceStatsResponse } from '@/lib/invoices';
import { useCallback, useState } from 'react';

export function useInvoices() {
  const [data, setData] = useState<InvoicesResponse | null>(null);
  const [stats, setStats] = useState<InvoiceStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (page = 1, limit = 10, status?: string, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getInvoices({ page, limit, status, search });
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
      const response = await getInvoiceStats();
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
