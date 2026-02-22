# RIA SaaS - Plateforme de Gestion de Facturation

## 📋 Description

RIA SaaS est une plateforme web moderne de gestion de facturation et de clients conçue pour les petites et moyennes entreprises. L'application permet de créer, gérer et suivre facilement vos factures, clients et revenus.

## ✨ Fonctionnalités Principales

### 📊 Dashboard
- Vue d'ensemble des statistiques clés (revenus, factures, clients)
- Graphiques de revenus mensuels
- Liste des factures récentes
- Export CSV des données

### 📄 Gestion des Factures
- Création et édition de factures
- Prévisualisation en temps réel
- Gestion des items/services
- TVA optionnelle et configurable
- Filigrane personnalisable (texte, couleur, rotation)
- Statuts : Brouillon, Envoyée, Payée, Impayée
- Envoi par email et WhatsApp
- Export CSV avec filtres
- Téléchargement PDF

### 👥 Gestion des Clients
- CRUD complet des clients
- Historique des factures par client
- Statistiques de revenus par client
- Export CSV avec filtres
- Recherche et filtrage avancé

### 💳 Abonnements & Tarification
- **Plan Gratuit** : 5 factures/mois, 3 clients max, 100 MB
- **Plan Pro** : Factures illimitées, clients illimités, 10 GB, support prioritaire
- Intégration Stripe pour les paiements
- Portail de gestion d'abonnement
- Badge de statut Pro/Free dans l'interface

### ⚙️ Paramètres
- Gestion du profil (email, nom entreprise, mot de passe)
- Paramètres de facturation
- Suppression de compte
- Thème clair/sombre

### 💬 Support & Feedback
- Bouton flottant de contact accessible partout
- Formulaire de feedback (questions, bugs, suggestions)
- Système de notifications Toast

## 🏗️ Structure du Projet

```
ria-sas-ui/
├── app/                          # Pages Next.js (App Router)
│   ├── (public)/                # Pages publiques (non authentifiées)
│   │   ├── login/              # Page de connexion
│   │   ├── register/           # Page d'inscription
│   │   └── pricing/            # Page de tarification
│   ├── (dashboard)/            # Pages du dashboard (authentifiées)
│   │   ├── dashboard/         # Page d'accueil dashboard
│   │   ├── invoices/          # Gestion des factures
│   │   │   ├── create/       # Créer une facture
│   │   │   ├── [id]/         # Détails d'une facture
│   │   │   └── [id]/edit/    # Modifier une facture
│   │   ├── clients/           # Gestion des clients
│   │   │   ├── create/       # Créer un client
│   │   │   ├── [id]/         # Détails d'un client
│   │   │   └── [id]/edit/    # Modifier un client
│   │   └── settings/          # Paramètres
│   │       ├── page.tsx       # Profil utilisateur
│   │       └── billing/       # Facturation & abonnement
│   ├── billing/               # Pages de callback Stripe
│   │   ├── success/          # Paiement réussi
│   │   └── cancel/           # Paiement annulé
│   ├── layout.tsx            # Layout racine
│   └── page.tsx              # Page d'accueil
│
├── components/                 # Composants React réutilisables
│   ├── ui/                    # Composants UI de base
│   │   ├── Sidebar.tsx       # Menu latéral
│   │   ├── Topbar.tsx        # Barre supérieure
│   │   ├── Button.tsx        # Boutons
│   │   ├── Input.tsx         # Champs de saisie
│   │   ├── Toast.tsx         # Notifications
│   │   ├── ConfirmModal.tsx  # Modales de confirmation
│   │   ├── FeedbackButton.tsx # Bouton de feedback flottant
│   │   └── ...               # Autres composants UI
│   ├── forms/                 # Formulaires
│   │   ├── InvoiceFormBuilder.tsx  # Formulaire de facture
│   │   ├── ClientFormBuilder.tsx   # Formulaire de client
│   │   ├── LoginForm.tsx          # Formulaire de connexion
│   │   └── RegisterForm.tsx       # Formulaire d'inscription
│   ├── tables/                # Tableaux de données
│   │   ├── InvoicesTable.tsx # Tableau des factures
│   │   └── ClientsTable.tsx  # Tableau des clients
│   └── auth/                  # Composants d'authentification
│
├── lib/                        # Bibliothèques et utilitaires
│   ├── api.ts                 # Configuration Axios
│   ├── auth.ts                # Fonctions d'authentification
│   ├── stripe.ts              # Intégration Stripe
│   ├── csvExport.ts           # Export CSV
│   ├── hooks.ts               # Hooks personnalisés
│   ├── theme.tsx              # Gestion du thème
│   └── sidebar-context.tsx    # Contexte sidebar
│
├── consts/                     # Constantes et données mock
│   ├── invoices.ts            # Mock data factures
│   ├── clients.ts             # Mock data clients
│   ├── dashboard.ts           # Mock data dashboard
│   ├── subscriptions.ts       # Configuration des plans
│   └── services.ts            # Mock data services
│
├── public/                     # Ressources statiques
├── .env.local                 # Variables d'environnement (à créer)
├── package.json               # Dépendances
└── tsconfig.json              # Configuration TypeScript
```

