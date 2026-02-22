'use client';

import { InvoiceFormBuilder } from '@/components/forms/InvoiceFormBuilder';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'draft';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would POST to your API here
      console.log('Creating invoice:', data);

      // Show success toast (you could add toast notifications here)
      // For now, just redirect
      router.push('/invoices');
      router.refresh();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Retour aux factures</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Créer une facture</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Remplissez les détails pour générer une facture professionnelle.
        </p>
      </div>

      {/* Form with Preview */}
      <InvoiceFormBuilder
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
