import apiClient from './api';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    company_name: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        company_name: string;
    };
}

export interface UserData {
    plan: 'free' | 'pro';
    email: string;
    company_name: string;
    role?: 'user' | 'admin' | 'superadmin';
    subscription_status?: 'active' | 'cancelled' | 'past_due';
    next_billing_date?: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
}

export function storeToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export function clearToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}

export async function fetchUserData(): Promise<UserData> {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données utilisateur');
    }

    return response.json();
}

export interface UpdateProfilePayload {
    email?: string;
    company_name?: string;
    password?: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<void> {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Impossible de mettre à jour le profil');
    }
}

export async function deleteAccount(): Promise<void> {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Impossible de supprimer le compte');
    }

    // Clear token after successful deletion
    clearToken();
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Impossible d\'envoyer l\'email de réinitialisation');
    }

    return response.json();
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
        throw new Error(error.error || 'Impossible de réinitialiser le mot de passe');
    }

    return response.json();
}
