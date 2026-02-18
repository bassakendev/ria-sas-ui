import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearToken, isAuthenticated } from './auth';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    setLoading(false);
  }, []);

  const logout = () => {
    clearToken();
    setIsAuth(false);
    router.push('/login');
  };

  return { isAuth, loading, logout };
}

export function useAuthGuard() {
  const { isAuth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push('/login');
    }
  }, [isAuth, loading, router]);

  return { isProtected: isAuth, loading };
}
