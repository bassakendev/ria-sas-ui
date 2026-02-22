'use client';

import { isPro, mockUserSubscription } from '@/consts/subscriptions';
import { useAuth } from '@/lib/hooks';
import { useSidebar } from '@/lib/sidebar-context';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { collapsed, toggleCollapsed } = useSidebar();
  const isProUser = isPro(mockUserSubscription);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/invoices', label: 'Factures', icon: FileText },
    { href: '/pricing', label: 'Tarification', icon: CreditCard },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-20' : 'w-64'
          } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out z-40`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                RIA SaaS
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto h-8 w-8 rounded-lg bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${active
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? link.label : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} />
                {!collapsed && (
                  <span className="font-medium text-sm">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 space-y-2 border-t border-gray-200 dark:border-gray-800">
          {/* Plan Badge */}
          {!collapsed ? (
            <Link
              href="/pricing"
              className={`block w-full rounded-lg p-3 transition-all ${isProUser
                ? 'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isProUser ? (
                    <Crown className="h-4 w-4 text-white" />
                  ) : (
                    <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className={`text-xs font-semibold ${isProUser ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {isProUser ? 'Plan Pro' : 'Plan Gratuit'}
                  </span>
                </div>
                {!isProUser && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Upgrade
                  </span>
                )}
              </div>
              {!isProUser && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Passez au Pro pour plus de fonctionnalités
                </p>
              )}
            </Link>
          ) : (
            <Link
              href="/pricing"
              className={`flex items-center justify-center p-2 rounded-lg transition-colors ${isProUser
                ? 'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              title={isProUser ? 'Plan Pro' : 'Passer au Pro'}
            >
              {isProUser ? (
                <Crown className="h-4 w-4 text-white" />
              ) : (
                <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </Link>
          )}
          {!collapsed ? (
            <>
              <div className="px-3">
                <ThemeToggle />
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors group"
              >
                <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                <span className="font-medium text-sm">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <button
                onClick={logout}
                  className="w-full flex items-center justify-center py-2.5 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="h-5 w-5" />
                </button>
            </>
          )}
        </div>
      </aside>

      {/* Spacer for layout */}
      <div className={`${collapsed ? 'w-20' : 'w-64'
        } shrink-0 transition-all duration-300 ease-in-out`} />
    </>
  );
}
