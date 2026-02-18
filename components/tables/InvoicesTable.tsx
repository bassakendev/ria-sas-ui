'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Invoice } from '@/lib/types';
import Link from 'next/link';

interface InvoicesTableProps {
  invoices: Invoice[];
  onViewDetails?: (id: string) => void;
}

export function InvoicesTable({ invoices, onViewDetails }: InvoicesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoice #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{invoice.client?.name || '—'}</td>
              <td className="px-6 py-3 text-sm font-medium text-gray-900">${invoice.total.toFixed(2)}</td>
              <td className="px-6 py-3 text-sm">
                <Badge variant={invoice.status as any}>{invoice.status}</Badge>
              </td>
              <td className="px-6 py-3 text-sm text-gray-600">
                {new Date(invoice.due_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-3 text-right text-sm">
                <Link href={`/invoices/${invoice.id}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
