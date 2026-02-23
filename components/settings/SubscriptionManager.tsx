/**
 * Composant Subscription Manager pour les utilisateurs
 * Gestion et suivi du plan de souscription
 */

'use client';

import type { PlanType } from '@/consts/subscriptions';
import {
    useAvailablePlans,
    useCancelSubscription,
    useCurrentSubscription,
    useDowngradePlan,
    useInvoiceHistory,
    useUpgradePlan,
    useUsageStats,
} from '@/lib/hooks/useSubscription';
import { Check, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SubscriptionManager() {
    const { subscription, fetch: fetchSubscription } = useCurrentSubscription();
    const { plans, fetch: fetchPlans } = useAvailablePlans();
    const { upgrade } = useUpgradePlan();
    const { downgrade } = useDowngradePlan();
    const { cancel } = useCancelSubscription();
    const { invoices, fetch: fetchInvoices } = useInvoiceHistory();
    const { usage, fetch: fetchUsage } = useUsageStats();

    const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'invoices' | 'plans'>('overview');
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelForm, setShowCancelForm] = useState(false);

    useEffect(() => {
        fetchSubscription();
        fetchPlans();
        fetchUsage();
        fetchInvoices();
    }, []);

    const handleUpgrade = async (planId: PlanType) => {
        try {
            await upgrade(planId, 'month');
            fetchSubscription();
        } catch (error) {
            console.error('Erreur lors de l\'upgrade:', error);
        }
    };

    const handleDowngrade = async (planId: PlanType) => {
        try {
            await downgrade(planId);
            fetchSubscription();
        } catch (error) {
            console.error('Erreur lors du downgrade:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await cancel(cancelReason);
            setShowCancelForm(false);
            setCancelReason('');
            fetchSubscription();
        } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
        }
    };

    if (!subscription) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    const currentPlan = subscription.plan;
    const isCanceled = subscription.subscription.status === 'canceled';

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Votre Souscription
                </h2>

                {/* Plan actuel */}
                <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {currentPlan.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Statut: <span className={`font-semibold ${
                                    isCanceled ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    {isCanceled ? 'Annulé' : subscription.subscription.status === 'trialing' ? 'Période d\'essai' : 'Actif'}
                                </span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                {currentPlan.price === 0 ? 'Gratuit' : `${currentPlan.price}€`}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                par mois
                            </p>
                        </div>
                    </div>

                    {/* Dates importantes */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">Actif depuis:</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {new Date(subscription.subscription.startDate).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        {subscription.subscription.nextBillingDate && (
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Prochain paiement:</span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {new Date(subscription.subscription.nextBillingDate).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                        activeTab === 'overview'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Vue d&apos;ensemble
                </button>
                <button
                    onClick={() => setActiveTab('usage')}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                        activeTab === 'usage'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Utilisation
                </button>
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                        activeTab === 'invoices'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Factures
                </button>
                <button
                    onClick={() => setActiveTab('plans')}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                        activeTab === 'plans'
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Changer de plan
                </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'overview' && (
                <div className="space-y-4">
                    {/* Caractéristiques */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Caractéristiques incluses
                        </h3>
                        <ul className="space-y-2">
                            {currentPlan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        {currentPlan.id === 'free' && (
                            <button
                                onClick={() => handleUpgrade('pro')}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Upgrader vers Pro
                            </button>
                        )}

                        {currentPlan.id === 'pro' && (
                            <button
                                onClick={() => setShowCancelForm(!showCancelForm)}
                                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-semibold"
                            >
                                Gestion de la souscription
                            </button>
                        )}
                    </div>

                    {/* Formulaire d'annulation */}
                    {showCancelForm && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
                                Annuler votre souscription
                            </h3>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Dites-nous pourquoi vous partez (optionnel)..."
                                rows={4}
                                className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-red-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                                >
                                    Confirmer l&apos;annulation
                                </button>
                                <button
                                    onClick={() => setShowCancelForm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 font-semibold"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'usage' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
                    {usage && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Utilisation Générale
                                </h3>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${usage.percentageUsed}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {usage.percentageUsed}% utilisé
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Factures ce mois:</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {usage.invoicesThisMonth} / {usage.invoicesLimit === -1 ? '∞' : usage.invoicesLimit}
                                    </p>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Clients:</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {usage.clientsCreated} / {usage.clientsLimit === -1 ? '∞' : usage.clientsLimit}
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Stockage:</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {usage.storageUsed} / {usage.storageLimit}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'invoices' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    N° Facture
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Montant
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Statut
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {invoice.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {invoice.amount.toFixed(2)}€
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                            invoice.status === 'paid'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                : invoice.status === 'pending'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                        }`}>
                                            {invoice.status === 'paid' ? 'Payée' : invoice.status === 'pending' ? 'En attente' : 'Échouée'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {invoice.pdfUrl && (
                                            <a
                                                href={invoice.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Download className="h-5 w-5" />
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-lg p-6 border-2 transition-all ${
                                plan.id === subscription.plan.id
                                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                            }`}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {plan.name}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">par mois</p>

                            <ul className="mt-6 space-y-2">
                                {plan.features.map((feature : string, index : number) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => {
                                    if (plan.id === 'pro' && subscription.plan.id === 'free') {
                                        handleUpgrade('pro');
                                    } else if (plan.id === 'free' && subscription.plan.id === 'pro') {
                                        handleDowngrade('free');
                                    }
                                }}
                                disabled={plan.id === subscription.plan.id}
                                className={`w-full mt-6 px-4 py-2 rounded-lg font-semibold transition-all ${
                                    plan.id === subscription.plan.id
                                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {plan.id === subscription.plan.id ? 'Plan actuel' : 'Choisir ce plan'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
