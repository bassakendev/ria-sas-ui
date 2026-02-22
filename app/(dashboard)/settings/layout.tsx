'use client';

import { CreditCard, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const tabs = [
        {
            name: 'Profil',
            path: '/settings',
            icon: User,
        },
        {
            name: 'Facturation',
            path: '/settings/billing',
            icon: CreditCard,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Navigation par onglets */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.path}
                                onClick={() => router.push(tab.path)}
                                className={`
                                    group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${isActive
                                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                `}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Contenu */}
            {children}
        </div>
    );
}
