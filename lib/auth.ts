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
