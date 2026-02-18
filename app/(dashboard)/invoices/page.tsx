'use client';

import { InvoicesTable } from '@/components/tables/InvoicesTable';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import apiClient from '@/lib/api';
import { Invoice } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const response = await apiClient.get('/invoices');
      setInvoices(response.data);
    } catch (err) {
      console.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <Link href="/invoices/new">
          <Button variant="primary">+ New Invoice</Button>
        </Link>
      </div>

      <Card>
        <CardBody>
          {invoices.length > 0 ? (
            <InvoicesTable invoices={invoices} />
          ) : (
            <p className="text-center text-gray-500 py-8">No invoices yet</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
