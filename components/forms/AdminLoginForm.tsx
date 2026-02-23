/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fetchUserData, login, LoginPayload, storeToken } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Login first
      const response = await login(data as LoginPayload);
      storeToken(response.token);

      // Fetch user data to verify superadmin role
      const userData = await fetchUserData();

      // Check if user is superadmin (strict requirement for admin dashboard)
      if (userData.role !== 'superadmin') {
        // Clear token if not superadmin
        localStorage.removeItem('token');
        setError('Accès refusé. Seuls les superadministrateurs peuvent accéder au portail admin.');
        setIsSubmitting(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      // Clear token on error
      localStorage.removeItem('token');
      const errorMessage = err?.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          {...register('email')}
          error={errors.email?.message}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Mot de passe
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Accéder au portail admin
      </Button>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Vous n&apos;êtes pas un administrateur ?{' '}
          <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Connexion utilisateur
          </Link>
        </p>
      </div>
    </form>
  );
}
