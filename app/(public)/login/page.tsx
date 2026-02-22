'use client';

import { ProtectLoginRegister } from '@/components/auth/ProtectLoginRegister';
import { LoginForm } from '@/components/forms/LoginForm';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <ProtectLoginRegister>
      <div className="min-h-screen flex flex-col lg:flex-row relative">
        {/* Theme Toggle - Fixed top right */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold">RIA SaaS</span>
            </div>

            {/* Main message */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Reprenez le contrôle de vos paiements.
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed">
              Connectez-vous pour gérer vos clients et factures en toute simplicité.
            </p>

            {/* Optional illustration placeholder */}
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <svg viewBox="0 0 400 280" className="w-full h-auto">
                <rect x="20" y="20" width="360" height="240" rx="12" className="fill-white/10" />
                <rect x="40" y="50" width="100" height="60" rx="8" className="fill-white/20" />
                <rect x="160" y="50" width="100" height="60" rx="8" className="fill-white/20" />
                <rect x="280" y="50" width="80" height="60" rx="8" className="fill-white/20" />
                <rect x="40" y="130" width="320" height="110" rx="8" className="fill-white/20" />
                <rect x="60" y="155" width="80" height="6" rx="3" className="fill-blue-300" />
                <rect x="60" y="175" width="200" height="6" rx="3" className="fill-white/30" />
                <rect x="60" y="195" width="160" height="6" rx="3" className="fill-white/30" />
                <rect x="60" y="215" width="180" height="6" rx="3" className="fill-white/30" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-gray-950">
          <div className="w-full max-w-105">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-lg bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">RIA SaaS</span>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Connexion
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Entrez vos informations pour accéder à votre espace.
                </p>
              </div>

              <LoginForm
                onSuccess={() => {
                  router.push('/dashboard');
                }}
              />

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Ou
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Pas encore de compte ?{' '}
                  <Link
                    href="/register"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectLoginRegister>
  );
}
