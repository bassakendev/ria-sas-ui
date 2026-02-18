'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">RIA SaaS</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Start free. Upgrade when you need to.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
          <p className="text-gray-600 mb-6">Everything you need to manage invoices</p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">$29</span>
            <span className="text-gray-600">/month</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-700">
              <span className="mr-2">✓</span> Unlimited invoices
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">✓</span> Unlimited clients
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">✓</span> Custom services
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">✓</span> PDF downloads
            </li>
            <li className="flex items-center text-gray-700">
              <span className="mr-2">✓</span> Email support
            </li>
          </ul>

          <Button variant="primary" className="w-full mb-4">
            Upgrade Now
          </Button>

          <p className="text-center text-gray-600 text-sm">
            Free trial included. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
