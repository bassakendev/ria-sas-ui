'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">RIA SaaS</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Professional Invoice Management
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage your clients, services, and invoices in one place. Simple, elegant, and powerful.
        </p>
        <Link href="/register">
          <Button variant="primary" size="lg">
            Get Started Free
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-gray-600">See all your metrics at a glance</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">🧾</div>
            <h3 className="font-bold text-gray-900 mb-2">Invoices</h3>
            <p className="text-gray-600">Create and manage invoices easily</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-900 mb-2">Clients</h3>
            <p className="text-gray-600">Keep your clients organized</p>
          </div>
        </div>
      </div>
    </div>
  );
}
