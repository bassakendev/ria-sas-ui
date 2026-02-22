// Mock data pour la page Services

export interface Service {
  id: string;
  name: string;
  description: string;
  unit_price: number;
  unit: 'hour' | 'day' | 'unit' | 'month';
  tax_rate: number;
  category?: string;
  created_at: string;
  is_active: boolean;
}

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Développement Web',
    description: 'Création de sites web sur mesure',
    unit_price: 75.00,
    unit: 'hour',
    tax_rate: 20,
    category: 'Développement',
    created_at: '2025-06-01',
    is_active: true,
  },
  {
    id: 's2',
    name: 'Consultation IT',
    description: 'Conseil en stratégie informatique',
    unit_price: 120.00,
    unit: 'hour',
    tax_rate: 20,
    category: 'Consultation',
    created_at: '2025-06-01',
    is_active: true,
  },
  {
    id: 's3',
    name: 'Maintenance Mensuelle',
    description: 'Maintenance et support technique mensuel',
    unit_price: 500.00,
    unit: 'month',
    tax_rate: 20,
    category: 'Support',
    created_at: '2025-06-15',
    is_active: true,
  },
  {
    id: 's4',
    name: 'Design UI/UX',
    description: 'Conception d\'interfaces utilisateur',
    unit_price: 85.00,
    unit: 'hour',
    tax_rate: 20,
    category: 'Design',
    created_at: '2025-07-01',
    is_active: true,
  },
  {
    id: 's5',
    name: 'Formation',
    description: 'Formation sur les outils numériques',
    unit_price: 450.00,
    unit: 'day',
    tax_rate: 20,
    category: 'Formation',
    created_at: '2025-07-10',
    is_active: true,
  },
  {
    id: 's6',
    name: 'Hébergement Web',
    description: 'Hébergement de site web sécurisé',
    unit_price: 25.00,
    unit: 'month',
    tax_rate: 20,
    category: 'Infrastructure',
    created_at: '2025-08-01',
    is_active: true,
  },
  {
    id: 's7',
    name: 'Audit Sécurité',
    description: 'Audit complet de la sécurité informatique',
    unit_price: 1200.00,
    unit: 'unit',
    tax_rate: 20,
    category: 'Sécurité',
    created_at: '2025-09-01',
    is_active: true,
  },
];

export const mockServiceCategories = [
  'Développement',
  'Consultation',
  'Support',
  'Design',
  'Formation',
  'Infrastructure',
  'Sécurité',
];

export const getUnitLabel = (unit: Service['unit']): string => {
  const labels = {
    hour: 'Heure',
    day: 'Jour',
    unit: 'Unité',
    month: 'Mois',
  };
  return labels[unit];
};
