/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getAdminFeedbackDetail, updateAdminFeedbackResponse, updateAdminFeedbackStatus } from '@/lib/admin/feedbacks';
import type { AdminFeedbackSummary } from '@/lib/admin/types';
import { MessageCircle, MessageSquare, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/Button';

interface AdminFeedbackDetailModalProps {
  feedback: AdminFeedbackSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackUpdated?: () => void;
}

export function AdminFeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
  onFeedbackUpdated,
}: AdminFeedbackDetailModalProps) {
  const [detail, setDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && feedback) {
      setIsLoading(true);
      setError(null);
      setResponse('');

      getAdminFeedbackDetail(feedback.id)
        .then((data) => {
          setDetail(data);
          setResponse(data.response || '');
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : 'Erreur au chargement';
          setError(message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, feedback]);

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      if (!feedback) return;
      setIsSaving(true);
      setError(null);

      try {
        await updateAdminFeedbackStatus(feedback.id, newStatus as any);
        setDetail({ ...detail, status: newStatus });
        onFeedbackUpdated?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
        setError(message);
      } finally {
        setIsSaving(false);
      }
    },
    [feedback, detail, onFeedbackUpdated]
  );

  const handleSaveResponse = useCallback(async () => {
    if (!feedback) return;
    setIsSaving(true);
    setError(null);

    try {
      const updated = await updateAdminFeedbackResponse(feedback.id, response);
      setDetail(updated);
      onFeedbackUpdated?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [feedback, response, onFeedbackUpdated]);

  if (!isOpen || !feedback) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'question':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bug: 'Bug',
      feature: 'Fonctionnalité',
      question: 'Question',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      submitted: 'Soumis',
      in_review: 'En examen',
      responded: 'Répondu',
      closed: 'Fermé',
    };
    return labels[status] || status;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{feedback.subject}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feedback.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 shrink-0 ml-4"
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

            {isLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Chargement du détail...
              </div>
            ) : detail ? (
              <>
                {/* Type & Status Badges */}
                <div className="flex gap-2 flex-wrap">
                  <div className={getTypeColor(feedback.type) + ' px-3 py-1 rounded-full text-sm font-medium'}>
                    {getTypeLabel(feedback.type)}
                  </div>
                  <div className={getStatusColor(feedback.status) + ' px-3 py-1 rounded-full text-sm font-medium'}>
                    {getStatusLabel(feedback.status)}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded p-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Soumis le</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {new Date(feedback.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Statut</label>
                    <select
                      value={feedback.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isSaving}
                      className="w-full mt-1 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="submitted">Soumis</option>
                      <option value="in_review">En examen</option>
                      <option value="responded">Répondu</option>
                      <option value="closed">Fermé</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-2">Message</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap wrap-break-word">
                      {detail.message}
                    </p>
                  </div>
                </div>

                {/* Response Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-green-600" />
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Réponse</label>
                  </div>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Écrivez votre réponse ici..."
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    rows={4}
                  />
                  {detail.respondedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Répondu le {new Date(detail.respondedAt).toLocaleDateString('fr-FR')}
                      {detail.respondedBy && ` par ${detail.respondedBy}`}
                    </p>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* Footer */}
          {detail && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={onClose}
                disabled={isSaving}
              >
                Fermer
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveResponse}
                disabled={isSaving}
                isLoading={isSaving}
              >
                <MessageSquare size={16} />
                Enregistrer la réponse
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
