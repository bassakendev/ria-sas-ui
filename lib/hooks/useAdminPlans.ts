import * as plansApi from '@/lib/admin/plans';
import { useCallback, useState } from 'react';

export function useAdminPlans() {
  const [plans, setPlans] = useState<plansApi.SubscriptionPlanAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await plansApi.getAdminPlans();
      setPlans(data.plans);
      return data.plans;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des plans';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlan = useCallback(async (planId: string) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await plansApi.getAdminPlan(planId);
      return plan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération du plan';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Omit<plansApi.SubscriptionPlanAdmin, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await plansApi.createAdminPlan(data);
      setPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création du plan';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (planId: string, data: Partial<plansApi.SubscriptionPlanAdmin>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await plansApi.updateAdminPlan(planId, data);
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? updated : p))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du plan';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const delete_ = useCallback(async (planId: string) => {
    setLoading(true);
    setError(null);
    try {
      await plansApi.deleteAdminPlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression du plan';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    plans,
    loading,
    error,
    fetch,
    getPlan,
    create,
    update,
    delete: delete_,
  };
}
