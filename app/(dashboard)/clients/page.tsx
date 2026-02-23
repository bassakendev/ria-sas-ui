'use client';

import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Toast, useToast } from '@/components/ui/Toast';
import { deleteClient } from '@/lib/clients';
import { exportClientsCSV } from '@/lib/csvExport';
import { useClients } from '@/lib/hooks/useClients';
import { ChevronLeft, ChevronRight, DollarSign, Download, Edit2, Eye, Search, Trash2, Users } from 'lucide-react';
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
  };

  const iconColors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
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
function ClientsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 h-24"></div>
        ))}
      </div>

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
      <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Aucun client pour le moment
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Ajoutez votre premier client pour commencer à facturer.
      </p>
      <Link href="/clients/create">
        <Button variant="primary">
          Ajouter un client
        </Button>
      </Link>
    </div>
  );
}

export default function ClientsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const { data, stats, loading, error, fetch, fetchStats } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  // Load data on mount
  useEffect(() => {
    fetch(currentPage, itemsPerPage, searchTerm);
    fetchStats();
  }, [currentPage, searchTerm]);

  // Handle filter change
  useEffect(() => {
    if (filterType !== 'all') {
      fetch(1, itemsPerPage, searchTerm);
      setCurrentPage(1);
    }
  }, [filterType]);

  // Export CSV
  const handleExportCSV = async () => {
    try {
      await exportClientsCSV({
        search: searchTerm,
        status: filterType === 'all' ? undefined : filterType,
      });
      addToast('Export CSV réussi', 'success');
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      addToast(err instanceof Error ? err.message : 'Impossible d\'exporter les clients', 'error');
    }
  };

  // Delete client
  const handleDeleteClient = async () => {
    if (!deleteClientId) return;

    try {
      setIsDeleting(true);
      await deleteClient(deleteClientId);
      await fetch(currentPage, itemsPerPage, searchTerm);
      addToast('Client supprimé avec succès', 'success');
      setDeleteClientId(null);
    } catch (err) {
      console.error('Erreur:', err);
      addToast(
        err instanceof Error ? err.message : 'Impossible de supprimer le client',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = data ? Math.ceil(data.total / itemsPerPage) : 1;

  if (loading) return <ClientsSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Impossible de charger les clients.
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos clients et suivez leurs facturations.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCSV} variant="secondary">
            <Download className="h-5 w-5 mr-2" /> Exporter CSV
          </Button>
          <Link href="/clients/create">
            <Button variant="primary">
              Ajouter un client
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <KPICard
            label="Total clients"
            value={stats.total}
            icon={Users}
            accentColor="blue"
          />
          <KPICard
            label="Montant total facturé"
            value={`${stats.totalRevenue.toFixed(2)}€`}
            icon={DollarSign}
            accentColor="green"
          />
        </div>
      )}

      {!data || data.clients.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les clients</option>
              <option value="active">Clients actifs</option>
              <option value="inactive">Clients sans factures</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Nom
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Téléphone
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Factures
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Total facturé
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {data?.clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{client.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {client.total_invoices} {client.total_invoices > 1 ? 'factures' : 'facture'}
                      </span>
                      {client.total_invoices === 0 && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                          Nouveau
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {client.total_revenue.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/clients/${client.id}`}>
                          <button
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                            title="Voir profil"
                          >
                            <Eye className="h-4 w-4 text-violet-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </button>
                        </Link>
                        <Link href={`/clients/${client.id}/edit`}>
                          <button
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteClientId(client.id)}
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
              Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, data?.total || 0)} sur {data?.total || 0} clients
            </p>
          </>
      )}

      <ConfirmModal
        isOpen={deleteClientId !== null}
        onClose={() => setDeleteClientId(null)}
        onConfirm={handleDeleteClient}
        title="Supprimer ce client"
        message={"Êtes-vous sûr de vouloir supprimer ce client ?\n\nToutes les factures associées seront conservées mais le lien avec ce client sera perdu.\n\nCette action est irréversible."}
        confirmText="Supprimer le client"
        cancelText="Annuler"
        isDangerous={true}
        isProcessing={isDeleting}
      />

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
