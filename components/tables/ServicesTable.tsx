'use client';

import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import apiClient from '@/lib/api';
import { Service } from '@/lib/types';
import { useState } from 'react';

interface ServicesTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: () => void;
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/services/${deleteId}`);
      setDeleteId(null);
      onDelete();
    } catch (err) {
      console.error('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit Price</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-900">{service.name}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{service.description || '—'}</td>
                <td className="px-6 py-3 text-sm text-gray-900">${service.unit_price.toFixed(2)}</td>
                <td className="px-6 py-3 text-right text-sm space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(service.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
