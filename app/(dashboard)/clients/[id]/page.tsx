'use client';

import { Button } from '@/components/ui/Button';
import { mockClients } from '@/consts/clients';
import { mockInvoices } from '@/consts/invoices';
import { ArrowLeft, DollarSign, FileText, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // Find client in mock data
    const client = mockClients.find(c => c.id === id);
    const clientInvoices = mockInvoices.filter(i => i.client_id === id);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Client non trouvé.
                </p>
                <Link href="/clients">
                    <Button variant="primary">
                        Retour aux clients
                    </Button>
                </Link>
            </div>
        );
    }

    const paidInvoices = clientInvoices.filter(i => i.status === 'paid');
    const unpaidInvoices = clientInvoices.filter(i => i.status === 'unpaid' || i.status === 'sent');

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link href="/clients" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Retour aux clients</span>
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Client depuis {new Date(client.created_at).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    <Link href={`/clients/${client.id}/edit`}>
                        <Button variant="primary">
                            Modifier
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Client Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Informations de contact
                    </h2>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Email
                                </p>
                                <a href={`mailto:${client.email}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                                    {client.email}
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        {client.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Téléphone
                                    </p>
                                    <a href={`tel:${client.phone}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                                        {client.phone}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Address */}
                        {client.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Adresse
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {client.address}<br />
                                        {client.postal_code && `${client.postal_code} `}
                                        {client.city && `${client.city}`}<br />
                                        {client.country}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing Statistics */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Statistiques de facturation
                    </h2>

                    <div className="space-y-4">
                        {/* Total Invoices */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nombre de factures</p>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {client.total_invoices}
                            </p>
                        </div>

                        {/* Total Revenue */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total facturé</p>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {client.total_revenue.toFixed(2)}€
                            </p>
                        </div>

                        {/* Paid */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Montant payé</p>
                            <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                {paidInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)}€
                            </p>
                        </div>

                        {/* Unpaid */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Montant impayé</p>
                            <p className="text-lg font-medium text-orange-600 dark:text-orange-400">
                                {unpaidInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)}€
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Factures récentes
                    </h2>
                    <Link href={`/invoices/new?client=${client.id}`}>
                        <Button variant="primary" size="sm">
                            Nouvelle facture
                        </Button>
                    </Link>
                </div>

                {clientInvoices.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Aucune facture pour ce client.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-0 py-4">
                                        Numéro
                                    </th>
                                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-0 py-4">
                                        Montant
                                    </th>
                                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-0 py-4">
                                        Statut
                                    </th>
                                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-0 py-4">
                                        Date
                                    </th>
                                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-0 py-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {clientInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-4 font-medium text-gray-900 dark:text-white">
                                            {invoice.invoice_number}
                                        </td>
                                        <td className="py-4 font-medium text-gray-900 dark:text-white">
                                            {invoice.total.toFixed(2)}€
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : invoice.status === 'unpaid' || invoice.status === 'sent'
                                                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {invoice.status === 'paid' ? 'Payée' : invoice.status === 'unpaid' ? 'Impayée' : invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-600 dark:text-gray-400 text-sm">
                                            {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-4">
                                            <Link href={`/invoices/${invoice.id}`}>
                                                <Button variant="secondary" size="sm">
                                                    Voir
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
