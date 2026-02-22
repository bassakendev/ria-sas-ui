'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
}

export function ProtectLoginRegister({ children }: ProtectedPageProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-white dark:bg-gray-950" />;
  }

  if (isLoggedIn) {
    return <div className="min-h-screen bg-white dark:bg-gray-950" />;
  }

  return <>{children}</>;
}
