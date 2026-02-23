'use client';

import { Toast, useToast } from '@/components/ui/Toast';
import { cancelAdminSubscription, changeAdminSubscriptionPlan, getAdminSubscriptions } from '@/lib/admin/subscriptions';
import type { AdminSubscriptionSummary } from '@/lib/admin/types';
import { CreditCard, Loader2, Search, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function AdminSubscriptionsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [plan, setPlan] = useState<'free' | 'pro' | ''>('');
  const [status, setStatus] = useState<'active' | 'canceled' | 'expired' | 'trialing' | ''>('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminSubscriptions({
        page,
        limit,
        plan: plan || undefined,
        status: status || undefined,
        query: query || undefined,
      } as { page: number; limit: number; plan?: 'free' | 'pro'; status?: 'active' | 'canceled' | 'expired' | 'trialing'; query?: string });
      setSubscriptions(response.subscriptions);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      addToast(message, 'error', 5000);
    } finally {
      setLoading(false);
    }
  }, [limit, page, plan, query, status, addToast]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handlePlanChange = async (subscriptionId: string, nextPlan: 'free' | 'pro') => {
    setWorkingId(subscriptionId);
    try {
      await changeAdminSubscriptionPlan(subscriptionId, nextPlan);
      await fetchSubscriptions();
      addToast('Plan mis à jour avec succès', 'success', 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du plan';
      setError(message);
      addToast(message, 'error', 5000);
    } finally {
      setWorkingId(null);
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    setWorkingId(subscriptionId);
    try {
      await cancelAdminSubscription(subscriptionId, 'Admin cancellation');
      await fetchSubscriptions();
      addToast('Souscription annulée avec succès', 'success', 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'annulation';
      setError(message);
      addToast(message, 'error', 5000);
    } finally {
      setWorkingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Souscriptions</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerer les plans, les statuts et la facturation.
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par userId..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={plan}
            onChange={(event) => {
              setPlan(event.target.value as 'free' | 'pro' | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Tous les plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as 'active' | 'canceled' | 'expired' | 'trialing' | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="trialing">Essai</option>
            <option value="canceled">Annule</option>
            <option value="expired">Expire</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Souscription</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Prochain paiement</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-red-600 dark:text-red-400" />
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Chargement des souscriptions...</p>
                  </div>
                </td>
              </tr>
            )}
            {!loading && subscriptions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Aucune souscription trouvée avec les filtres appliques.</p>
                </td>
              </tr>
            )}
            {!loading && subscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{subscription.id}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Debut: {new Date(subscription.startDate).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{subscription.userId}</td>
                <td className="px-6 py-4">
                  <select
                    value={subscription.plan}
                    onChange={(event) => handlePlanChange(subscription.id, event.target.value as 'free' | 'pro')}
                    disabled={workingId === subscription.id}
                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white disabled:opacity-60"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    subscription.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : subscription.status === 'trialing'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : subscription.status === 'canceled'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {subscription.status === 'active'
                      ? 'Actif'
                      : subscription.status === 'trialing'
                        ? 'Essai'
                        : subscription.status === 'canceled'
                          ? 'Annule'
                          : 'Expire'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {subscription.nextBillingDate
                    ? new Date(subscription.nextBillingDate).toLocaleDateString('fr-FR')
                    : '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleCancel(subscription.id)}
                    disabled={workingId === subscription.id || subscription.status === 'canceled'}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 disabled:opacity-60"
                  >
                    {workingId === subscription.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} souscriptions • Page {page} sur {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50"
          >
            Precedent
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
