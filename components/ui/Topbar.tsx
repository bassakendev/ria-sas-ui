'use client';

import { isPro, mockUserSubscription } from '@/consts/subscriptions';
import { useSidebar } from '@/lib/sidebar-context';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  const { collapsed } = useSidebar();
  const isProUser = isPro(mockUserSubscription);

  return (
    <header
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 fixed top-0 right-0 z-30 flex items-center px-6 transition-all duration-300 ease-in-out ${collapsed ? 'left-20' : 'left-64'
        }`}
    >
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
        <div className="flex items-center gap-4">
          {/* CTA Pro - visible seulement pour les utilisateurs Free */}
          {!isProUser && (
            <Link
              href="/pricing"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <Zap className="h-4 w-4" />
              Passer au Pro
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
