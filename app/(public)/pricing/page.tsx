'use client';

import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { useStripeCheckout } from '@/lib/hooks/useStripeCheckout';
import { Check, Loader, RotateCcw, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PricingPage() {
  const { isLoading, error, createCheckoutSession, resetError } = useStripeCheckout();
  const { toasts, addToast, removeToast } = useToast();

  // Afficher les toasts d'erreur Stripe
  useEffect(() => {
    if (error) {
      addToast(error, 'error');
      resetError();
    }
  }, [error, addToast, resetError]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Un prix simple. Sans surprise.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Un seul plan, toutes les fonctionnalités essentielles pour gérer vos clients et factures.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 relative flex flex-col">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Free
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Parfait pour commencer.
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">0€</span>
                  <span className="text-xl text-gray-600 dark:text-gray-400">/mois</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 grow">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Jusqu&apos;à 3 clients
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    5 factures par mois
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    PDF avec watermark
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Dashboard basique
                  </span>
                </li>
              </ul>

              {/* CTA Button */}
              <Link href="/register">
                <Button variant="secondary" className="w-full text-lg py-4 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-800 p-8 relative flex flex-col transform md:scale-105">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1.5 bg-blue-600 dark:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md">
                  Recommandé
                </span>
              </div>

              {/* Header */}
              <div className="text-center mb-8 mt-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Pro
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Tout ce dont vous avez besoin pour gérer votre activité.
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">12€</span>
                  <span className="text-xl text-gray-600 dark:text-gray-400">/mois</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 grow">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Clients illimités
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Factures illimitées
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Génération PDF professionnelle
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Export CSV
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Tableau de bord avancé avec graphiques
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Support email prioritaire
                  </span>
                </li>
              </ul>

              {/* CTA Button */}
              <button
                onClick={createCheckoutSession}
                disabled={isLoading}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {isLoading && <Loader className="h-5 w-5 animate-spin" />}
                {isLoading ? 'Redirection en cours...' : 'Débloquer clients et factures illimités'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Security */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Données sécurisées
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vos informations sont protégées et isolées
              </p>
            </div>

            {/* Cancel anytime */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <RotateCcw className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Annulation à tout moment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aucun engagement, résiliez quand vous voulez
              </p>
            </div>

            {/* Instant activation */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Activation immédiate
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accès instantané après inscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            {/* Question 1 */}
            <details className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 dark:text-white">
                Puis-je annuler mon abonnement ?
                <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Aucun engagement n&apos;est requis.
              </p>
            </details>

            {/* Question 2 */}
            <details className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 dark:text-white">
                Y a-t-il une période gratuite ?
                <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Oui, l&apos;inscription est gratuite. Le paiement est uniquement requis pour accéder au plan Pro et ses fonctionnalités avancées.
              </p>
            </details>

            {/* Question 3 */}
            <details className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 dark:text-white">
                Mes données sont-elles sécurisées ?
                <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Absolument. Vos données sont isolées, chiffrées et protégées selon les normes de sécurité les plus strictes.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-linear-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à simplifier votre gestion ?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Rejoignez les professionnels qui gèrent déjà leurs factures avec RIA SaaS.
          </p>
          <Link href="/register">
            <Button
              variant="secondary"
              className="bg-white dark:bg-white text-blue-600 dark:text-black! hover:bg-gray-200! text-lg py-4 px-8"
            >
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
