'use client';

import { AdminAssignPlanModal } from '@/components/admin/AdminAssignPlanModal';
import { AdminUserDetailModal } from '@/components/admin/AdminUserDetailModal';
import { Toast, useToast } from '@/components/ui/Toast';
import type { AdminUserSummary } from '@/lib/admin/types';
import { activateAdminUser, getAdminUsers, suspendAdminUser, updateAdminUserRole } from '@/lib/admin/users';
import { Eye, Loader2, Search, Shield, UserCheck, UserX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'superadmin' | ''>('');
  const [status, setStatus] = useState<'active' | 'suspended' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminUsers({
        page,
        limit,
        query: query || undefined,
        role: role || undefined,
        status: status || undefined,
      });
      setUsers(response.users);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      addToast(message, 'error', 5000);
    } finally {
      setLoading(false);
    }
  }, [limit, page, query, role, status, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, nextRole: AdminUserSummary['role']) => {
    setWorkingId(userId);
    try {
      await updateAdminUserRole(userId, nextRole);
      await fetchUsers();
      addToast('Role mis à jour avec succès', 'success', 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du role';
      setError(message);
      addToast(message, 'error', 5000);
    } finally {
      setWorkingId(null);
    }
  };

  const handleStatusToggle = async (user: AdminUserSummary) => {
    setWorkingId(user.id);
    try {
      if (user.status === 'active') {
        await suspendAdminUser(user.id);
        addToast('Utilisateur suspendu avec succès', 'success', 3000);
      } else {
        await activateAdminUser(user.id);
        addToast('Utilisateur activé avec succès', 'success', 3000);
      }
      await fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      addToast(message, 'error', 5000);
    } finally {
      setWorkingId(null);
    }
  };

  const handleOpenDetail = (user: AdminUserSummary) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenAssignPlan = () => {
    setIsAssignPlanModalOpen(true);
  };

  const handleCloseAssignPlan = () => {
    setIsAssignPlanModalOpen(false);
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  const handlePlanAssigned = () => {
    fetchUsers();
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Utilisateurs</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerer les roles, les acces et l'etat des comptes.
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value as 'user' | 'admin' | 'superadmin' | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Tous les roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as 'active' | 'suspended' | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Derniere connexion</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-red-600 dark:text-red-400" />
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Chargement des utilisateurs...</p>
                  </div>
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Aucun utilisateur trouve avec les filtres appliques.</p>
                </td>
              </tr>
            )}
            {!loading && users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {user.plan.toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(event) => handleRoleChange(user.id, event.target.value as AdminUserSummary['role'])}
                    disabled={workingId === user.id || user.role === 'superadmin'}
                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white disabled:opacity-60"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {user.status === 'active' ? 'Actif' : 'Suspendu'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('fr-FR') : '—'}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenDetail(user)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </button>
                  <button
                    onClick={() => handleStatusToggle(user)}
                    disabled={workingId === user.id || user.role === 'superadmin'}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                      user.status === 'active'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300'
                    } disabled:opacity-60`}
                  >
                    {workingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.status === 'active' ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    {user.status === 'active' ? 'Suspendre' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} utilisateurs • Page {page} sur {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50"
          >
            Precedent
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>

      <AdminUserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        onUserDeleted={handleUserDeleted}
        onOpenAssignPlan={handleOpenAssignPlan}
      />
      
      <AdminAssignPlanModal
        user={selectedUser}
        isOpen={isAssignPlanModalOpen}
        onClose={handleCloseAssignPlan}
        onPlanAssigned={handlePlanAssigned}
      />
    </div>
  );
}
