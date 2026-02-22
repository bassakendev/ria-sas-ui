'use client';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { deleteAccount, fetchUserData, updateProfile, UpdateProfilePayload } from '@/lib/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { Building2, Loader, Lock, Mail, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { toasts, addToast, removeToast } = useToast();

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.replace('/login');
            return;
        }

        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                setEmail(data.email);
                setCompanyName(data.company_name);
            } catch (err) {
                console.error('Erreur:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            loadUserData();
        }
    }, [isLoggedIn, authLoading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            addToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        try {
            setIsUpdating(true);
            const payload: UpdateProfilePayload = {
                email,
                company_name: companyName,
            };

            if (newPassword) {
                payload.password = newPassword;
            }

            await updateProfile(payload);
            addToast('Profil mis à jour avec succès', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error('Erreur:', err);
            addToast(err instanceof Error ? err.message : 'Impossible de mettre à jour le profil', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await deleteAccount();
            addToast('Votre compte a été supprimé avec succès', 'success');
            setShowDeleteModal(false);
            logout();
            router.replace('/');
        } catch (err) {
            console.error('Erreur:', err);
            addToast(err instanceof Error ? err.message : 'Impossible de supprimer le compte', 'error');
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-8 w-8" />
                    Paramètres du compte
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Gérez vos informations personnelles et votre compte.
                </p>
            </div>

            {/* Formulaire de modification du profil */}
            <form onSubmit={handleUpdateProfile} className="mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Informations du profil
                    </h2>

                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Mail className="h-4 w-4 inline mr-1" />
                                Adresse e-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        {/* Nom de l'entreprise */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Building2 className="h-4 w-4 inline mr-1" />
                                Nom de l&apos;entreprise
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Modification du mot de passe */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Modifier le mot de passe
                    </h2>

                    <div className="space-y-4">
                        {/* Mot de passe actuel */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Lock className="h-4 w-4 inline mr-1" />
                                Mot de passe actuel
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Laissez vide pour ne pas modifier"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        {/* Nouveau mot de passe */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Lock className="h-4 w-4 inline mr-1" />
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Laissez vide pour ne pas modifier"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>

                        {/* Confirmation du mot de passe */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Lock className="h-4 w-4 inline mr-1" />
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Laissez vide pour ne pas modifier"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Bouton de sauvegarde */}
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isUpdating && <Loader className="h-4 w-4 animate-spin" />}
                    Enregistrer les modifications
                </button>
            </form>

            {/* Zone dangereuse */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 p-6">
                <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Zone dangereuse
                </h2>

                <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                    Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                    Cette action est irréversible.
                </p>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                    className="w-full bg-red-600 dark:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isDeleting && <Loader className="h-4 w-4 animate-spin" />}
                    <Trash2 className="h-4 w-4" />
                    Supprimer mon compte
                </button>
            </div>
            
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Supprimer votre compte"
                message={"⚠️ ATTENTION : Cette action est irréversible.\n\nÊtes-vous vraiment sûr de vouloir supprimer votre compte ?\n\nToutes vos données, factures et clients seront définitivement supprimés."}
                confirmText="Supprimer définitivement"
                cancelText="Annuler"
                isDangerous={true}
                isProcessing={isDeleting}
            />
            
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
