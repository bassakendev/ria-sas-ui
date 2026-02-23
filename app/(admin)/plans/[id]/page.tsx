/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { SubscriptionPlanAdmin } from '@/lib/admin/plans';
import { useAdminGuard } from '@/lib/hooks';
import { useAdminPlans } from '@/lib/hooks/useAdminPlans';
import { ChevronLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPlanPage() {
    const router = useRouter();
    const params = useParams();
    const planId = params.id as string;
    const { loading: authLoading, isAuthorized, role } = useAdminGuard();
    const { getPlan, update, delete: deletePlan } = useAdminPlans();
    const { toasts, addToast, removeToast } = useToast();

    const [plan, setPlan] = useState<SubscriptionPlanAdmin | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState<{
        code: string;
        name: string;
        price: number;
        currency: string;
        interval: 'month' | 'year';
        features: string[];
        limits: {
            clients: number;
            invoices: number;
            storage: number;
        };
        stripe_product_id: string;
        stripe_price_id: string;
    }>({
        code: '',
        name: '',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [] as string[],
        limits: {
            clients: 1,
            invoices: 1,
            storage: 1,
        },
        stripe_product_id: '',
        stripe_price_id: '',
    });

    // Load plan data
    useEffect(() => {
        const loadPlan = async () => {
            try {
                const data = await getPlan(planId);
                setPlan(data);
                setFormData({
                    code: data.code,
                    name: data.name,
                    price: data.price,
                    currency: data.currency,
                    interval: data.interval,
                    features: data.features || [],
                    limits: {
                        clients: data.limits?.clients ?? 1,
                        invoices: data.limits?.invoices ?? 1,
                        storage: data.limits?.storage ?? 1,
                    },
                    stripe_product_id: data.stripe_product_id || '',
                    stripe_price_id: data.stripe_price_id || '',
                });
            } catch (err) {
                addToast('Erreur lors du chargement du plan', 'error');
                router.push('/admin/plans');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && isAuthorized) {
            loadPlan();
        }
    }, [planId, authLoading, isAuthorized, getPlan, addToast, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('limits.')) {
            const limitKey = name.split('.')[1] as keyof typeof formData.limits;
            setFormData((prev) => ({
                ...prev,
                limits: {
                    ...prev.limits,
                    [limitKey]: parseInt(value) || 0,
                },
            }));
        } else if (name === 'price') {
            setFormData((prev) => ({
                ...prev,
                [name]: parseFloat(value) || 0,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFeatureAdd = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, ''],
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((f, i) => (i === index ? value : f)),
        }));
    };

    const handleFeatureRemove = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        // Validate
        if (!formData.name.trim()) {
            addToast('Le nom du plan est requis', 'error');
            return;
        }
        if (!formData.code.trim()) {
            addToast('Le code du plan est requis', 'error');
            return;
        }

        setSaving(true);
        try {
            await update(planId, formData);
            addToast('Plan mis à jour avec succès', 'success');
            router.push('/admin/plans');
        } catch (err) {
            addToast('Erreur lors de la mise à jour du plan', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deletePlan(planId);
            addToast('Plan supprimé avec succès', 'success');
            router.push('/admin/plans');
        } catch (err) {
            addToast('Erreur lors de la suppression du plan', 'error');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    const isReadOnly = role !== 'admin' && role !== 'superadmin';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/admin/plans')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modifier le plan</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{plan?.name}</p>
                    </div>
                </div>

                {/* Form */}
                <Card className="p-8 mb-6">
                    {/* Basic Info */}
                    <div className="space-y-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Informations générales</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nom du plan
                            </label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isReadOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Code du plan
                            </label>
                            <Input
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                placeholder="Ex: pro, enterprise"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Devise
                                </label>
                                <Input
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                    placeholder="USD"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Intervalle
                                </label>
                                <select
                                    name="interval"
                                    value={formData.interval}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <option value="month">Mensuel</option>
                                    <option value="year">Annuel</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Prix ({formData.currency}/{formData.interval === 'month' ? 'mois' : 'an'})
                            </label>
                            <Input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fonctionnalités</h2>
                            {!isReadOnly && (
                                <button
                                    onClick={handleFeatureAdd}
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    ➕ Ajouter
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {formData.features.map((feature, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                        placeholder="Ex: Support par email"
                                        disabled={isReadOnly}
                                    />
                                    {!isReadOnly && (
                                        <button
                                            onClick={() => handleFeatureRemove(idx)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Limites</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Clients max (-1 = illimité)
                                </label>
                                <Input
                                    name="limits.clients"
                                    type="number"
                                    value={formData.limits.clients}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Factures max (-1 = illimité)
                                </label>
                                <Input
                                    name="limits.invoices"
                                    type="number"
                                    value={formData.limits.invoices}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stockage GB (-1 = illimité)
                                </label>
                                <Input
                                    name="limits.storage"
                                    type="number"
                                    value={formData.limits.storage}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stripe Ids */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Identifiants Stripe</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ID Produit Stripe
                                </label>
                                <Input
                                    name="stripe_product_id"
                                    value={formData.stripe_product_id}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                    placeholder="prod_xxxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ID Prix Stripe
                                </label>
                                <Input
                                    name="stripe_price_id"
                                    value={formData.stripe_price_id}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                    placeholder="price_xxxxx"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    {!isReadOnly && (
                        <>
                            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>
                            {role === 'superadmin' && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    disabled={deleting}
                                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {deleting ? 'Suppression...' : 'Supprimer'}
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => router.push('/admin/plans')}
                        className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Annuler
                    </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <Card className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Êtes-vous sûr de vouloir supprimer le plan &quot;{plan?.name}&quot; ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                                >
                                    {deleting ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
