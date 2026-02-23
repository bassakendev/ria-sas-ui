'use client';

import { Toast, useToast } from '@/components/ui/Toast';
import { useAdminOverview } from '@/lib/hooks/useAdminOverview';
import { CreditCard, Loader2, MessageSquare, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminHomePage() {
  const { data, loading, error, fetch } = useAdminOverview();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error', 5000);
    }
  }, [error, addToast]);

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Centre d'administration</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Acces reserve au role superadmin. Vue globale des operations et alertes.
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 dark:text-red-400" />
          <p className="text-gray-600 dark:text-gray-400 mt-3">Chargement des donnees...</p>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Users className="h-5 w-5" />
                <span className="text-sm font-semibold">Utilisateurs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                {data.metrics.usersActive} actifs
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.metrics.usersTotal} au total</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-semibold">MRR</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                {data.metrics.mrr.toLocaleString('fr-FR')}€
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Churn {data.metrics.churnRate}%</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-semibold">Support</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                {data.metrics.pendingFeedbacks} en attente
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.support.avgResponseTimeHours}h moyenne</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activites recentes</h3>
                <div className="mt-4 space-y-3">
                  {data.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Repartition des souscriptions</h3>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Free</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{data.subscriptions.free}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pro</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{data.subscriptions.pro}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Essai</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{data.subscriptions.trial}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Etat systeme</h3>
                <div className="mt-4 flex items-center gap-2">
                  {data.system.status === 'healthy' ? (
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {data.system.status === 'healthy' ? 'OK' : 'Incident'}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Derniere sauvegarde: {new Date(data.system.lastBackupAt).toLocaleString('fr-FR')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  File d'attente: {data.system.queueDepth}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alertes</h3>
                <div className="mt-4 space-y-3">
                  {data.alerts.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucune alerte critique.</p>
                  )}
                  {data.alerts.map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{alert.title}</p>
                      {alert.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{alert.description}</p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(alert.createdAt).toLocaleString('fr-FR')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
