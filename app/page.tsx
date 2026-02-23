'use client';

import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Toast, useToast } from '@/components/ui/Toast';
import { usePublicPlans } from '@/lib/hooks/usePublicPlans';
import {
  BarChart3,
  Check,
  Clock,
  FileText,
  Loader2,
  Users,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

function DashboardIllustration() {
  return (
    <>
      {/* Light mode mockup */}
      <Image
        src="/mockups/mockup-1.png"
        alt="Dashboard RIA SaaS - Vue d'ensemble des factures et statistiques"
        width={1600}
        height={1040}
        className="w-full h-full object-contain dark:hidden"
        priority
      />
      {/* Dark mode mockup */}
      <Image
        src="/mockups/mockup-dark-1.png"
        alt="Dashboard RIA SaaS - Vue d'ensemble des factures et statistiques"
        width={1600}
        height={1040}
        className="hidden dark:block w-full h-full object-contain"
        priority
      />
    </>
  );
}

function ProductIllustration() {
  return (
    <>
      {/* Light mode mockup */}
      <Image
        src="/mockups/mockup-2.png"
        alt="Interface de création de facture RIA SaaS avec prévisualisation en temps réel"
        width={1800}
        height={840}
        className="w-full h-full object-contain dark:hidden"
      />
      {/* Dark mode mockup */}
      <Image
        src="/mockups/mockup-dark-2.png"
        alt="Interface de création de facture RIA SaaS avec prévisualisation en temps réel"
        width={1800}
        height={840}
        className="hidden dark:block w-full h-full object-contain"
      />
    </>
  );
}

export default function HomePage() {
  const { toasts, addToast, removeToast } = useToast();
  const { plans, loading: plansLoading, fetch } = usePublicPlans();

  useEffect(() => {
    fetch().catch(err => {
      console.error('Erreur:', err);
      addToast(
        err instanceof Error ? err.message : 'Impossible de charger les plans',
        'error'
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <section className="mx-auto grid max-w-300 grid-cols-1 items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-5xl">
            Gerez vos clients et factures sans complexite.
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Un outil simple et professionnel pour freelances et vendeurs qui veulent suivre leurs paiements et garder le
            controle de leurs revenus.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register">
              <Button variant="primary" className="bg-blue-600 px-6 py-3 hover:bg-blue-700">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="secondary" className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-3 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                Voir comment ca marche
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-base text-gray-500 dark:text-gray-400">No credit card required</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg">
          <div className="aspect-16/10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <DashboardIllustration />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-16" id="problem">
        <div className="mx-auto max-w-300 px-5 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Trop de desordre dans ta gestion ?</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <FileText className="mb-3 h-6 w-6 text-gray-700 dark:text-gray-300" />
              <h3 className="font-semibold">Factures perdues sur WhatsApp</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Des docs qui se perdent dans les messages.</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <Clock className="mb-3 h-6 w-6 text-gray-700 dark:text-gray-300" />
              <h3 className="font-semibold">Clients qui paient en retard</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Aucun rappel clair ni suivi.</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <BarChart3 className="mb-3 h-6 w-6 text-gray-700 dark:text-gray-300" />
              <h3 className="font-semibold">Aucun suivi clair de tes revenus</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Une vision incomplete de tes paiements.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" id="features">
        <div className="mx-auto max-w-300 px-5 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Une solution simple et efficace</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Gestion clients</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Centralise tous tes contacts.</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Facturation rapide</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Creer une facture en 2 minutes.</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Suivi des paiements</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Suis chaque paiement en temps reel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-16" id="how">
        <div className="mx-auto max-w-300 px-5 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Comment ca marche</h2>
          <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-sm font-bold">1</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Cree ton compte</p>
            </div>
            <div className="hidden h-px w-16 bg-gray-200 dark:bg-gray-700 md:block"></div>
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-sm font-bold">2</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ajoute clients et services</p>
            </div>
            <div className="hidden h-px w-16 bg-gray-200 dark:bg-gray-700 md:block"></div>
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-sm font-bold">3</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Envoie et suis tes factures</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-300 px-5 sm:px-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="aspect-16/7 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
              <ProductIllustration />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:justify-center">
            <span>• Interface claire</span>
            <span>• Rapide a prendre en main</span>
            <span>• Accessible partout</span>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-16" id="pricing">
        <div className="mx-auto max-w-300 px-5 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Tarification</h2>
          <div className="mt-10 flex justify-center">
            {plansLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-8 shadow-sm flex flex-col ${plan.name === 'pro'
                      ? 'border-blue-500 dark:border-blue-600 bg-linear-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 ring-2 ring-blue-500/50'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                  >
                    {plan.name === 'pro' && (
                      <div className="mb-3 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 w-fit">
                        Populaire
                      </div>
                    )}
                    <h3 className="text-2xl font-bold capitalize">{plan.name}</h3>
                    <p className="mt-2 text-4xl font-bold">{plan.price === 0 ? 'Gratuit' : `${plan.price}€/mois`}</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{plan.description ?? 'RAS'}</p>
                    <ul className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-300 grow">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className="mt-6 block">
                      <Button variant="primary" className="w-full py-3">
                        {plan.price === 0 ? 'Commencer gratuitement' : 'Commencer maintenant'}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">Impossible de charger les plans</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-16" id="faq">
        <div className="mx-auto max-w-225 px-5 sm:px-6">
          <h2 className="text-center text-3xl font-bold">FAQ</h2>
          <div className="mt-8 space-y-4">
            <details className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer group">
              <summary className="font-semibold">Puis-je tester avant de payer ?</summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Oui, tu peux commencer gratuitement et passer au plan Pro quand tu veux.</p>
            </details>
            <details className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer group">
              <summary className="font-semibold">Puis-je exporter mes factures ?</summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Oui, tu peux exporter en PDF professionnel et en CSV.</p>
            </details>
            <details className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer group">
              <summary className="font-semibold">Le support est-il inclus ?</summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Le support email est inclus avec le plan Pro.</p>
            </details>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="mx-auto grid max-w-300 grid-cols-1 gap-8 px-5 sm:px-6 md:grid-cols-3">
          <div>
            <h4 className="mb-3 text-sm font-bold text-white">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white transition" href="#features">Features</a></li>
              <li><a className="hover:text-white transition" href="#pricing">Pricing</a></li>
              <li><a className="hover:text-white transition" href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white transition" href="#">Terms</a></li>
              <li><a className="hover:text-white transition" href="#">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-white">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white transition" href="mailto:sales@riasaas.com">sales@riasaas.com</a></li>
              <li><a className="hover:text-white transition" href="mailto:support@riasaas.com">support@riasaas.com</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
