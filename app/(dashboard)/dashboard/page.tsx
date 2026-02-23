/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { exportDashboardInvoicesCSV } from '@/lib/csvExport';
import { useDashboard } from '@/lib/hooks/useDashboard';
import {
  ArrowRight,
  Clock,
  DollarSign,
  Download,
  FileText,
  Plus,
  UserPlus,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// KPI Card Component
function KPICard({
  label,
  value,
  icon: Icon,
  accentColor,
  trend
}: {
  label: string;
  value: string | number;
  icon: any;
  accentColor: string;
  trend?: { value: string; positive: boolean };
}) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    gray: 'bg-gray-50 dark:bg-gray-800/50',
  };

  const iconColors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColors[accentColor]}`}>
          <Icon className={`h-5 w-5 ${iconColors[accentColor]}`} />
        </div>
      </div>
      {trend && (
        <p className={`text-xs ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend.value}
        </p>
      )}
    </div>
  );
}

// Skeleton Loader
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 h-24"></div>
        ))}
      </div>

      {/* Graph */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 h-80 mb-8"></div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { toasts, addToast, removeToast } = useToast();
  const { stats, recentInvoices, loading, error, data, fetch } = useDashboard();

  useEffect(() => {
    fetch().catch(err => {
      console.error('Erreur:', err);
      addToast(
        err instanceof Error ? err.message : 'Impossible de charger les données du tableau de bord',
        'error'
      );
    });
  }, []);

  // Export CSV
  const handleExportCSV = async () => {
    try {
      await exportDashboardInvoicesCSV();
      addToast('Export CSV réussi', 'success');
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      addToast(err instanceof Error ? err.message : 'Impossible d\'exporter les factures récentes', 'error');
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Impossible de charger les données.
          </p>
          <Button onClick={fetchDashboardData} variant="primary">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {!loading && (
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* KPI Cards */}
  {
    stats && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        label="Revenus"
        value={`${stats.totalRevenue.toFixed(2)}€`}
        icon={DollarSign}
        accentColor="blue"
      />
      <KPICard
        label="Impayés"
        value={`${stats.pendingRevenue.toFixed(2)}€`}
        icon={Clock}
        accentColor="orange"
      />
      <KPICard
        label="Clients"
        value={stats.totalClients}
        icon={Users}
        accentColor="purple"
      />
      <KPICard
        label="Factures"
        value={stats.totalInvoices}
        icon={FileText}
        accentColor="gray"
      />
    </div>
  )
  }

      {/* Revenue Chart Placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Évolution des revenus
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            6 derniers mois
          </p>
        </div>

        {/* Recharts Area Chart */}
        {data?.chartData && data.chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data.chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                className="dark:stroke-gray-500"
              />
              <YAxis
                stroke="#6b7280"
                className="dark:stroke-gray-500"
                label={{ value: '€', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
                formatter={(value: any) => `${value.toLocaleString('fr-FR')}€`}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Legend wrapperStyle={{ color: '#6b7280' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Revenus"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Factures récentes
          </h2>
          <div className="flex gap-2">
            {recentInvoices.length > 0 && (
              <Button onClick={handleExportCSV} variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            )}
            <Link href="/invoices">
              <Button variant="secondary" size="sm">
                Voir toutes
              </Button>
            </Link>
          </div>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucune facture pour le moment.
            </p>
            <Link href="/invoices/new">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Créer une facture
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                    Numéro
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                    Montant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="py-4 font-semibold text-gray-900 dark:text-white">
                      {invoice.invoice_number}
                    </td>
                    <td className="py-4 text-gray-700 dark:text-gray-300">
                      {invoice.client?.name || 'N/A'}
                    </td>
                    <td className="py-4 font-semibold text-gray-900 dark:text-white">
                      {invoice.total.toFixed(2)}€
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          }`}
                      >
                        {invoice.status === 'paid' ? 'Payé' : 'Impayé'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-700 dark:text-gray-300">
                      {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="secondary" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/invoices/create">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Créer une facture
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Générez une facture professionnelle en quelques secondes.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </div>
          </div>
        </Link>

        <Link href="/clients/create">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Ajouter un client
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enregistrez vos clients pour facturer plus facilement.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </div>
          </div>
        </Link>
      </div>
      )
}
{
  toasts.map((toast) => (
    <Toast
      key={toast.id}
      message={toast.message}
      type={toast.type}
      onClose={() => removeToast(toast.id)}
    />
  ))
}
    </div>
  );
}
