'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageLoader } from '@/components/ui/Loader';
import apiClient from '@/lib/api';
import { Invoice } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await apiClient.get(`/invoices/${invoiceId}`);
        setInvoice(response.data);
      } catch (err) {
        console.error('Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  const handleMarkPaid = async () => {
    if (!invoice) return;
    setMarking(true);
    try {
      await apiClient.patch(`/invoices/${invoice.id}/mark-paid`);
      setShowConfirm(false);
      // Refresh invoice
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      setInvoice(response.data);
    } catch (err) {
      console.error('Failed to mark invoice as paid');
    } finally {
      setMarking(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    try {
      const response = await apiClient.get(`/invoices/${invoice.id}/download-pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Failed to download PDF');
    }
  };

  if (loading) return <PageLoader />;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div>
      <div className="mb-8">
        <Link href="/invoices">
          <Button variant="secondary">← Back</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {invoice.invoice_number}
                </h1>
                <p className="text-gray-600">
                  {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={invoice.status as any}>{invoice.status}</Badge>
            </CardHeader>

            <CardBody>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                  <p className="text-gray-600">{invoice.client?.name}</p>
                  <p className="text-gray-600">{invoice.client?.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Due Date</h3>
                  <p className="text-gray-600">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-sm">Description</th>
                      <th className="px-4 py-2 text-right text-sm">Qty</th>
                      <th className="px-4 py-2 text-right text-sm">Unit Price</th>
                      <th className="px-4 py-2 text-right text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="px-4 py-2 text-sm text-gray-900">Item {idx + 1}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900 font-medium">${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                  <span className="text-gray-900 font-bold">Total:</span>
                  <span className="text-blue-600 font-bold">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </CardBody>

            <CardFooter>
              {invoice.status !== 'paid' && (
                <Button
                  variant="primary"
                  onClick={() => setShowConfirm(true)}
                >
                  Mark as Paid
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleDownloadPDF}
              >
                📥 Download PDF
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardBody>
              <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${invoice.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-lg font-bold capitalize">
                    <Badge variant={invoice.status as any}>{invoice.status}</Badge>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Mark Invoice as Paid"
        message="Are you sure you want to mark this invoice as paid?"
        confirmText="Mark Paid"
        cancelText="Cancel"
        isLoading={marking}
        onConfirm={handleMarkPaid}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
