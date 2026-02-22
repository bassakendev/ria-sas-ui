// Mock data pour la page Invoices


export interface InvoiceItem {
    id: string;
    service_id: string;
    service_name: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    total: number;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    client_id: string;
    client: {
        id: string;
        name: string;
        email: string;
        address?: string;
        city?: string;
        postal_code?: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'unpaid';
    due_date: string;
    issue_date: string;
    created_at: string;
    updated_at: string;
    notes?: string;
}

export const mockInvoices: Invoice[] = [
    {
        id: '1',
        invoice_number: 'INV-2026-001',
        client_id: 'c1',
        client: {
            id: 'c1',
            name: 'Entreprise Dupont SARL',
            email: 'contact@dupont.fr',
            address: '12 Rue de la République',
            city: 'Paris',
            postal_code: '75001',
        },
        items: [
            {
                id: 'i1',
                service_id: 's1',
                service_name: 'Développement Web',
                description: 'Développement site vitrine',
                quantity: 20,
                unit_price: 75.00,
                tax_rate: 20,
                total: 1500.00,
            },
            {
                id: 'i2',
                service_id: 's4',
                service_name: 'Design UI/UX',
                description: 'Design interface utilisateur',
                quantity: 10,
                unit_price: 85.00,
                tax_rate: 20,
                total: 850.00,
            },
        ],
        subtotal: 2350.00,
        tax: 470.00,
        total: 2820.00,
        status: 'paid',
        due_date: '2026-02-28',
        issue_date: '2026-02-15',
        created_at: '2026-02-15',
        updated_at: '2026-02-18',
        notes: 'Paiement reçu. Merci pour votre confiance.',
    },
    {
        id: '2',
        invoice_number: 'INV-2026-002',
        client_id: 'c2',
        client: {
            id: 'c2',
            name: 'Tech Solutions SAS',
            email: 'admin@techsolutions.com',
            address: '45 Avenue des Champs-Élysées',
            city: 'Paris',
            postal_code: '75008',
        },
        items: [
            {
                id: 'i3',
                service_id: 's2',
                service_name: 'Consultation IT',
                description: 'Audit infrastructure',
                quantity: 40,
                unit_price: 120.00,
                tax_rate: 20,
                total: 4800.00,
            },
        ],
        subtotal: 4800.00,
        tax: 960.00,
        total: 5760.00,
        status: 'unpaid',
        due_date: '2026-03-05',
        issue_date: '2026-02-18',
        created_at: '2026-02-18',
        updated_at: '2026-02-18',
    },
    {
        id: '3',
        invoice_number: 'INV-2026-003',
        client_id: 'c3',
        client: {
            id: 'c3',
            name: 'Martin Consulting',
            email: 'martin@consulting.fr',
            address: '78 Boulevard Victor Hugo',
            city: 'Lyon',
            postal_code: '69003',
        },
        items: [
            {
                id: 'i4',
                service_id: 's3',
                service_name: 'Maintenance Mensuelle',
                description: 'Maintenance février 2026',
                quantity: 1,
                unit_price: 500.00,
                tax_rate: 20,
                total: 500.00,
            },
            {
                id: 'i5',
                service_id: 's6',
                service_name: 'Hébergement Web',
                description: 'Hébergement mensuel',
                quantity: 1,
                unit_price: 25.00,
                tax_rate: 20,
                total: 25.00,
            },
        ],
        subtotal: 525.00,
        tax: 105.00,
        total: 630.00,
        status: 'paid',
        due_date: '2026-02-20',
        issue_date: '2026-02-10',
        created_at: '2026-02-10',
        updated_at: '2026-02-19',
    },
    {
        id: '4',
        invoice_number: 'INV-2026-004',
        client_id: 'c4',
        client: {
            id: 'c4',
            name: 'Restaurant Le Gourmet',
            email: 'contact@legourmet.fr',
            address: '23 Rue de la Gastronomie',
            city: 'Bordeaux',
            postal_code: '33000',
        },
        items: [
            {
                id: 'i6',
                service_id: 's1',
                service_name: 'Développement Web',
                description: 'Site menu en ligne',
                quantity: 8,
                unit_price: 75.00,
                tax_rate: 20,
                total: 600.00,
            },
        ],
        subtotal: 600.00,
        tax: 120.00,
        total: 720.00,
        status: 'sent',
        due_date: '2026-03-01',
        issue_date: '2026-02-20',
        created_at: '2026-02-20',
        updated_at: '2026-02-20',
    },
    {
        id: '5',
        invoice_number: 'INV-2026-005',
        client_id: 'c5',
        client: {
            id: 'c5',
            name: 'Cabinet Avocat Bernard',
            email: 'bernard@avocat.fr',
            address: '56 Place de la Justice',
            city: 'Marseille',
            postal_code: '13001',
        },
        items: [
            {
                id: 'i7',
                service_id: 's2',
                service_name: 'Consultation IT',
                description: 'Migration système',
                quantity: 25,
                unit_price: 120.00,
                tax_rate: 20,
                total: 3000.00,
            },
        ],
        subtotal: 3000.00,
        tax: 600.00,
        total: 3600.00,
        status: 'paid',
        due_date: '2026-02-25',
        issue_date: '2026-02-12',
        created_at: '2026-02-12',
        updated_at: '2026-02-23',
    },
    {
        id: '6',
        invoice_number: 'INV-2026-006',
        client_id: 'c1',
        client: {
            id: 'c1',
            name: 'Entreprise Dupont SARL',
            email: 'contact@dupont.fr',
            address: '12 Rue de la République',
            city: 'Paris',
            postal_code: '75001',
        },
        items: [
            {
                id: 'i8',
                service_id: 's5',
                service_name: 'Formation',
                description: 'Formation SEO',
                quantity: 1,
                unit_price: 450.00,
                tax_rate: 20,
                total: 450.00,
            },
        ],
        subtotal: 450.00,
        tax: 90.00,
        total: 540.00,
        status: 'draft',
        due_date: '2026-03-10',
        issue_date: '2026-02-21',
        created_at: '2026-02-21',
        updated_at: '2026-02-21',
    },
];

export const mockInvoiceStats = {
    total: mockInvoices.length,
    paid: mockInvoices.filter(i => i.status === 'paid').length,
    unpaid: mockInvoices.filter(i => i.status === 'unpaid' || i.status === 'sent').length,
    draft: mockInvoices.filter(i => i.status === 'draft').length,
    totalRevenue: mockInvoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0),
    totalUnpaid: mockInvoices
        .filter(i => i.status === 'unpaid' || i.status === 'sent')
        .reduce((sum, i) => sum + i.total, 0),
};

export const getStatusLabel = (status: Invoice['status']): string => {
    const labels = {
        draft: 'Brouillon',
        sent: 'Envoyée',
        paid: 'Payée',
        unpaid: 'Impayée',
    };
    return labels[status];
};

export const getStatusColor = (status: Invoice['status']): string => {
    const colors = {
        draft: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        sent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        unpaid: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return colors[status];
};
