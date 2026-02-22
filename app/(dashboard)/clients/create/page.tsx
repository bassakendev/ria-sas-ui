'use client';

import { ClientFormBuilder } from '@/components/forms/ClientFormBuilder';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

export default function CreateClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would POST to your API here
      console.log('Creating client:', data);
      
      // Show success toast (you could add toast notifications here)
      // For now, just redirect
      router.push('/clients');
      router.refresh();
    } catch (error) {
      console.error('Error creating client:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ajouter un client</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Créez un nouveau client pour commencer à générer des factures.
        </p>
      </div>

      {/* Form with Preview */}
      <ClientFormBuilder 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
