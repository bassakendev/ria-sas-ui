'use client';

import { AdminStatsChart } from '@/components/admin/AdminStatsChart';
import { Toast, useToast } from '@/components/ui/Toast';
import { useAdminStats } from '@/lib/hooks/useAdminStats';
import { BarChart3, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const { stats, isLoading, error } = useAdminStats(period);
  const { toasts, addToast, removeToast } = useToast();

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

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Suivi des metriques principales sur 7 jours.
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-3">
          Periode
        </label>
        <div className="flex items-center gap-2">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                period === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {p === 'week' ? '7 jours' : p === 'month' ? '30 jours' : 'Annee'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !stats && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-gray-600 dark:text-gray-400 mt-3">Chargement des statistiques...</p>
        </div>
      )}

      {/* Charts Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users Growth Chart */}
          <>
            <AdminStatsChart
              title="Utilisateurs par jour"
              data={stats.users}
              color="blue"
              isLoading={isLoading}
            />

            {/* Revenue Chart */}
            <AdminStatsChart
              title="Revenue par jour"
              data={stats.revenue}
              unit="$"
              color="green"
              isLoading={isLoading}
            />

            {/* Churn Rate Chart */}
            <AdminStatsChart
              title="Taux de churn"
              data={stats.churnRate}
              unit="%"
              color="red"
              isLoading={isLoading}
            />
          </>
        </div>
      )}

      {/* Summary Cards */}
      {stats && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Users Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">Total utilisateurs</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
              {Math.round(stats.users[stats.users.length - 1]?.value || 0)}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              +{Math.round(stats.users[stats.users.length - 1].value - stats.users[0].value)} cette semaine
            </p>
          </div>

          {/* Revenue Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-xs text-green-600 dark:text-green-400 uppercase font-semibold">Revenue 7j</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
              ${(stats.revenue.reduce((a, b) => a + b.value, 0)).toFixed(0)}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              Moyenne: ${(stats.revenue.reduce((a, b) => a + b.value, 0) / stats.revenue.length).toFixed(0)}/jour
            </p>
          </div>

          {/* Churn Summary */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-xs text-red-600 dark:text-red-400 uppercase font-semibold">Avg churn rate</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
              {(stats.churnRate.reduce((a, b) => a + b.value, 0) / stats.churnRate.length).toFixed(2)}%
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
              7-day average
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
