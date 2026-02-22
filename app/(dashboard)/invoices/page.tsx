'use client';

import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { getStatusColor, getStatusLabel, mockInvoices, mockInvoiceStats } from '@/consts/invoices';
import { exportInvoicesCSV } from '@/lib/csvExport';
import { CheckCircle, ChevronLeft, ChevronRight, Clock, DollarSign, Download, Edit2, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// KPI Card
function KPICard({
  label,
  value,
  icon: Icon,
  accentColor,
}: {
  label: string;
  value: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  accentColor: string;
}) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    gray: 'bg-gray-50 dark:bg-gray-800/50',
  };

  const iconColors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColors[accentColor]}`}>
          <Icon className={`h-5 w-5 ${iconColors[accentColor]}`} />
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader
function InvoicesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 h-24"></div>
        ))}
      </div>

      {/* Graph */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 h-80 mb-8"></div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 mb-6 h-10"></div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
      <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Aucune facture pour le moment
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Créez votre première facture pour commencer à suivre vos paiements.
      </p>
      <Link href="/invoices/create">
        <Button variant="primary">
          + Créer une facture
        </Button>
      </Link>
    </div>
  );
}

export default function InvoicesPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState(mockInvoices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 6;

  // Load data
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setError(false);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setInvoices(mockInvoices);
        setFilteredInvoices(mockInvoices);
      } catch (err) {
        console.error('Failed to fetch invoices', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = invoices;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (invoice) =>
          invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterType === 'paid') {
      result = result.filter((invoice) => invoice.status === 'paid');
    } else if (filterType === 'unpaid') {
      result = result.filter((invoice) => invoice.status === 'unpaid' || invoice.status === 'sent');
    }

    setFilteredInvoices(result);
    setCurrentPage(1);
  }, [searchTerm, filterType, invoices]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Export CSV
  const handleExportCSV = async () => {
    try {
      await exportInvoicesCSV({
        search: searchTerm,
        status: filterType === 'all' ? undefined : filterType,
      });
      addToast('Export CSV réussi', 'success');
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      addToast(err instanceof Error ? err.message : 'Impossible d\'exporter les factures', 'error');
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async () => {
    if (!deleteInvoiceId) return;

    try {
      setIsDeleting(true);

      // TODO: Appel API pour supprimer la facture
      // const response = await fetch(`/api/invoices/${deleteInvoiceId}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      // });
      // if (!response.ok) throw new Error('Échec de la suppression');

      // Simulation: Supprimer localement
      setInvoices((prev) => prev.filter((inv) => inv.id !== deleteInvoiceId));
      setFilteredInvoices((prev) => prev.filter((inv) => inv.id !== deleteInvoiceId));

      addToast('Facture supprimée avec succès', 'success');
      setDeleteInvoiceId(null);
    } catch (err) {
      console.error('Erreur:', err);
      addToast(
        err instanceof Error ? err.message : 'Impossible de supprimer la facture',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <InvoicesSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Impossible de charger les factures.
        </p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Factures</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos factures et suivez vos paiements.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCSV} variant="secondary">
            <Download className="h-5 w-5 mr-2" /> Exporter CSV
          </Button>
          <Link href="/invoices/create">
            <Button variant="primary">
              <Plus className="h-5 w-5 mr-2" /> Créer une facture
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          label="Total factures"
          value={mockInvoiceStats.total}
          icon={FileText}
          accentColor="blue"
        />
        <KPICard
          label="Factures payées"
          value={mockInvoiceStats.paid}
          icon={CheckCircle}
          accentColor="green"
        />
        <KPICard
          label="Factures impayées"
          value={mockInvoiceStats.unpaid}
          icon={Clock}
          accentColor="orange"
        />
        <KPICard
          label="Montant total facturé"
          value={`${mockInvoiceStats.totalRevenue.toFixed(2)}€`}
          icon={DollarSign}
          accentColor="gray"
        />
      </div>

      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro ou client…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'paid' | 'unpaid')}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les factures</option>
              <option value="paid">Payées uniquement</option>
              <option value="unpaid">Impayées uniquement</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Numéro
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Montant
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Statut
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{invoice.invoice_number}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {invoice.client.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {invoice.total.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/invoices/${invoice.id}`}>
                          <button
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                            title="Voir"
                          >
                            <Eye className="h-4 w-4 text-violet-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </button>
                        </Link>
                        <Link href={`/invoices/${invoice.id}/edit`}>
                          <button
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteInvoiceId(invoice.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Results info */}
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Affichage {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} sur {filteredInvoices.length} factures
          </p>
        </>
      )}

      <ConfirmModal
        isOpen={deleteInvoiceId !== null}
        onClose={() => setDeleteInvoiceId(null)}
        onConfirm={handleDeleteInvoice}
        title="Supprimer cette facture"
        message={"Êtes-vous sûr de vouloir supprimer cette facture ?\n\nToutes les données associées seront définitivement supprimées.\n\nCette action est irréversible."}
        confirmText="Supprimer la facture"
        cancelText="Annuler"
        isDangerous={true}
        isProcessing={isDeleting}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
