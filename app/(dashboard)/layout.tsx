'use client';

import { FeedbackButton } from '@/components/ui/FeedbackButton';
import { PageLoader } from '@/components/ui/Loader';
import { Sidebar } from '@/components/ui/Sidebar';
import { Topbar } from '@/components/ui/Topbar';
import { useAuthGuard } from '@/lib/hooks';
import { SidebarProvider } from '@/lib/sidebar-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthGuard();

  if (loading) return <PageLoader />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="mt-16 p-6">
            <div className="max-w-300 mx-auto">
              {children}
            </div>
          </main>
        </div>
        {/* Floating Feedback Button */}
        <FeedbackButton />
      </div>
    </SidebarProvider>
  );
}