## 🚀 Installation

### Prérequis
- Node.js 18.x ou supérieur
- npm ou yarn
- Un backend API (voir API_DOCUMENTATION.md)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd ria-sas-ui
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration des variables d'environnement**
   
   Créer un fichier `.env.local` à la racine du projet :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Accéder à l'application**
   
   Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes

### Bibliothèques
- **Axios** - Client HTTP
- **Stripe** - Paiements en ligne
- **React Hook Form** - Gestion de formulaires (optionnel)

### Outils de développement
- **ESLint** - Linter JavaScript/TypeScript
- **PostCSS** - Traitement CSS

## 📱 Fonctionnalités Clés par Page

### 🏠 Dashboard (`/dashboard`)
- Statistiques KPI (revenus, impayés, clients, factures)
- Graphiques de revenus mensuels
- Liste des 5 dernières factures
- Export CSV rapide

### 📄 Factures (`/invoices`)
- Table avec recherche et filtres (statut, date)
- Actions inline : Voir, Modifier, Supprimer
- Export CSV filtré
- Création de facture avec :
  - Sélection client
  - Ajout d'items/services multiples
  - Calcul automatique des totaux
  - TVA optionnelle et configurable
  - Filigrane personnalisable
  - Prévisualisation en temps réel
  - Notes personnalisées

### 👥 Clients (`/clients`)
- Table avec recherche
- Statistiques par client (factures, revenus)
- Export CSV
- Formulaire de création/édition complet

### ⚙️ Paramètres (`/settings`)
- **Profil** : Modification email, entreprise, mot de passe
- **Facturation** : 
  - Affichage du plan actuel (Free/Pro)
  - Upgrade vers Pro
  - Gestion de l'abonnement Stripe
  - Annulation d'abonnement
- **Compte** : Suppression de compte avec confirmation

## 🎨 Design & UX

### Thème
- Mode clair et sombre
- Transition fluide entre les thèmes
- Persistance de la préférence utilisateur

### Navigation
- Sidebar collapsible avec badge de plan
- Topbar avec CTA "Passer au Pro" (visible en Free)
- Responsive mobile-friendly

### Interactions
- Notifications Toast pour tous les feedbacks
- Modales de confirmation pour actions destructives
- Animations et transitions fluides
- États de chargement clairs

### Accessibilité
- Navigation au clavier
- Aria labels sur les éléments interactifs
- Contraste des couleurs respectant WCAG

## 🔐 Sécurité

- Authentification JWT via localStorage
- Routes protégées avec middleware
- Validation des données côté client
- Gestion sécurisée des tokens
- Protection CSRF (à configurer côté backend)

## 📦 Build & Déploiement

### Build de production
```bash
npm run build
# ou
yarn build
```

### Lancer en production
```bash
npm start
# ou
yarn start
```

### Déploiement recommandé
- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** (voir Dockerfile si disponible)

### Variables d'environnement en production
Configurer les variables suivantes dans votre plateforme de déploiement :
- `NEXT_PUBLIC_API_URL` - URL de votre API backend
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Clé publique Stripe

## 🧪 Tests (À implémenter)

Le projet peut être étendu avec :
- **Jest** + **React Testing Library** pour les tests unitaires
- **Cypress** ou **Playwright** pour les tests E2E
- **MSW** pour mocker les API en développement

## 📚 Documentation Complémentaire

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentation complète des endpoints API

## 🤝 Contribution

Le projet utilise :
- ESLint pour la qualité du code
- Prettier pour le formatage (à configurer)
- Commits conventionnels recommandés

## 📄 License

[À définir]

## 👥 Auteurs

RIA SaaS Team

---

**Note** : Ce projet est actuellement en développement et utilise des données mockées. Pour le rendre fonctionnel en production, implémentez le backend selon [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
