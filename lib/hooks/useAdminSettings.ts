import { getAdminSettings, updateAdminSettings } from '@/lib/admin/settings';
import type { AdminSettingsResponse } from '@/lib/admin/types';
import { useCallback, useState } from 'react';

export function useAdminSettings() {
  const [data, setData] = useState<AdminSettingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminSettings();
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

  const save = useCallback(async (payload: Partial<AdminSettingsResponse>) => {
    setSaving(true);
    setError(null);

    try {
      const response = await updateAdminSettings(payload);
      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, fetch, save };
}
