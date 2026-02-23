'use client';

import { useAuth } from '@/lib/hooks';
import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';

const adminLinks = [
  { href: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/feedbacks', label: 'Feedbacks', icon: MessageSquare },
  { href: '/admin/subscriptions', label: 'Souscriptions', icon: CreditCard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/settings', label: 'Parametres', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 flex flex-col z-40">
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="h-9 w-9 rounded-lg bg-red-600 flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Admin</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Control Center</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-2 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/dashboard"
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LayoutDashboard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-sm">Retour au dashboard</span>
        </Link>
        <div className="px-3">
          <ThemeToggle />
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Deconnexion</span>
        </button>
      </div>
    </aside>
  );
}
