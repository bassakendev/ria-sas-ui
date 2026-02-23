'use client';

import { AdminLoginForm } from '@/components/forms/AdminLoginForm';
import { PageLoader } from '@/components/ui/Loader';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { fetchUserData } from '@/lib/auth';
import { Lock, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [isReady,] = useState(true);

    useEffect(() => {
        // Check if already logged in as admin/superadmin
        const token = localStorage.getItem('token');
        if (!token) {
            // Not logged in at all
            return;
        }

        // Check user role
        fetchUserData()
            .then((userData) => {
                if (userData.role === 'admin' || userData.role === 'superadmin') {
                    // Already admin, redirect to dashboard
                    router.push('/admin');
                    return;
                }
            })
            .catch(() => {
                // Error fetching user data, allow login attempt
            });
    }, [router]);

    if (!isReady) {
        return (
            <PageLoader />
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row relative">
            {/* Theme Toggle - Fixed top right */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Left Side - Admin Portal Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-red-600 to-red-800 dark:from-red-700 dark:to-red-900 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold">Admin Portal</span>
                    </div>

                    {/* Main message */}
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        Tableau de bord administrateur
                    </h1>

                    <p className="text-lg text-red-100 leading-relaxed mb-8">
                        Accédez aux outils de gestion avancés réservés aux administrateurs.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Gestion utilisateurs</p>
                                <p className="text-sm text-red-100">Rôles, accès, statuts</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Analytics en temps réel</p>
                                <p className="text-sm text-red-100">Utilisateurs, revenue, churn</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Accès sécurisé</p>
                                <p className="text-sm text-red-100">Audit complet de toutes les actions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</span>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Portail Admin
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Connectez-vous avec votre compte administrateur
                        </p>
                    </div>

                    {/* Login Form */}
                    <AdminLoginForm />

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Accès réservé aux administrateurs uniquement.{' '}
                            <Link href="/login" className="text-red-600 dark:text-red-400 hover:underline font-semibold">
                                Retour à la connexion utilisateur
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
