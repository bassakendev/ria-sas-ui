'use client';

import { ClientForm } from '@/components/forms/ClientForm';
import { ClientsTable } from '@/components/tables/ClientsTable';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import apiClient from '@/lib/api';
import { Client } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  const fetchClients = async () => {
    try {
      const response = await apiClient.get('/clients');
      setClients(response.data);
    } catch (err) {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedClient(undefined);
    fetchClients();
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedClient(undefined);
            setShowForm(true);
          }}
        >
          + Add Client
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              {selectedClient ? 'Edit Client' : 'New Client'}
            </h2>
          </CardHeader>
          <CardBody>
            <ClientForm client={selectedClient} onSuccess={handleSuccess} />
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setShowForm(false);
                setSelectedClient(undefined);
              }}
            >
              Cancel
            </Button>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {clients.length > 0 ? (
            <ClientsTable
              clients={clients}
              onEdit={(client) => {
                setSelectedClient(client);
                setShowForm(true);
              }}
              onDelete={fetchClients}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">No clients yet</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
