'use client';

import { PageLoader } from '@/components/ui/Loader';
import { Sidebar } from '@/components/ui/Sidebar';
import { Topbar } from '@/components/ui/Topbar';
import { useAuthGuard } from '@/lib/hooks';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isProtected, loading } = useAuthGuard();

  if (loading) return <PageLoader />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="mt-16 p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
