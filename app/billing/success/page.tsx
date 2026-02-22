'use client';

import { fetchUserData, UserData } from '@/lib/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { CheckCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BillingSuccessPage() {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 5;

    useEffect(() => {
        // Protection : vérifier que l'utilisateur est connecté
        if (!authLoading && !isLoggedIn) {
            router.replace('/login');
            return;
        }

        // Récupérer les infos utilisateur pour vérifier le plan
        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);

                // Si le plan est toujours "free" et qu'on n'a pas atteint le max de retries,
                // c'est peut-être que le webhook n'a pas encore mis à jour la BDD
                if (data.plan === 'free' && retryCount < MAX_RETRIES) {
                    setRetryCount((prev) => prev + 1);
                    // Attendre 2 secondes avant de réessayer
                    setTimeout(() => {
                        setLoading(true);
                    }, 2000);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Erreur:', err);
                setLoading(false);
            }
        };

        if (!authLoading) {
            loadUserData();
        }
    }, [isLoggedIn, authLoading, retryCount, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Traitement de votre paiement...
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Veuillez patienter quelques instants.
                    </p>
                </div>
            </div>
        );
    }

    const isPro = userData?.plan === 'pro';

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Icône */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Titre */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isPro ? 'Paiement confirmé 🎉' : 'En cours de traitement...'}
                </h1>

                {/* Sous-texte */}
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    {isPro ? (
                        <>
                            Votre abonnement Pro est maintenant actif.
                            <br />
                            Vous avez accès à toutes les fonctionnalités premium.
                        </>
                    ) : (
                        <>
                            Votre paiement a été reçu. Votre compte est en cours de mise à jour.
                            <br />
                            Cela devrait prendre quelques secondes.
                        </>
                    )}
                </p>

                {/* Détails */}
                {isPro && userData && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-8 text-left">
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Email</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {userData.email}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Plan</dt>
                                <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100">
                                    Pro
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-600 dark:text-gray-400">Montant</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    12€/mois
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}

                {/* Boutons */}
                <div className="flex flex-col gap-3">
                    <Link href="/dashboard">
                        <button className="w-full bg-blue-600 dark:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
                            Aller au Dashboard
                        </button>
                    </Link>

                    {!isPro && (
                        <Link href="/">
                            <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                Retour à l&apos;accueil
                            </button>
                        </Link>
                    )}
                </div>

                {/* Note */}
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Un email de confirmation vous a été envoyé.
                    <br />
                    Gérez votre abonnement depuis les paramètres.
                </p>
            </div>
        </div>
    );
}
