'use client';

import { Card, CardBody } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import apiClient from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">
              ${stats?.total_revenue.toFixed(2) || '0.00'}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Unpaid Amount</p>
            <p className="text-3xl font-bold text-red-600">
              ${stats?.total_unpaid.toFixed(2) || '0.00'}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Clients</p>
            <p className="text-3xl font-bold text-green-600">
              {stats?.total_clients || 0}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Invoices</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.total_invoices || 0}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
