'use client';

import { ClientFormBuilder } from '@/components/forms/ClientFormBuilder';
import { Button } from '@/components/ui/Button';
import { Toast, useToast } from '@/components/ui/Toast';
import type { Client } from '@/consts/clients';
import { getClient, updateClient } from '@/lib/clients';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
}

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toasts, addToast, removeToast } = useToast();
    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingClient, setIsLoadingClient] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setIsLoadingClient(true);
                const clientData = await getClient(id);
                setClient(clientData);
            } catch (err) {
                console.error('Erreur:', err);
                addToast(
                    err instanceof Error ? err.message : 'Impossible de charger le client',
                    'error'
                );
            } finally {
                setIsLoadingClient(false);
            }
        };

        fetchClient();
    }, [id]);

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await updateClient(id, data);
            addToast('Client modifié avec succès', 'success');
            router.push('/clients');
            router.refresh();
        } catch (error) {
            console.error('Erreur:', error);
            addToast(
                error instanceof Error ? error.message : 'Impossible de modifier le client',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingClient) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Client non trouvé.
                </p>
                <Link href="/clients">
                    <Button variant="primary">
                        Retour aux clients
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link href="/clients" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Retour aux clients</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modifier le client</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Mise à jour des informations de {client.name}.
                </p>
            </div>

            {/* Form with Preview */}
            <ClientFormBuilder
                initialData={client}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />

            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
