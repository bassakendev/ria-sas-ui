import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearToken, fetchUserData, isAuthenticated } from './auth';

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

export function useSuperAdminGuard() {
  const { isAuth, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      router.push('/login');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadUserRole = async () => {
      try {
        const user = await fetchUserData();
        const userRole = user.role || 'user';

        if (!isMounted) return;

        setRole(userRole);
        const allowed = userRole === 'superadmin';
        setIsAuthorized(allowed);

        if (!allowed) {
          router.push('/dashboard');
        }
      } catch (error) {
        if (!isMounted) return;
        setIsAuthorized(false);
        router.push('/login');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserRole();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuth, router]);

  return { loading: authLoading || loading, isAuthorized, role };
}

export function useAdminGuard() {
  const { isAuth, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      router.push('/admin-login');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadUserRole = async () => {
      try {
        const user = await fetchUserData();
        const userRole = user.role || 'user';

        if (!isMounted) return;

        setRole(userRole);
        // Allow both admin and superadmin
        const allowed = userRole === 'admin' || userRole === 'superadmin';
        setIsAuthorized(allowed);

        if (!allowed) {
          router.push('/dashboard');
        }
      } catch (error) {
        if (!isMounted) return;
        setIsAuthorized(false);
        router.push('/admin-login');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserRole();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuth, router]);

  return { loading: authLoading || loading, isAuthorized, role };
}
