'use client';

import { Button } from '@/components/ui/Button';
import { Client } from '@/consts/clients';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
}

interface Errors {
    name?: string;
    email?: string;
}

interface ClientFormBuilderProps {
    initialData?: Client;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading?: boolean;
}

export function ClientFormBuilder({
    initialData,
    onSubmit,
    isLoading = false,
}: ClientFormBuilderProps) {
    const [formData, setFormData] = useState<FormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        company: '', // Optional field, not in Client interface
        address: initialData?.address || '',
        city: initialData?.city || '',
        postal_code: initialData?.postal_code || '',
        country: initialData?.country || 'France',
    });

    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitError, setSubmitError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };

        if (name === 'name') {
            if (!value.trim()) {
                newErrors.name = 'Le nom est requis';
            } else {
                delete newErrors.name;
            }
        }

        if (name === 'email') {
            if (!value.trim()) {
                newErrors.email = 'L\'email est requis';
            } else if (!validateEmail(value)) {
                newErrors.email = 'Email invalide';
            } else {
                delete newErrors.email;
            }
        }

        setErrors(newErrors);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        // Validate all required fields
        validateField('name', formData.name);
        validateField('email', formData.email);

        if (!formData.name.trim() || !formData.email.trim()) {
            setSubmitError('Veuillez remplir tous les champs requis');
            return;
        }

        if (!validateEmail(formData.email)) {
            setSubmitError('Veuillez entrer un email valide');
            return;
        }

        try {
            await onSubmit(formData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setSubmitError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const isValid = !errors.name && !errors.email && formData.name.trim() && formData.email.trim();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form - 60% */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {submitError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
                        </div>
                    )}

                    {/* Section 1: Informations principales */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Informations principales
                        </h2>

                        <div className="space-y-5">
                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nom complet <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Dupont Jean"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${touched.name && errors.name
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                />
                                {touched.name && errors.name && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="jean@example.com"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${touched.email && errors.email
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                />
                                {touched.email && errors.email && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+33 1 23 45 67 89"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Entreprise */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Entreprise <span className="text-xs text-gray-500">(optionnel)</span>
                        </h2>

                        <div className="space-y-5">
                            {/* Nom entreprise */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nom de l&apos;entreprise
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Dupont SARL"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Adresse */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Adresse
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="12 Rue de la République"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {/* Ville */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Paris"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Code postal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Code postal
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    placeholder="75001"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Pays */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pays
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="France"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isValid || isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Enregistrement…
                            </>
                        ) : initialData ? (
                            'Mettre à jour le client'
                        ) : (
                            'Créer le client'
                        )}
                    </Button>
                </form>
            </div>

            {/* Preview - 40% */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sticky top-24">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Prévisualisation dans une facture
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        Voici comment les informations apparaîtront.
                    </p>

                    {/* Mock Invoice Block */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                            Facturé à :
                        </p>

                        <div className="space-y-3">
                            {/* Nom */}
                            <div>
                                <p className={`font-semibold text-sm ${formData.name
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {formData.name || 'Nom du client'}
                                </p>
                            </div>

                            {/* Entreprise */}
                            {formData.company && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formData.company}
                                    </p>
                                </div>
                            )}

                            {/* Email */}
                            {formData.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {formData.email}
                                    </p>
                                </div>
                            )}

                            {/* Téléphone */}
                            {formData.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {formData.phone}
                                    </p>
                                </div>
                            )}

                            {/* Adresse */}
                            {formData.address && (
                                <div className="flex items-start gap-2 pt-2">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {formData.address}
                                        {formData.postal_code && `, ${formData.postal_code}`}
                                        {formData.city && ` ${formData.city}`}
                                    </div>
                                </div>
                            )}

                            {!formData.email && !formData.phone && !formData.address && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 italic pt-2">
                                    Les informations apparaîtront ici au fur et à mesure…
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
