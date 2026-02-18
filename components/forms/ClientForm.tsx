'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import apiClient from '@/lib/api';
import { Client } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const clientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client;
  onSuccess: () => void;
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: client || {},
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      setError('');
      if (client) {
        await apiClient.put(`/clients/${client.id}`, data);
      } else {
        await apiClient.post('/clients', data);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save client');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <Input
        label="Name"
        placeholder="Client Name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <Input
        label="Email"
        type="email"
        placeholder="client@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      
      <Input
        label="Phone"
        placeholder="+1234567890"
        error={errors.phone?.message}
        {...register('phone')}
      />
      
      <Input
        label="Address"
        placeholder="Street address"
        error={errors.address?.message}
        {...register('address')}
      />
      
      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        {client ? 'Update Client' : 'Add Client'}
      </Button>
    </form>
  );
}
