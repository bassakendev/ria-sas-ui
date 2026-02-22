# Consts - Mock Data

Ce dossier contient toutes les données de démonstration (mock data) utilisées dans l'application.

## Structure

- `dashboard.ts` - Mock data pour la page Dashboard (stats, factures récentes, graphique revenus)
- `clients.ts` - Mock data pour la liste des clients
- `services.ts` - Mock data pour la liste des services
- `invoices.ts` - Mock data pour la liste complète des factures avec détails des lignes

## Utilisation

```typescript
import { mockDashboardStats, mockRecentInvoices } from '@/consts/dashboard';

// Utiliser les données
const stats = mockDashboardStats;
const invoices = mockRecentInvoices;
```

## Note

Ces données sont temporaires et seront remplacées par de vraies requêtes API une fois le backend connecté.
