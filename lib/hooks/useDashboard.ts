import type { Invoice } from '@/consts/invoices';
import { getDashboardData, type DashboardResponse, type DashboardStats } from '@/lib/dashboard';
import { useCallback, useState } from 'react';

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardData();
      setData(response);
      setStats(response.stats);
      setRecentInvoices(response.recentInvoices);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, stats, recentInvoices, loading, error, fetch };
}
