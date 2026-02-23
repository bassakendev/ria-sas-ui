'use client';

import { AdminFeedbackDetailModal } from '@/components/admin/AdminFeedbackDetailModal';
import { Toast, useToast } from '@/components/ui/Toast';
import { deleteAdminFeedback, getAdminFeedbacks, updateAdminFeedbackStatus } from '@/lib/admin/feedbacks';
import type { AdminFeedbackSummary } from '@/lib/admin/types';
import { Eye, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function AdminFeedbacksPage() {
    const { toasts, addToast, removeToast } = useToast();
    const [feedbacks, setFeedbacks] = useState<AdminFeedbackSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [type, setType] = useState<'question' | 'bug' | 'feature' | 'other' | ''>('');
    const [status, setStatus] = useState<'submitted' | 'in_review' | 'responded' | 'closed' | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [workingId, setWorkingId] = useState<string | null>(null);
    const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedbackSummary | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAdminFeedbacks({
                page,
                limit,
                type: type || undefined,
                status: status || undefined,
            });
            setFeedbacks(response.feedbacks);
            setTotal(response.total);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            addToast(message, 'error', 5000);
        } finally {
            setLoading(false);
        }
    }, [limit, page, status, type, addToast]);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    const handleStatusChange = async (feedbackId: string, nextStatus: AdminFeedbackSummary['status']) => {
        setWorkingId(feedbackId);
        try {
            await updateAdminFeedbackStatus(feedbackId, nextStatus);
            await fetchFeedbacks();
            addToast('Statut mis à jour avec succès', 'success', 3000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
            setError(message);
            addToast(message, 'error', 5000);
        } finally {
            setWorkingId(null);
        }
    };

    const handleDelete = async (feedbackId: string) => {
        setWorkingId(feedbackId);
        try {
            await deleteAdminFeedback(feedbackId);
            await fetchFeedbacks();
            addToast('Feedback supprimé avec succès', 'success', 3000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
            setError(message);
            addToast(message, 'error', 5000);
        } finally {
            setWorkingId(null);
        }
    };

    const handleOpenDetail = (feedback: AdminFeedbackSummary) => {
        setSelectedFeedback(feedback);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedFeedback(null);
    };

    const handleFeedbackUpdated = () => {
        fetchFeedbacks();
    };

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="space-y-6">
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feedbacks</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Traiter les demandes, bugs et suggestions.
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={type}
                        onChange={(event) => {
                            setType(event.target.value as 'question' | 'bug' | 'feature' | 'other' | '');
                            setPage(1);
                        }}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">Tous les types</option>
                        <option value="question">Question</option>
                        <option value="bug">Bug</option>
                        <option value="feature">Suggestion</option>
                        <option value="other">Autre</option>
                    </select>
                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value as 'submitted' | 'in_review' | 'responded' | 'closed' | '');
                            setPage(1);
                        }}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="submitted">Soumis</option>
                        <option value="in_review">En cours</option>
                        <option value="responded">Repondu</option>
                        <option value="closed">Ferme</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sujet</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Cree le</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-red-600 dark:text-red-400" />
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">Chargement des feedbacks...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && feedbacks.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Aucun feedback trouvé avec les filtres appliques.</p>
                                </td>
                            </tr>
                        )}
                        {!loading && feedbacks.map((feedback) => (
                            <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{feedback.subject}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {feedback.id}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{feedback.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{feedback.type}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={feedback.status}
                                        onChange={(event) => handleStatusChange(feedback.id, event.target.value as AdminFeedbackSummary['status'])}
                                        disabled={workingId === feedback.id}
                                        className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white disabled:opacity-60"
                                    >
                                        <option value="submitted">Soumis</option>
                                        <option value="in_review">En cours</option>
                                        <option value="responded">Repondu</option>
                                        <option value="closed">Ferme</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {new Date(feedback.createdAt).toLocaleString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenDetail(feedback)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(feedback.id)}
                                        disabled={workingId === feedback.id}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 disabled:opacity-60"
                                    >
                                        {workingId === feedback.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {total} feedbacks • Page {page} sur {totalPages}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50"
                    >
                        Precedent
                    </button>
                    <button
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={page >= totalPages}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>

            <AdminFeedbackDetailModal
                feedback={selectedFeedback}
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                onFeedbackUpdated={handleFeedbackUpdated}
            />
        </div>
    );
}
