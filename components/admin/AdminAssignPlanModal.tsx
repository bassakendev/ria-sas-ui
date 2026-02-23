'use client';

import { forceAdminUserPlan } from '@/lib/admin/subscriptions';
import type { AdminUserSummary } from '@/lib/admin/types';
import { Gift, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface AdminAssignPlanModalProps {
  user: AdminUserSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanAssigned?: () => void;
}

export function AdminAssignPlanModal({
  user,
  isOpen,
  onClose,
  onPlanAssigned,
}: AdminAssignPlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');
  const [reason, setReason] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAssign = useCallback(async () => {
    if (!user) return;
    setIsAssigning(true);
    setError(null);

    try {
      await forceAdminUserPlan(user.id, selectedPlan, reason || undefined);
      setShowConfirm(false);
      setReason('');
      setSelectedPlan('pro');
      onPlanAssigned?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'affectation du plan';
      setError(message);
    } finally {
      setIsAssigning(false);
    }
  }, [user, selectedPlan, reason, onPlanAssigned, onClose]);

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Gift size={20} className="text-green-600" />
              Affecter un plan
            </h2>
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

            {/* User info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Utilisateur</p>
              <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Plan actuel: <span className="font-semibold text-gray-700 dark:text-gray-300">{user.plan.toUpperCase()}</span></p>
            </div>

            {/* Plan selection */}
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-2">Plan à affecter</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    value="free"
                    checked={selectedPlan === 'free'}
                    onChange={(e) => setSelectedPlan(e.target.value as 'free' | 'pro')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Gratuit</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Plan de base</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    value="pro"
                    checked={selectedPlan === 'pro'}
                    onChange={(e) => setSelectedPlan(e.target.value as 'free' | 'pro')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Pro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Plan payant avec toutes les fonctionnalités</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-2">Raison (optionnel)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Migration depuis ancien système, promotion spéciale..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isAssigning}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={() => setShowConfirm(true)}
              disabled={isAssigning}
            >
              Affecter le plan
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirmer l'affectation du plan ?"
        message={`Vous êtes sur le point d'affecter le plan ${selectedPlan.toUpperCase()} à ${user.email}. Cette action est immédiate et irréversible.`}
        confirmText="Oui, affecter"
        cancelText="Annuler"
        isDangerous={false}
        onConfirm={handleAssign}
        onCancel={() => setShowConfirm(false)}
        isLoading={isAssigning}
      />
    </>
  );
}
