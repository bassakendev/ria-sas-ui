'use client';

import { ServiceForm } from '@/components/forms/ServiceForm';
import { ServicesTable } from '@/components/tables/ServicesTable';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import apiClient from '@/lib/api';
import { Service } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();

  const fetchServices = async () => {
    try {
      const response = await apiClient.get('/services');
      setServices(response.data);
    } catch (err) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedService(undefined);
    fetchServices();
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedService(undefined);
            setShowForm(true);
          }}
        >
          + Add Service
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              {selectedService ? 'Edit Service' : 'New Service'}
            </h2>
          </CardHeader>
          <CardBody>
            <ServiceForm service={selectedService} onSuccess={handleSuccess} />
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setShowForm(false);
                setSelectedService(undefined);
              }}
            >
              Cancel
            </Button>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {services.length > 0 ? (
            <ServicesTable
              services={services}
              onEdit={(service) => {
                setSelectedService(service);
                setShowForm(true);
              }}
              onDelete={fetchServices}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">No services yet</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
