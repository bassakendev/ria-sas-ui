'use client';

import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewInvoicePage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8">
        <Link href="/invoices">
          <Button variant="secondary">← Back</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        </CardHeader>
        <CardBody>
          <InvoiceForm
            onSuccess={() => {
              router.push('/invoices');
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
