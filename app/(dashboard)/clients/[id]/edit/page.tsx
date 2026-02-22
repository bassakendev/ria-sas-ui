'use client';

import { ClientFormBuilder } from '@/components/forms/ClientFormBuilder';
import { Button } from '@/components/ui/Button';
import { mockClients } from '@/consts/clients';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

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
    const [isLoading, setIsLoading] = useState(false);

    // Find client in mock data
    const client = mockClients.find(c => c.id === id);

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

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app, you would PUT to your API here
            console.log('Updating client:', id, data);
            // Show success toast (you could add toast notifications here)
            // For now, just redirect
            router.push('/clients');
            router.refresh();
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

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
        </div>
    );
}
