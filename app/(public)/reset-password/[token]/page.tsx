'use client';

import { ProtectLoginRegister } from '@/components/auth/ProtectLoginRegister';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { resetPassword } from '@/lib/auth';
import { ArrowLeft, Eye, EyeOff, FileText, Lock } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword({ token, password });
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

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
                            Nouveau mot de passe
                        </h1>

                        <p className="text-lg text-blue-100 leading-relaxed">
                            Choisissez un mot de passe sécurisé pour protéger votre compte et vos données.
                        </p>

                        {/* Optional illustration */}
                        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="flex items-center justify-center">
                                <Lock className="h-24 w-24 text-white/40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 mb-8">
                            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">RIA SaaS</span>
                        </div>

                        {/* Back to login */}
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour à la connexion
                        </Link>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Créer un nouveau mot de passe
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Votre nouveau mot de passe doit être différent des mots de passe précédents
                            </p>
                        </div>

                        {success ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0">
                                        <svg
                                            className="h-6 w-6 text-green-600 dark:text-green-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-1">
                                            Mot de passe réinitialisé !
                                        </h3>
                                        <p className="text-sm text-green-700 dark:text-green-400">
                                            Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/login"
                                    className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    Se connecter maintenant
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nouveau mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Au moins 8 caractères"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-shadow pr-12"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                                                <div className={`h-1 flex-1 rounded ${password.length >= 12 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                                                <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {password.length >= 12 ? 'Fort' : password.length >= 8 ? 'Moyen' : 'Faible'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Retapez votre mot de passe"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-shadow pr-12"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && (
                                        <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {password === confirmPassword ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || password !== confirmPassword || password.length < 8}
                                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Réinitialisation...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-5 w-5" />
                                            Réinitialiser le mot de passe
                                        </>
                                    )}
                                </button>

                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Vous vous souvenez de votre mot de passe ?{' '}
                                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                        Connectez-vous
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </ProtectLoginRegister>
    );
}
