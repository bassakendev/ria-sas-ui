'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { PageLoader } from '@/components/ui/Loader';
import { useSuperAdminGuard } from '@/lib/hooks';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAuthorized } = useSuperAdminGuard();

  if (loading) return <PageLoader />;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="ml-64 min-h-screen">
        <header className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Administration</h1>
        </header>
        <main className="p-6">
          <div className="max-w-300 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
