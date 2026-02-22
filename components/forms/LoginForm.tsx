/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login, LoginPayload, storeToken } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess: (token: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            const response = await login(data as LoginPayload);
            storeToken(response.token);
            onSuccess(response.token);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => setError('')}
                />
            )}

            <Input
                label="Adresse email"
                type="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
            />

            <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password')}
            />

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                        {...register('rememberMe')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Se souvenir de moi
                    </span>
                </label>

                <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Mot de passe oublié ?
                </Link>
            </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
                disabled={isSubmitting}
            >
                Se connecter
            </Button>
        </form>
    );
}
