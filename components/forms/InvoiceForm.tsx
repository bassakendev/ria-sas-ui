'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import apiClient from '@/lib/api';
import { Client, Invoice, Service } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const invoiceItemSchema = z.object({
  service_id: z.string().min(1, 'Service is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.coerce.number().min(0, 'Price must be positive'),
});

const invoiceSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  due_date: z.string().min(1, 'Due date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  invoice?: Invoice;
  onSuccess: () => void;
}

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const [error, setError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: invoice ? {
      client_id: invoice.client_id,
      due_date: invoice.due_date,
      items: invoice.items,
    } : {
      items: [{ service_id: '', quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          apiClient.get('/clients'),
          apiClient.get('/services'),
        ]);
        setClients(clientsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setError('');
      if (invoice) {
        await apiClient.put(`/invoices/${invoice.id}`, data);
      } else {
        await apiClient.post('/invoices', data);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save invoice');
    }
  };

  if (loading) return <div>Loading...</div>;

  const clientOptions = clients.map(c => ({ value: c.id, label: c.name }));
  const serviceOptions = services.map(s => ({ value: s.id, label: s.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Select
        label="Client"
        options={clientOptions}
        error={errors.client_id?.message}
        {...register('client_id')}
      />

      <Input
        label="Due Date"
        type="date"
        error={errors.due_date?.message}
        {...register('due_date')}
      />

      <div>
        <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Select
                    label="Service"
                    options={serviceOptions}
                    error={errors.items?.[idx]?.service_id?.message}
                    {...register(`items.${idx}.service_id`)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Qty"
                    type="number"
                    min="1"
                    error={errors.items?.[idx]?.quantity?.message}
                    {...register(`items.${idx}.quantity`)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Price"
                    type="number"
                    step="0.01"
                    error={errors.items?.[idx]?.unit_price?.message}
                    {...register(`items.${idx}.unit_price`)}
                  />
                </div>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => remove(idx)}
                  className="mt-3"
                >
                  Remove Item
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={() => append({ service_id: '', quantity: 1, unit_price: 0 })}
        >
          + Add Item
        </Button>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-lg font-semibold text-blue-900">
          Total: ${calculateTotal().toFixed(2)}
        </p>
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        {invoice ? 'Update Invoice' : 'Create Invoice'}
      </Button>
    </form>
  );
}
