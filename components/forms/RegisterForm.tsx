/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RegisterPayload, register as registerUser, storeToken } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
    company_name: z.string().min(2, 'Le nom complet est requis (minimum 2 caractères)'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSuccess: (token: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema) as any,
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');
            const payload: RegisterPayload = {
                email: data.email,
                password: data.password,
                company_name: data.company_name,
            };
            const response = await registerUser(payload);
            storeToken(response.token);
            onSuccess(response.token);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.');
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
                label="Nom complet"
                placeholder="Jean Dupont"
                error={errors.company_name?.message}
                autoComplete="name"
                {...register('company_name')}
            />

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
                helperText="Minimum 8 caractères"
                autoComplete="new-password"
                {...register('password')}
            />

            <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                {...register('confirmPassword')}
            />

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
                disabled={isSubmitting}
            >
                Créer mon compte
            </Button>
        </form>
    );
}
