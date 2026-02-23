'use client';

import type { AdminUserSummary } from '@/lib/admin/types';
import { deleteAdminUser } from '@/lib/admin/users';
import { Gift, Mail, Shield, Trash2, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface AdminUserDetailModalProps {
    user: AdminUserSummary | null;
    isOpen: boolean;
    onClose: () => void;
    onUserDeleted?: () => void;
    onOpenAssignPlan?: () => void;
}

export function AdminUserDetailModal({
    user,
    isOpen,
    onClose,
    onUserDeleted,
    onOpenAssignPlan,
}: AdminUserDetailModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = useCallback(async () => {
        if (!user) return;
        setIsDeleting(true);
        setError(null);

        try {
            await deleteAdminUser(user.id);
            setShowDeleteConfirm(false);
            onUserDeleted?.();
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
            setError(message);
        } finally {
            setIsDeleting(false);
        }
    }, [user, onClose, onUserDeleted]);

    if (!isOpen || !user) return null;

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Détails de l&apos;utilisateur</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</label>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail size={16} className="text-gray-400" />
                                <p className="text-gray-900 dark:text-white break-all">{user.email}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rôle</label>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield size={16} className="text-gray-400" />
                                <span className={getRoleColor(user.role) + ' px-2 py-1 rounded text-xs font-medium'}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Statut</label>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={getStatusColor(user.status) + ' px-2 py-1 rounded text-xs font-medium'}>
                                    {user.status === 'active' ? 'Actif' : 'Suspendu'}
                                </span>
                            </div>
                        </div>

                        {/* Current Plan */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Plan actuel</label>
                            <p className="text-gray-900 dark:text-white mt-1">
                                {user.planName || 'Aucun plan'}
                            </p>
                        </div>

                        {/* Joined Date */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Inscrit depuis</label>
                            <p className="text-gray-900 dark:text-white mt-1">
                                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        {/* Last Login */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Dernière connexion</label>
                            <p className="text-gray-900 dark:text-white mt-1">
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : 'Jamais'}
                            </p>
                        </div>
                    </div>

                    {/* Footer - Delete Button */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-2">
                        <Button
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => {
                                onOpenAssignPlan?.();
                                onClose();
                            }}
                            disabled={isDeleting}
                        >
                            <Gift size={16} />
                            Affecter un plan
                        </Button>
                        <Button
                            variant="danger"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isDeleting}
                            isLoading={isDeleting}
                        >
                            <Trash2 size={16} />
                            Supprimer l&apos;utilisateur
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Supprimer l'utilisateur ?"
                message={`Êtes-vous sûr de vouloir supprimer ${user.email} ? Cette action est irréversible.`}
                confirmText="Oui, supprimer"
                cancelText="Annuler"
                isDangerous={true}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isLoading={isDeleting}
            />
        </>
    );
}
