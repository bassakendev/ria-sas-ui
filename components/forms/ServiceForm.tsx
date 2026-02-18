'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import apiClient from '@/lib/api';
import { Service } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  unit_price: z.coerce.number().min(0, 'Price must be positive'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service;
  onSuccess: () => void;
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: service || { unit_price: 0 },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setError('');
      if (service) {
        await apiClient.put(`/services/${service.id}`, data);
      } else {
        await apiClient.post('/services', data);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save service');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <Input
        label="Service Name"
        placeholder="Service name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <Input
        label="Description"
        placeholder="Optional description"
        error={errors.description?.message}
        {...register('description')}
      />
      
      <Input
        label="Unit Price"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.unit_price?.message}
        {...register('unit_price')}
      />
      
      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        {service ? 'Update Service' : 'Add Service'}
      </Button>
    </form>
  );
}
