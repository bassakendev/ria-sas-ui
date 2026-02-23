'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { useAdminGuard } from '@/lib/hooks';
import { useAdminPlans } from '@/lib/hooks/useAdminPlans';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminPlansPage() {
  const { loading: authLoading, isAuthorized, role } = useAdminGuard();
  const { plans, loading, error, fetch } = useAdminPlans();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetch().catch(() => {
      addToast('Erreur lors de la récupération des plans', 'error');
    });
  }, [fetch, addToast]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plans d&apos;abonnement</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez les plans disponibles</p>
          </div>
          {role === 'superadmin' && (
            <Link href="/admin/plans/create">
              <Button>➕ Créer un plan</Button>
            </Link>
          )}
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
          </div>
        )}

        {/* Plans Grid */}
        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Plan {plan.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.currency}{plan.price}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">/ {plan.interval === 'month' ? 'mois' : 'an'}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Fonctionnalités</h3>
                  <ul className="space-y-2">
                    {plan.features && plan.features.length > 0 ? (
                      plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">Aucune fonctionnalité spécifiée</p>
                    )}
                  </ul>
                </div>

                {/* Limits */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Limites</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Clients</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {plan.limits.clients === -1 ? '∞' : plan.limits.clients}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Factures</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {plan.limits.invoices === -1 ? '∞' : plan.limits.invoices}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Stockage</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {plan.limits.storage === -1 ? '∞' : `${plan.limits.storage} GB`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stripe Info */}
                {(plan.stripe_product_id || plan.stripe_price_id) && (
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Stripe</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                      <span className="font-mono">Product: {plan.stripe_product_id || 'N/A'}</span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 break-all mt-1">
                      <span className="font-mono">Price: {plan.stripe_price_id || 'N/A'}</span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/plans/${plan.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  </Link>
                  {role === 'superadmin' && (
                    <button className="flex-1 px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && plans.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Aucun plan disponible</p>
            {role === 'superadmin' && (
              <Link href="/admin/plans/create">
                <Button>Créer le premier plan</Button>
              </Link>
            )}
          </Card>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
