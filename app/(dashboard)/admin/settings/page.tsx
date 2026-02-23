'use client';

import { Toast, useToast } from '@/components/ui/Toast';
import type { AdminSettingsResponse } from '@/lib/admin/types';
import { useAdminSettings } from '@/lib/hooks/useAdminSettings';
import { Bell, CreditCard, Globe, Loader2, Lock, Server, Shield, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const settingsSections = [
  {
    id: 'security',
    title: 'Securite',
    description: 'MFA, rotation des tokens, politiques de mot de passe.',
    icon: Shield,
  },
  {
    id: 'access',
    title: 'Acces & roles',
    description: 'Gestion des roles admin et permissions sensibles.',
    icon: Users,
  },
  {
    id: 'billing',
    title: 'Facturation',
    description: 'Plans, remises, remboursements, liens Stripe.',
    icon: CreditCard,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Alertes SLA, emails, webhooks internes.',
    icon: Bell,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'CRM, analytics, support et webhooks sortants.',
    icon: Globe,
  },
  {
    id: 'system',
    title: 'Systeme',
    description: 'Sauvegardes, files, maintenance, logs.',
    icon: Server,
  },
  {
    id: 'audit',
    title: 'Audit & conformite',
    description: 'Journalisation, retention, export CSV.',
    icon: Lock,
  },
];

const defaultSettings: AdminSettingsResponse = {
  security: {
    mfaRequired: false,
    passwordMinLength: 10,
    tokenTtlMinutes: 120,
  },
  access: {
    allowAdminImpersonation: false,
    maxAdminSessions: 2,
  },
  billing: {
    prorationEnabled: true,
    gracePeriodDays: 7,
    defaultCurrency: 'EUR',
  },
  notifications: {
    slaWarningHours: 24,
    emailFrom: 'support@yourapp.com',
    webhookUrl: 'https://hooks.yourapp.com/admin',
  },
  integrations: {
    crmProvider: 'none',
    analyticsProvider: 'none',
  },
  system: {
    maintenanceMode: false,
    backupFrequencyHours: 24,
  },
  audit: {
    retentionDays: 365,
    exportEnabled: true,
  },
};

export default function AdminSettingsPage() {
  const { data, loading, saving, error, fetch, save } = useAdminSettings();
  const { toasts, addToast, removeToast } = useToast();
  const initialSettings = useMemo(() => data ?? defaultSettings, [data]);
  const [draft, setDraft] = useState<AdminSettingsResponse>(initialSettings);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    setDraft(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    if (error) {
      setConnectionError(error);
      addToast(error, 'error', 5000);
    }
  }, [error, addToast]);

  const handleSave = async () => {
    setConnectionError(null);
    try {
      await save(draft);
      addToast('Parametres mis à jour avec succès', 'success', 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setConnectionError(message);
      addToast(message, 'error', 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {loading && !data && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 dark:text-red-400" />
          <p className="text-gray-600 dark:text-gray-400 mt-3">Chargement des parametres...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Parametres Admin</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Configuration globale, securite et integrations.
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
            {connectionError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{connectionError}</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {settingsSections.map((section) => {
                const Icon = section.icon;

                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

      <div className="space-y-4">
        <section id="security" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Securite</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">MFA, tokens, politiques.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={draft.security.mfaRequired}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    security: { ...prev.security, mfaRequired: event.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              MFA obligatoire
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Longueur min. mot de passe
              <input
                type="number"
                min={8}
                value={draft.security.passwordMinLength}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    security: { ...prev.security, passwordMinLength: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Duree token (min)
              <input
                type="number"
                min={30}
                value={draft.security.tokenTtlMinutes}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    security: { ...prev.security, tokenTtlMinutes: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        </section>

        <section id="access" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Acces & roles</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gestion des privileges.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={draft.access.allowAdminImpersonation}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    access: { ...prev.access, allowAdminImpersonation: event.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              Autoriser l'impersonation admin
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Sessions admin max
              <input
                type="number"
                min={1}
                value={draft.access.maxAdminSessions}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    access: { ...prev.access, maxAdminSessions: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        </section>

        <section id="billing" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Facturation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Regles de facturation.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={draft.billing.prorationEnabled}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    billing: { ...prev.billing, prorationEnabled: event.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              Proration active
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Periode de grace (jours)
              <input
                type="number"
                min={0}
                value={draft.billing.gracePeriodDays}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    billing: { ...prev.billing, gracePeriodDays: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Devise
              <input
                type="text"
                value={draft.billing.defaultCurrency}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    billing: { ...prev.billing, defaultCurrency: event.target.value },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        </section>

        <section id="notifications" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Alertes et canaux.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Alerte SLA (heures)
              <input
                type="number"
                min={1}
                value={draft.notifications.slaWarningHours}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, slaWarningHours: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Email d'envoi
              <input
                type="email"
                value={draft.notifications.emailFrom}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailFrom: event.target.value },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Webhook interne
              <input
                type="url"
                value={draft.notifications.webhookUrl}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, webhookUrl: event.target.value },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        </section>

        <section id="integrations" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Globe className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integrations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">CRM et analytics.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              CRM
              <select
                value={draft.integrations.crmProvider}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    integrations: { ...prev.integrations, crmProvider: event.target.value as AdminSettingsResponse['integrations']['crmProvider'] },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="none">Aucun</option>
                <option value="hubspot">HubSpot</option>
                <option value="salesforce">Salesforce</option>
              </select>
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Analytics
              <select
                value={draft.integrations.analyticsProvider}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    integrations: { ...prev.integrations, analyticsProvider: event.target.value as AdminSettingsResponse['integrations']['analyticsProvider'] },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="none">Aucun</option>
                <option value="mixpanel">Mixpanel</option>
                <option value="segment">Segment</option>
              </select>
            </label>
          </div>
        </section>

        <section id="system" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Server className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Systeme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance et sauvegardes.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={draft.system.maintenanceMode}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    system: { ...prev.system, maintenanceMode: event.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              Mode maintenance
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Frequence sauvegarde (h)
              <input
                type="number"
                min={1}
                value={draft.system.backupFrequencyHours}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    system: { ...prev.system, backupFrequencyHours: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
          </div>
        </section>

        <section id="audit" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit & conformite</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Retention et export.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Retention (jours)
              <input
                type="number"
                min={30}
                value={draft.audit.retentionDays}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    audit: { ...prev.audit, retentionDays: Number(event.target.value) },
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={draft.audit.exportEnabled}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    audit: { ...prev.audit, exportEnabled: event.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              Export CSV autorise
            </label>
          </div>
        </section>
      </div>
        </>
      )}
    </div>
  );
}
