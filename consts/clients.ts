// Mock data pour la page Clients

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  total_invoices: number;
  total_revenue: number;
}

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Entreprise Dupont SARL',
    email: 'contact@dupont.fr',
    phone: '+33 1 23 45 67 89',
    address: '12 Rue de la République',
    city: 'Paris',
    postal_code: '75001',
    country: 'France',
    created_at: '2025-06-15',
    total_invoices: 12,
    total_revenue: 28500.00,
  },
  {
    id: 'c2',
    name: 'Tech Solutions SAS',
    email: 'admin@techsolutions.com',
    phone: '+33 6 12 34 56 78',
    address: '45 Avenue des Champs-Élysées',
    city: 'Paris',
    postal_code: '75008',
    country: 'France',
    created_at: '2025-08-20',
    total_invoices: 8,
    total_revenue: 45200.00,
  },
  {
    id: 'c3',
    name: 'Martin Consulting',
    email: 'martin@consulting.fr',
    phone: '+33 4 56 78 90 12',
    address: '78 Boulevard Victor Hugo',
    city: 'Lyon',
    postal_code: '69003',
    country: 'France',
    created_at: '2025-09-10',
    total_invoices: 15,
    total_revenue: 18750.00,
  },
  {
    id: 'c4',
    name: 'Restaurant Le Gourmet',
    email: 'contact@legourmet.fr',
    phone: '+33 5 67 89 01 23',
    address: '23 Rue de la Gastronomie',
    city: 'Bordeaux',
    postal_code: '33000',
    country: 'France',
    created_at: '2025-10-05',
    total_invoices: 6,
    total_revenue: 5340.00,
  },
  {
    id: 'c5',
    name: 'Cabinet Avocat Bernard',
    email: 'bernard@avocat.fr',
    phone: '+33 3 45 67 89 01',
    address: '56 Place de la Justice',
    city: 'Marseille',
    postal_code: '13001',
    country: 'France',
    created_at: '2025-11-12',
    total_invoices: 10,
    total_revenue: 32000.00,
  },
  {
    id: 'c6',
    name: 'Boutique Mode Élégance',
    email: 'contact@elegance.fr',
    phone: '+33 2 34 56 78 90',
    address: '89 Rue du Commerce',
    city: 'Nice',
    postal_code: '06000',
    country: 'France',
    created_at: '2025-12-01',
    total_invoices: 4,
    total_revenue: 8920.00,
  },
];

export const mockClientStats = {
  total: mockClients.length,
  active: mockClients.filter(c => c.total_invoices > 0).length,
  totalRevenue: mockClients.reduce((sum, c) => sum + c.total_revenue, 0),
};
