'use client';

import { ProtectLoginRegister } from '@/components/auth/ProtectLoginRegister';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Check, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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
              Simplifiez votre gestion dès aujourd&apos;hui.
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed mb-8">
              Créez votre compte et commencez à gérer vos clients et factures en toute simplicité.
            </p>

            {/* Value propositions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Clients illimités</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Factures professionnelles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Suivi des paiements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
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
                  Créer un compte
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Gratuit et sans engagement.
                </p>
              </div>

              <RegisterForm
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

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Déjà un compte ?{' '}
                  <Link
                    href="/login"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Se connecter
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
