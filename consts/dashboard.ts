// Mock data pour le Dashboard

export interface DashboardStats {
  total_revenue: number;
  total_unpaid: number;
  total_clients: number;
  total_invoices: number;
}

export interface RecentInvoice {
  id: string;
  invoice_number: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  status: 'paid' | 'unpaid' | 'draft' | 'overdue';
  due_date: string;
  created_at: string;
}

export interface RevenueChartData {
  month: string;
  total: number;
}

// Stats KPI
export const mockDashboardStats: DashboardStats = {
  total_revenue: 48750.00,
  total_unpaid: 12340.00,
  total_clients: 24,
  total_invoices: 67,
};

// Factures récentes (5 dernières)
export const mockRecentInvoices: RecentInvoice[] = [
  {
    id: '1',
    invoice_number: 'INV-2026-001',
    client: {
      id: 'c1',
      name: 'Entreprise Dupont SARL',
      email: 'contact@dupont.fr',
    },
    total: 2450.00,
    status: 'paid',
    due_date: '2026-02-28',
    created_at: '2026-02-15',
  },
  {
    id: '2',
    invoice_number: 'INV-2026-002',
    client: {
      id: 'c2',
      name: 'Tech Solutions SAS',
      email: 'admin@techsolutions.com',
    },
    total: 5800.00,
    status: 'unpaid',
    due_date: '2026-03-05',
    created_at: '2026-02-18',
  },
  {
    id: '3',
    invoice_number: 'INV-2026-003',
    client: {
      id: 'c3',
      name: 'Martin Consulting',
      email: 'martin@consulting.fr',
    },
    total: 1250.00,
    status: 'paid',
    due_date: '2026-02-20',
    created_at: '2026-02-10',
  },
  {
    id: '4',
    invoice_number: 'INV-2026-004',
    client: {
      id: 'c4',
      name: 'Restaurant Le Gourmet',
      email: 'contact@legourmet.fr',
    },
    total: 890.00,
    status: 'unpaid',
    due_date: '2026-03-01',
    created_at: '2026-02-20',
  },
  {
    id: '5',
    invoice_number: 'INV-2026-005',
    client: {
      id: 'c5',
      name: 'Cabinet Avocat Bernard',
      email: 'bernard@avocat.fr',
    },
    total: 3200.00,
    status: 'paid',
    due_date: '2026-02-25',
    created_at: '2026-02-12',
  },
];

// Données graphique évolution revenus (6 derniers mois)
export const mockRevenueChartData: RevenueChartData[] = [
  { month: 'Sep', total: 6200 },
  { month: 'Oct', total: 7800 },
  { month: 'Nov', total: 5400 },
  { month: 'Dec', total: 9200 },
  { month: 'Jan', total: 8100 },
  { month: 'Fév', total: 12050 },
];

// Fonction pour calculer le trend (optionnel pour V2)
export function calculateTrend(current: number, previous: number): { value: string; positive: boolean } {
  const diff = current - previous;
  const percentage = ((diff / previous) * 100).toFixed(1);
  return {
    value: `${diff > 0 ? '+' : ''}${percentage}% vs mois dernier`,
    positive: diff > 0,
  };
}
