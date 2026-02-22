/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/Button';
import { mockClients } from '@/consts/clients';
import { Mail, MapPin, Phone, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface FormData {
    clientId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    status: 'paid' | 'unpaid' | 'draft';
    items: InvoiceItem[];
    notes: string;
    taxEnabled: boolean;
    taxRate: number;
    watermarkEnabled: boolean;
    watermarkText: string;
    watermarkRotation: number;
    watermarkColor: string;
}

interface InvoiceFormBuilderProps {
    initialData?: any;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading?: boolean;
}

export function InvoiceFormBuilder({
    initialData,
    onSubmit,
    isLoading = false,
}: InvoiceFormBuilderProps) {
    const [formData, setFormData] = useState<FormData>(() => {
        const today = new Date().toISOString().split('T')[0];
        const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        return {
            clientId: initialData?.clientId || '',
            invoiceNumber: initialData?.invoiceNumber || `INV-2026-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
            invoiceDate: initialData?.invoiceDate || today,
            dueDate: initialData?.dueDate || defaultDueDate,
            status: initialData?.status || 'unpaid',
            items: initialData?.items || [
                { description: '', quantity: 1, unitPrice: 0, total: 0 }
            ],
            notes: initialData?.notes || '',
            taxEnabled: initialData?.taxEnabled ?? true,
            taxRate: initialData?.taxRate || 20,
            watermarkEnabled: initialData?.watermarkEnabled ?? false,
            watermarkText: initialData?.watermarkText || '',
            watermarkRotation: initialData?.watermarkRotation ?? -45,
            watermarkColor: initialData?.watermarkColor || '#6b7280',
        };
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState('');

    // Calculations
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = formData.taxEnabled ? subtotal * (formData.taxRate / 100) : 0;
    const total = subtotal + tax;

    // Get selected client
    const selectedClient = mockClients.find(c => c.id === formData.clientId);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

        // Recalculate total for this line
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
        }

        setFormData(prev => ({
            ...prev,
            items: newItems,
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.clientId) {
            newErrors.clientId = 'Veuillez sélectionner un client';
        }

        if (!formData.invoiceNumber) {
            newErrors.invoiceNumber = 'Le numéro de facture est requis';
        }

        if (formData.items.length === 0) {
            newErrors.items = 'Ajoutez au moins un article';
        }

        if (formData.items.some(item => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
            newErrors.items = 'Tous les articles doivent avoir une description, quantité > 0 et prix valide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            setSubmitError('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        try {
            await onSubmit(formData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setSubmitError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form - 60% */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
                        </div>
                    )}

                    {/* Client Selection */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Informations client
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Client <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.clientId}
                                onChange={(e) => handleInputChange('clientId', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.clientId ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <option value="">Sélectionner un client</option>
                                {mockClients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - {client.email}
                                    </option>
                                ))}
                            </select>
                            {errors.clientId && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.clientId}</p>
                            )}
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Détails de la facture
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Invoice Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Numéro de facture <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.invoiceNumber}
                                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Statut <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="unpaid">Impayée</option>
                                    <option value="paid">Payée</option>
                                </select>
                            </div>

                            {/* Invoice Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date de facture <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.invoiceDate}
                                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date d&apos;échéance <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Articles / Services
                            </h2>
                            <Button type="button" onClick={addItem} variant="secondary" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter ligne
                            </Button>
                        </div>

                        {/* Column Headers */}
                        <div className="grid grid-cols-12 gap-3 mb-2 px-3">
                            <div className="col-span-12 md:col-span-5">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Description du service/produit
                                </label>
                            </div>
                            <div className="col-span-4 md:col-span-2">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Quantité
                                </label>
                            </div>
                            <div className="col-span-4 md:col-span-2">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Prix unitaire HT
                                </label>
                            </div>
                            <div className="col-span-3 md:col-span-2">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Total HT
                                </label>
                            </div>
                            <div className="col-span-1 md:col-span-1"></div>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    {/* Description */}
                                    <div className="col-span-12 md:col-span-5">
                                        <input
                                            type="text"
                                            placeholder="Ex: Développement site web, Consultation..."
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-4 md:col-span-2">
                                        <input
                                            type="number"
                                            placeholder="1"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Unit Price */}
                                    <div className="col-span-4 md:col-span-2">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-3 md:col-span-2 flex items-center">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.total.toFixed(2)}€
                                        </p>
                                    </div>

                                    {/* Delete */}
                                    <div className="col-span-1 md:col-span-1 flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            disabled={formData.items.length === 1}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.items && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-2">{errors.items}</p>
                        )}

                        {/* Totals Summary */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            {/* Tax Configuration */}
                            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id="taxEnabled"
                                        checked={formData.taxEnabled}
                                        onChange={(e) => handleInputChange('taxEnabled', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="taxEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Appliquer la TVA
                                    </label>
                                </div>
                                {formData.taxEnabled && (
                                    <div className="ml-7 flex items-center gap-2">
                                        <label className="text-sm text-gray-600 dark:text-gray-400">
                                            Taux de TVA:
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.taxRate}
                                            onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                                            className="w-20 px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                                    </div>
                                )}
                            </div>

                            {/* Watermark Configuration */}
                            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id="watermarkEnabled"
                                        checked={formData.watermarkEnabled}
                                        onChange={(e) => handleInputChange('watermarkEnabled', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="watermarkEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Afficher le filigrane
                                    </label>
                                </div>
                                {formData.watermarkEnabled && (
                                    <div className="ml-7 space-y-3">
                                        {/* Watermark Text */}
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                                                Texte du filigrane:
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.watermarkText}
                                                onChange={(e) => handleInputChange('watermarkText', e.target.value)}
                                                placeholder={formData.status === 'paid' ? 'PAYÉE' : formData.status === 'draft' ? 'BROUILLON' : 'IMPAYÉE'}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {/* Watermark Rotation */}
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                                                Rotation (degrés): {formData.watermarkRotation}°
                                            </label>
                                            <input
                                                type="range"
                                                min="-90"
                                                max="90"
                                                step="5"
                                                value={formData.watermarkRotation}
                                                onChange={(e) => handleInputChange('watermarkRotation', parseFloat(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                            />
                                        </div>
                                        {/* Watermark Color */}
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                                                Couleur:
                                            </label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={formData.watermarkColor}
                                                    onChange={(e) => handleInputChange('watermarkColor', e.target.value)}
                                                    className="w-12 h-9 rounded border border-gray-200 dark:border-gray-700 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.watermarkColor}
                                                    onChange={(e) => handleInputChange('watermarkColor', e.target.value)}
                                                    placeholder="#6b7280"
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Personnalisez l'apparence du filigrane sur votre facture
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Total HT:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{subtotal.toFixed(2)}€</span>
                                    </div>
                                    {formData.taxEnabled && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">TVA ({formData.taxRate}%):</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{tax.toFixed(2)}€</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-900 dark:text-white">{formData.taxEnabled ? 'Total TTC:' : 'Total HT:'}</span>
                                        <span className="text-blue-600 dark:text-blue-400">{total.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Notes <span className="text-xs text-gray-500">(optionnel)</span>
                        </h2>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Merci pour votre confiance..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Enregistrement…
                                </>
                            ) : initialData ? (
                                'Mettre à jour la facture'
                            ) : (
                                'Créer la facture'
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Preview - 40% */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sticky top-24">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Prévisualisation
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        Voici à quoi ressemblera votre facture.
                    </p>

                    {/* Mock Invoice Preview */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6 relative overflow-hidden">
                        {/* Watermark */}
                        {formData.watermarkEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div 
                                    className="text-6xl font-black uppercase tracking-wider select-none"
                                    style={{ 
                                        fontSize: '5rem',
                                        transform: `rotate(${formData.watermarkRotation}deg)`,
                                        color: `${formData.watermarkColor}1A`,
                                    }}
                                >
                                    {formData.watermarkText || (formData.status === 'paid' ? 'PAYÉE' : formData.status === 'draft' ? 'BROUILLON' : 'IMPAYÉE')}
                                </div>
                            </div>
                        )}
                        {/* Invoice Header */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {formData.invoiceNumber || 'INV-XXXX'}
                            </p>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <p>Date: {formData.invoiceDate ? new Date(formData.invoiceDate).toLocaleDateString('fr-FR') : '-'}</p>
                                <p>Échéance: {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('fr-FR') : '-'}</p>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                Facturé à :
                            </p>
                            {selectedClient ? (
                                <div className="space-y-2">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {selectedClient.name}
                                    </p>
                                    {selectedClient.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {selectedClient.email}
                                            </p>
                                        </div>
                                    )}
                                    {selectedClient.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-gray-400" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {selectedClient.phone}
                                            </p>
                                        </div>
                                    )}
                                    {selectedClient.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {selectedClient.address}
                                                {selectedClient.postal_code && `, ${selectedClient.postal_code}`}
                                                {selectedClient.city && ` ${selectedClient.city}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                                    Sélectionnez un client...
                                </p>
                            )}
                        </div>

                        {/* Items */}
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                Articles :
                            </p>
                            <div className="space-y-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="text-xs">
                                        {item.description ? (
                                            <div className="flex justify-between">
                                                <span className="text-gray-900 dark:text-white">
                                                    {item.description} x{item.quantity}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {item.total.toFixed(2)}€
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 dark:text-gray-500 italic">Article {index + 1}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Total HT:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{subtotal.toFixed(2)}€</span>
                            </div>
                            {formData.taxEnabled && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">TVA ({formData.taxRate}%):</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{tax.toFixed(2)}€</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-900 dark:text-white">{formData.taxEnabled ? 'Total TTC:' : 'Total HT:'}</span>
                                <span className="text-blue-600 dark:text-blue-400">{total.toFixed(2)}€</span>
                            </div>
                        </div>

                        {/* Notes */}
                        {formData.notes && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                    Notes :
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                    {formData.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
