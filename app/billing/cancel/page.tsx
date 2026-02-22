'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BillingCancelPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Protection : vérifier que l'utilisateur est connecté
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icône */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-orange-100 dark:bg-orange-900/30 rounded-full p-4">
              <XCircle className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Paiement annulé
        </h1>

        {/* Sous-texte */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          Vous avez annulé votre paiement. Aucuns frais n&apos;ont été débités.
          <br />
          Vous pouvez réessayer à tout moment.
        </p>

        {/* Détails */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">💡 Bon à savoir:</span> Vous pouvez continuer à utiliser le plan Free
            avec ses limites actuelles ou passer au plan Pro quand vous êtes prêt.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col gap-3">
          <Link href="/pricing">
            <button className="w-full bg-blue-600 dark:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
              Réessayer le paiement
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              Retour au Dashboard
            </button>
          </Link>
        </div>

        {/* Support */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Besoin d&apos;aide ?
          <br />
          <a href="mailto:support@riasaas.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            Contactez le support
          </a>
        </p>
      </div>
    </div>
  );
}
