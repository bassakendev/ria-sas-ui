'use client';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { isPro, mockUserSubscription, subscriptionPlans, UserSubscription } from '@/consts/subscriptions';
import { ArrowRight, Check, CreditCard, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BillingSettingsPage() {
    const router = useRouter();
    const [subscription] = useState<UserSubscription>(mockUserSubscription);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toasts, addToast, removeToast } = useToast();

    const isProUser = isPro(subscription);
    const currentPlan = subscriptionPlans[subscription.plan];
    const proPlan = subscriptionPlans.pro;

    const handleCancelSubscription = async () => {
        try {
            setIsProcessing(true);
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1500));
            addToast('Abonnement annulé avec succès', 'success');
            setShowCancelModal(false);
            // Dans la vraie app: rafraîchir les données
            // window.location.reload();
        } catch (err) {
            console.error('Erreur:', err);
            addToast('Impossible d\'annuler l\'abonnement', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-8 w-8" />
                    Facturation
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Gérez votre plan et votre abonnement.
                </p>
            </div>

            {/* Plan actuel */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {currentPlan.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {isProUser ? 'Accès à toutes les fonctionnalités premium' : 'Fonctionnalités de base'}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        isProUser 
                            ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                        {isProUser && <Zap className="h-4 w-4 mr-1" />}
                        {isProUser ? 'PRO' : 'FREE'}
                    </span>
                </div>

                {/* Fonctionnalités */}
                <div className="space-y-3 mb-6">
                    {currentPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Détails */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Statut</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100">
                            {subscription.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                    </div>
                    
                    {isProUser && subscription.nextBillingDate && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Prochain paiement</span>
                            <span className="text-gray-900 dark:text-white font-medium text-sm">
                                {new Date(subscription.nextBillingDate!).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Prix</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {currentPlan.price}{currentPlan.currency}
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">/{currentPlan.interval === 'month' ? 'mois' : 'an'}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Comparaison des plans (visible seulement pour Free) */}
            {!isProUser && (
                <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Passez au Plan Pro
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Débloquez toutes les fonctionnalités premium pour seulement {proPlan.price}{proPlan.currency}/mois
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {proPlan.features.slice(0, 6).map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => router.push('/pricing')}
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        Passer au Plan Pro
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
                {isProUser ? (
                    <>
                        <button
                            onClick={() => addToast('Portail de gestion ouvert (simulation)', 'info')}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 dark:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            Gérer l&apos;abonnement
                        </button>

                        {subscription.status === 'active' && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                disabled={isProcessing}
                                className="w-full border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold py-3 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Annuler l&apos;abonnement
                            </button>
                        )}
                    </>
                ) : (
                    <button
                        onClick={() => router.push('/pricing')}
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Zap className="h-5 w-5" />
                        Passer au plan Pro
                    </button>
                )}
            </div>

            {/* Information */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    💡 Besoin d&apos;aide ?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pour toute question concernant votre facturation, contactez notre support à{' '}
                    <a
                        href="mailto:support@riasaas.com"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        support@riasaas.com
                    </a>
                </p>
            </div>
            
            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelSubscription}
                title="Annuler l'abonnement Pro"
                message={"Êtes-vous sûr de vouloir annuler votre abonnement Pro ?\n\nVous conserverez l'accès à toutes les fonctionnalités Pro jusqu'à la fin de la période de facturation en cours."}
                confirmText="Annuler l'abonnement"
                cancelText="Conserver l'abonnement"
                isDangerous={true}
                isProcessing={isProcessing}
            />
            
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
