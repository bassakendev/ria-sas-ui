'use client';

import type { AdminStatPoint } from '@/lib/admin/types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface AdminStatsChartProps {
  title: string;
  data: AdminStatPoint[];
  unit?: string;
  color?: 'blue' | 'green' | 'red' | 'purple';
  isLoading?: boolean;
}

export function AdminStatsChart({
  title,
  data,
  unit = '',
  color = 'blue',
  isLoading = false,
}: AdminStatsChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Chargement du graphe...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  // Calculate chart metrics
  const values = data.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Trend calculation
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const trend = lastValue - firstValue;
  const trendPercent = ((trend / firstValue) * 100).toFixed(1);

  // Color schemes
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      bar: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/10',
      bar: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/10',
      bar: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/10',
      bar: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
  };

  const scheme = colorSchemes[color];

  // Normalize values for bar chart height (0 to 100%)
  const range = maxValue - minValue || 1;
  const normalizedData = data.map((p) => ({
    ...p,
    normalized: ((p.value - minValue) / range) * 100,
  }));

  return (
    <div className={`${scheme.bg} border ${scheme.border} rounded-lg p-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-bold ${scheme.text}`}>
              {avgValue.toFixed(1)}
              {unit}
            </span>
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(parseFloat(trendPercent))}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {normalizedData.map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className={`w-full ${scheme.bar} rounded-t opacity-70 group-hover:opacity-100 transition-opacity`}
                style={{
                  height: `${Math.max(point.normalized, 10)}%`,
                }}
                title={`${point.date}: ${point.value.toFixed(1)}${unit}`}
              />
            </div>
          ))}
        </div>

        {/* Legend - Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>{data[0].date}</span>
          <span>{data[Math.floor(data.length / 2)].date}</span>
          <span>{data[data.length - 1].date}</span>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Min</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {minValue.toFixed(1)}{unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Avg</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {avgValue.toFixed(1)}{unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Max</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {maxValue.toFixed(1)}{unit}
          </p>
        </div>
      </div>
    </div>
  );
}
