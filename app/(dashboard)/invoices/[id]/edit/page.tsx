'use client';

import { InvoiceFormBuilder } from '@/components/forms/InvoiceFormBuilder';
import { Toast, useToast } from '@/components/ui/Toast';
import type { Invoice } from '@/consts/invoices';
import { getInvoice, updateInvoice } from '@/lib/invoices';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';

interface FormData {
    clientId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    status: 'paid' | 'unpaid' | 'draft' | 'sent';
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;
    notes: string;
}

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toasts, addToast, removeToast } = useToast();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingInvoice, setIsLoadingInvoice] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setIsLoadingInvoice(true);
                const invoiceData = await getInvoice(id);
                setInvoice(invoiceData);
            } catch (err) {
                console.error('Erreur:', err);
                addToast(
                    err instanceof Error ? err.message : 'Impossible de charger la facture',
                    'error'
                );
            } finally {
                setIsLoadingInvoice(false);
            }
        };

        fetchInvoice();
    }, [id]);

    if (isLoadingInvoice) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Facture non trouvée</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        La facture que vous recherchez n&apos;existe pas ou a été supprimée.
                    </p>
                    <Link href="/invoices" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux factures
                    </Link>
                </div>
            </div>
        );
    }

    // Map invoice data to form format
    const initialData: FormData = {
        clientId: invoice.client_id,
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.issue_date,
        dueDate: invoice.due_date,
        status: invoice.status === 'sent' ? 'unpaid' : invoice.status === 'unpaid' ? 'unpaid' : invoice.status,
        items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            total: item.total,
        })),
        notes: invoice.notes || '',
    };

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await updateInvoice(id, data);
            addToast('Facture modifiée avec succès', 'success');
            router.push('/invoices');
            router.refresh();
        } catch (error) {
            console.error('Erreur:', error);
            addToast(
                error instanceof Error ? error.message : 'Impossible de modifier la facture',
                'error'
            );
        } finally {
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Modifier la facture {invoice.invoice_number}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Mettez à jour les détails de votre facture.
                </p>
            </div>

            {/* Form with Preview */}
            <InvoiceFormBuilder
                initialData={initialData}
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
