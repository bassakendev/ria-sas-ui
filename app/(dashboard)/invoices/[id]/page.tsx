'use client';

import { getStatusColor, getStatusLabel, mockInvoices } from '@/consts/invoices';
import { ArrowLeft, Download, Edit3, Mail, MapPin, MessageCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoice = mockInvoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Facture non trouvée</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            La facture que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link href="/invoices" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            <ArrowLeft className="h-4 w-4" />
            Retour aux factures
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Retour aux factures</span>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {invoice.invoice_number}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {getStatusLabel(invoice.status)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Émise le {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/invoices/${id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Modifier
            </Link>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Display */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
            {/* Watermark - conditionally displayed if watermarkEnabled is true (defaults to true for demo) */}
            {(invoice.watermarkEnabled !== false) && invoice.status && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div
                  className="text-8xl font-black uppercase tracking-wider select-none"
                  style={{
                    fontSize: '8rem',
                    transform: `rotate(${invoice.watermarkRotation ?? -45}deg)`,
                    color: `${invoice.watermarkColor || '#6b7280'}1A`,
                  }}
                >
                  {invoice.watermarkText || (invoice.status === 'paid' ? 'PAYÉE' : invoice.status === 'draft' ? 'BROUILLON' : 'IMPAYÉE')}
                </div>
              </div>
            )}
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {invoice.invoice_number}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Date d'émission: {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Date d'échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Votre Entreprise</p>
                <p className="text-gray-900 dark:text-white font-semibold">RIA SAS</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">123 Rue de la Paix</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">75001 Paris, France</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">FACTURÉ À:</p>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white font-semibold text-lg mb-3">
                  {invoice.client.name}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{invoice.client.email}</span>
                  </div>
                  {invoice.client.address && (
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p>{invoice.client.address}</p>
                        <p>{invoice.client.postal_code} {invoice.client.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300 font-semibold">
                      Description
                    </th>
                    <th className="text-center py-3 text-gray-700 dark:text-gray-300 font-semibold w-24">
                      Qté
                    </th>
                    <th className="text-right py-3 text-gray-700 dark:text-gray-300 font-semibold w-32">
                      Prix unitaire
                    </th>
                    <th className="text-right py-3 text-gray-700 dark:text-gray-300 font-semibold w-32">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 text-gray-900 dark:text-white">
                        <div>
                          <p className="font-medium">{item.service_name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-center text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-gray-700 dark:text-gray-300">
                        {item.unit_price.toFixed(2)}€
                      </td>
                      <td className="py-4 text-right text-gray-900 dark:text-white font-medium">
                        {item.total.toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                  <span>Total HT</span>
                  <span>{invoice.subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                  <span>TVA (20%)</span>
                  <span>{invoice.tax.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-bold text-gray-900 dark:text-white border-t-2 border-gray-300 dark:border-gray-600">
                  <span>Total TTC</span>
                  <span>{invoice.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">NOTES:</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Merci pour votre confiance !
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions
            </h3>

            <div className="space-y-3 mb-6">
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Télécharger PDF
              </button>

              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Mail className="h-4 w-4" />
                Envoyer par email
              </button>

              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <MessageCircle className="h-4 w-4" />
                Envoyer par WhatsApp
              </button>

              <Link
                href={`/invoices/${id}/edit`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Modifier
              </Link>

              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Informations
              </h4>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Statut</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Date d'émission</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {new Date(invoice.issue_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Date d'échéance</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {new Date(invoice.due_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Montant total</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white font-semibold text-lg">
                    {invoice.total.toFixed(2)}€
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
