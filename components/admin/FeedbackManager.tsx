/**
 * Composant Admin Feedback Manager
 * Gestion complète des feedbacks pour les administrateurs
 */

'use client';

import type { FeedbackPriority, FeedbackStatus, FeedbackType } from '@/consts/feedback';
import { feedbackPriorityConfig, feedbackStatusConfig, feedbackTypeConfig } from '@/consts/feedback';
import { useDeleteFeedback, useFeedbackList, useFeedbackStats, useUpdateFeedback } from '@/lib/hooks/useFeedback';
import { AlertCircle, ChevronDown, MessageSquare, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FeedbackManager() {
    const { feedbacks, total, loading, fetch } = useFeedbackList();
    const { stats, fetch: fetchStats } = useFeedbackStats();
    const { delete: deleteFeedback } = useDeleteFeedback();
    const { update: updateFeedback } = useUpdateFeedback();

    const [filters, setFilters] = useState<{
        type?: FeedbackType;
        status?: FeedbackStatus;
        page: number;
        limit: number;
    }>({
        page: 1,
        limit: 10,
    });

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [response, setResponse] = useState<Record<string, string>>({});

    // Charger les feedbacks au montage
    useEffect(() => {
        fetch(filters);
        fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStatusChange = async (id: string, status: FeedbackStatus) => {
        try {
            const validStatuses = ['closed', 'open', 'reviewing', 'in-progress'];
            if (validStatuses.includes(status)) {
                await updateFeedback(id, { status: status as 'closed' | 'open' | 'reviewing' | 'in-progress' });
                fetch(filters);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const handlePriorityChange = async (id: string, priority: FeedbackPriority) => {
        try {
            const validPriorities = ['low', 'medium', 'high'];
            if (validPriorities.includes(priority)) {
                await updateFeedback(id, { priority: priority as 'low' | 'medium' | 'high' });
                fetch(filters);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const handleRespond = async (id: string) => {
        const responseText = response[id];
        if (!responseText) return;

        try {
            await updateFeedback(id, {
                response: responseText,
                status: 'closed',
            });
            setResponse({ ...response, [id]: '' });
            fetch(filters);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la réponse:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) return;

        try {
            await deleteFeedback(id);
            fetch(filters);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const getTypeIcon = (type: FeedbackType) => {
        const config = feedbackTypeConfig[type];
        switch (config.icon) {
            case 'AlertCircle':
                return <AlertCircle className="h-5 w-5" />;
            default:
                return <MessageSquare className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête et statistiques */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Gestion des Feedbacks
                </h2>

                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.total}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                Feedbacks totaux
                            </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                {stats.byType.bug}
                            </div>
                            <div className="text-sm text-red-700 dark:text-red-300">
                                Bugs signalés
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.byStatus.in_review}
                            </div>
                            <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                En cours de révision
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {Math.round(stats.avgResponseTime || 0)}h
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                                Temps moyen de réponse
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        value={filters.type || ''}
                        onChange={(e) => setFilters({
                            ...filters,
                            type: e.target.value ? (e.target.value as FeedbackType) : undefined,
                            page: 1,
                        })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">Tous les types</option>
                        {Object.entries(feedbackTypeConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status || ''}
                        onChange={(e) => setFilters({
                            ...filters,
                            status: e.target.value ? (e.target.value as FeedbackStatus) : undefined,
                            page: 1,
                        })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">Tous les statuts</option>
                        {Object.entries(feedbackStatusConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => fetch(filters)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Chargement...' : 'Appliquer'}
                    </button>
                </div>
            </div>

            {/* Liste des feedbacks */}
            <div className="space-y-3">
                {feedbacks.map((feedback) => {
                    const isExpanded = expandedId === feedback.id;
                    const typeConfig = feedbackTypeConfig[feedback.type];
                    const statusConfig = feedbackStatusConfig[feedback.status];

                    return (
                        <div
                            key={feedback.id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            {/* En-tête du feedback */}
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : feedback.id)}
                                className="w-full p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-start gap-4 flex-1 text-left">
                                    <div className={`shrink-0 text-${typeConfig.color}-600`}>
                                        {getTypeIcon(feedback.type)}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {feedback.subject}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {feedback.email} • {feedback.type}
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-50 dark:bg-${statusConfig.color}-900/20 text-${statusConfig.color}-700 dark:text-${statusConfig.color}-300`}>
                                                {statusConfig.label}
                                            </span>
                                            {feedback.priority && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${feedbackPriorityConfig[feedback.priority].color}-50 dark:bg-${feedbackPriorityConfig[feedback.priority].color}-900/20 text-${feedbackPriorityConfig[feedback.priority].color}-700 dark:text-${feedbackPriorityConfig[feedback.priority].color}-300`}>
                                                    {feedbackPriorityConfig[feedback.priority].label}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <ChevronDown
                                    className={`shrink-0 h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Détails du feedback */}
                            {isExpanded && (
                                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                                    {/* Message */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Message
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                            {feedback.message}
                                        </p>
                                    </div>

                                    {/* Informations */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">Créé:</span>
                                            <br />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {new Date(feedback.createdAt).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                        {feedback.sourceUrl && (
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">Source:</span>
                                                <br />
                                                <a
                                                    href={feedback.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-xs truncate"
                                                >
                                                    {new URL(feedback.sourceUrl).pathname}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Réponse existante */}
                                    {feedback.response && (
                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                            <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                                                ✓ Réponse
                                            </h4>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                {feedback.response}
                                            </p>
                                        </div>
                                    )}

                                    {/* Contrôles */}
                                    <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {/* Changer le statut */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                Statut
                                            </label>
                                            <select
                                                value={feedback.status}
                                                onChange={(e) => handleStatusChange(feedback.id, e.target.value as FeedbackStatus)}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                {Object.entries(feedbackStatusConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Changer la priorité */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                Priorité
                                            </label>
                                            <select
                                                value={feedback.priority || ''}
                                                onChange={(e) => handlePriorityChange(feedback.id, e.target.value as FeedbackPriority)}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="">Aucune</option>
                                                {Object.entries(feedbackPriorityConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Ajouter une réponse */}
                                        {feedback.status !== 'closed' && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Réponse
                                                </label>
                                                <textarea
                                                    value={response[feedback.id] || ''}
                                                    onChange={(e) => setResponse({ ...response, [feedback.id]: e.target.value })}
                                                    placeholder="Répondre à ce feedback..."
                                                    rows={3}
                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => handleRespond(feedback.id)}
                                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                                >
                                                    Envoyer la réponse
                                                </button>
                                            </div>
                                        )}

                                        {/* Bouton supprimer */}
                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            className="w-full px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {total > 0 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                        disabled={filters.page === 1}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        Page {filters.page} sur {Math.ceil(total / filters.limit)}
                    </span>
                    <button
                        onClick={() => setFilters({
                            ...filters,
                            page: Math.min(Math.ceil(total / filters.limit), filters.page + 1),
                        })}
                        disabled={filters.page >= Math.ceil(total / filters.limit)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}
