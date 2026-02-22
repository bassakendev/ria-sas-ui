# API Documentation - RIA SaaS

Documentation complète des endpoints API requis pour le frontend RIA SaaS.

## 📑 Table des Matières

1. [Authentification](#authentification)
2. [Gestion Utilisateur](#gestion-utilisateur)
3. [Factures](#factures)
4. [Clients](#clients)
5. [Dashboard](#dashboard)
6. [Stripe](#stripe)
7. [Feedback](#feedback)
8. [Modèles de Données](#modèles-de-données)
9. [Codes d'Erreur](#codes-derreur)

---

## Base URL

```
http://localhost:8000/api
```

## Headers Communs

### Authentification requise
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🔐 Authentification

### 1. Connexion

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "company_name": "ABC Solutions",
    "created_at": "2024-01-15T10:30:00Z",
    "subscription_plan": "free",
    "subscription_status": "active"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 2. Inscription

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "company_name": "My Company Ltd"
}
```

**Response Success (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_456",
    "email": "newuser@example.com",
    "company_name": "My Company Ltd",
    "created_at": "2024-01-20T14:22:00Z",
    "subscription_plan": "free",
    "subscription_status": "active"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Email already exists"
}
```

---

### 3. Mot de passe oublié

**Endpoint:** `POST /api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response Success (200):**
```json
{
  "message": "Password reset email sent successfully"
}
```

**Notes:**
- L'email doit contenir un lien vers : `http://votre-frontend.com/reset-password/{token}`
- Le token doit expirer après 1 heure (configurable)
- Toujours retourner 200 même si l'email n'existe pas (sécurité)

**Response Error (400):**
```json
{
  "error": "Invalid email format"
}
```

---

### 4. Réinitialiser le mot de passe

**Endpoint:** `POST /api/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset_token_abc123xyz",
  "password": "newSecurePassword123"
}
```

**Notes:**
- Le token provient du lien envoyé par email
- Vérifier que le token n'a pas expiré
- Hasher le nouveau mot de passe avant de le sauvegarder

**Response Success (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Response Error (400):**
```json
{
  "error": "Invalid or expired token"
}
```

**Response Error (400):**
```json
{
  "error": "Password must be at least 8 characters"
}
```

---

## 👤 Gestion Utilisateur

### 5. Récupérer l'utilisateur actuel

**Endpoint:** `GET /api/user`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "id": "user_123",
  "email": "john@example.com",
  "company_name": "ABC Solutions",
  "created_at": "2024-01-15T10:30:00Z",
  "subscription_plan": "pro",
  "subscription_status": "active",
  "subscription_id": "sub_1234567890",
  "usage": {
    "invoices_count": 42,
    "clients_count": 18,
    "storage_used_mb": 234
  }
}
```

---

### 6. Modifier le profil utilisateur

**Endpoint:** `PUT /api/user/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "company_name": "New Company Name",
  "current_password": "oldpassword123",
  "new_password": "newpassword456"
}
```

**Notes:**
- `current_password` et `new_password` sont optionnels (uniquement pour changer le mot de passe)
- Si `email` est modifié, vérifiez qu'il n'existe pas déjà

**Response Success (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "email": "newemail@example.com",
    "company_name": "New Company Name",
    "created_at": "2024-01-15T10:30:00Z",
    "subscription_plan": "pro",
    "subscription_status": "active"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Current password is incorrect"
}
```

---

### 7. Supprimer le compte

**Endpoint:** `DELETE /api/user/account`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "message": "Account deleted successfully"
}
```

---

## 📄 Factures

### 8. Lister les factures

**Endpoint:** `GET /api/invoices`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `search` (string, optional) - Recherche par numéro de facture ou nom de client
- `status` (string, optional) - Filtre par statut : `draft`, `sent`, `paid`, `unpaid`
- `page` (number, optional, default: 1) - Numéro de page
- `limit` (number, optional, default: 10) - Nombre de résultats par page

**Exemple:** `GET /api/invoices?search=INV&status=paid&page=1&limit=20`

**Response Success (200):**
```json
{
  "invoices": [
    {
      "id": "inv_001",
      "invoice_number": "INV-2024-001",
      "client": {
        "id": "client_123",
        "name": "Entreprise ABC",
        "email": "contact@abc.com"
      },
      "items": [
        {
          "id": "item_1",
          "description": "Développement web",
          "quantity": 10,
          "unit_price": 500.00
        },
        {
          "id": "item_2",
          "description": "Design UI/UX",
          "quantity": 5,
          "unit_price": 300.00
        }
      ],
      "subtotal": 6500.00,
      "tax_rate": 20,
      "tax_amount": 1300.00,
      "total": 7800.00,
      "status": "paid",
      "issue_date": "2024-01-15",
      "due_date": "2024-02-15",
      "paid_date": "2024-02-10",
      "notes": "Merci pour votre confiance",
      "watermark": {
        "enabled": true,
        "text": "PAYÉ",
        "rotation": -45,
        "color": "#22c55e"
      },
      "created_at": "2024-01-15T09:00:00Z",
      "updated_at": "2024-02-10T14:30:00Z"
    },
    {
      "id": "inv_002",
      "invoice_number": "INV-2024-002",
      "client": {
        "id": "client_456",
        "name": "Société XYZ",
        "email": "info@xyz.com"
      },
      "items": [
        {
          "id": "item_3",
          "description": "Consultation SEO",
          "quantity": 1,
          "unit_price": 1200.00
        }
      ],
      "subtotal": 1200.00,
      "tax_rate": 0,
      "tax_amount": 0,
      "total": 1200.00,
      "status": "unpaid",
      "issue_date": "2024-01-20",
      "due_date": "2024-02-20",
      "paid_date": null,
      "notes": null,
      "watermark": {
        "enabled": false,
        "text": "",
        "rotation": 0,
        "color": "#000000"
      },
      "created_at": "2024-01-20T11:15:00Z",
      "updated_at": "2024-01-20T11:15:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 42,
    "items_per_page": 10
  }
}
```

---

### 9. Récupérer une facture

**Endpoint:** `GET /api/invoices/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "id": "inv_001",
  "invoice_number": "INV-2024-001",
  "client": {
    "id": "client_123",
    "name": "Entreprise ABC",
    "email": "contact@abc.com",
    "phone": "+33 1 23 45 67 89",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "postal_code": "75001",
    "country": "France"
  },
  "items": [
    {
      "id": "item_1",
      "description": "Développement web",
      "quantity": 10,
      "unit_price": 500.00
    }
  ],
  "subtotal": 5000.00,
  "tax_rate": 20,
  "tax_amount": 1000.00,
  "total": 6000.00,
  "status": "paid",
  "issue_date": "2024-01-15",
  "due_date": "2024-02-15",
  "paid_date": "2024-02-10",
  "notes": "Merci pour votre confiance",
  "watermark": {
    "enabled": true,
    "text": "PAYÉ",
    "rotation": -45,
    "color": "#22c55e"
  },
  "created_at": "2024-01-15T09:00:00Z",
  "updated_at": "2024-02-10T14:30:00Z"
}
```

**Response Error (404):**
```json
{
  "error": "Invoice not found"
}
```

---

### 10. Créer une facture

**Endpoint:** `POST /api/invoices`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "invoice_number": "INV-2024-003",
  "client_id": "client_123",
  "items": [
    {
      "description": "Service de design",
      "quantity": 5,
      "unit_price": 250.00
    },
    {
      "description": "Hébergement annuel",
      "quantity": 1,
      "unit_price": 500.00
    }
  ],
  "tax_rate": 20,
  "status": "draft",
  "issue_date": "2024-01-25",
  "due_date": "2024-02-25",
  "notes": "Paiement à 30 jours",
  "watermark": {
    "enabled": false,
    "text": "",
    "rotation": 0,
    "color": "#000000"
  }
}
```

**Notes:**
- `invoice_number` doit être unique
- `tax_rate` est un pourcentage (ex: 20 pour 20%)
- `subtotal`, `tax_amount` et `total` sont calculés automatiquement côté backend
- `status` peut être : `draft`, `sent`, `paid`, `unpaid`

**Response Success (201):**
```json
{
  "id": "inv_003",
  "invoice_number": "INV-2024-003",
  "client": {
    "id": "client_123",
    "name": "Entreprise ABC",
    "email": "contact@abc.com"
  },
  "items": [
    {
      "id": "item_5",
      "description": "Service de design",
      "quantity": 5,
      "unit_price": 250.00
    },
    {
      "id": "item_6",
      "description": "Hébergement annuel",
      "quantity": 1,
      "unit_price": 500.00
    }
  ],
  "subtotal": 1750.00,
  "tax_rate": 20,
  "tax_amount": 350.00,
  "total": 2100.00,
  "status": "draft",
  "issue_date": "2024-01-25",
  "due_date": "2024-02-25",
  "paid_date": null,
  "notes": "Paiement à 30 jours",
  "watermark": {
    "enabled": false,
    "text": "",
    "rotation": 0,
    "color": "#000000"
  },
  "created_at": "2024-01-25T10:00:00Z",
  "updated_at": "2024-01-25T10:00:00Z"
}
```

**Response Error (400):**
```json
{
  "error": "Invoice number already exists"
}
```

**Response Error (403) - Limite Free Plan atteinte:**
```json
{
  "error": "You have reached the invoice limit for your plan. Please upgrade to Pro."
}
```

---

### 11. Modifier une facture

**Endpoint:** `PUT /api/invoices/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "invoice_number": "INV-2024-003-BIS",
  "client_id": "client_456",
  "items": [
    {
      "description": "Service modifié",
      "quantity": 8,
      "unit_price": 300.00
    }
  ],
  "tax_rate": 0,
  "status": "sent",
  "issue_date": "2024-01-25",
  "due_date": "2024-02-28",
  "notes": "Facture mise à jour",
  "watermark": {
    "enabled": true,
    "text": "EN ATTENTE",
    "rotation": -45,
    "color": "#f59e0b"
  }
}
```

**Response Success (200):**
```json
{
  "id": "inv_003",
  "invoice_number": "INV-2024-003-BIS",
  "client": {
    "id": "client_456",
    "name": "Société XYZ",
    "email": "info@xyz.com"
  },
  "items": [
    {
      "id": "item_7",
      "description": "Service modifié",
      "quantity": 8,
      "unit_price": 300.00
    }
  ],
  "subtotal": 2400.00,
  "tax_rate": 0,
  "tax_amount": 0,
  "total": 2400.00,
  "status": "sent",
  "issue_date": "2024-01-25",
  "due_date": "2024-02-28",
  "paid_date": null,
  "notes": "Facture mise à jour",
  "watermark": {
    "enabled": true,
    "text": "EN ATTENTE",
    "rotation": -45,
    "color": "#f59e0b"
  },
  "created_at": "2024-01-25T10:00:00Z",
  "updated_at": "2024-01-25T11:30:00Z"
}
```

---

### 12. Supprimer une facture

**Endpoint:** `DELETE /api/invoices/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "message": "Invoice deleted successfully"
}
```

**Response Error (404):**
```json
{
  "error": "Invoice not found"
}
```

---

### 13. Exporter les factures en CSV

**Endpoint:** `GET /api/invoices/export`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `search` (string, optional) - Recherche par numéro de facture ou nom de client
- `status` (string, optional) - Filtre par statut : `draft`, `sent`, `paid`, `unpaid`

**Exemple:** `GET /api/invoices/export?status=paid`

**Response Success (200):**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="invoices_export_2024-01-25.csv"`

**Format CSV:**
```csv
Numéro,Client,Montant HT,TVA,Montant TTC,Statut,Date d'émission,Date d'échéance,Date de paiement
INV-2024-001,Entreprise ABC,5000.00,1000.00,6000.00,paid,2024-01-15,2024-02-15,2024-02-10
INV-2024-002,Société XYZ,1200.00,0.00,1200.00,unpaid,2024-01-20,2024-02-20,
INV-2024-003,Tech Corp,3500.00,700.00,4200.00,sent,2024-01-22,2024-02-22,
```

---

### 14. Envoyer une facture par email

**Endpoint:** `POST /api/invoices/:id/send-email`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "recipient_email": "client@example.com",
  "subject": "Votre facture INV-2024-001",
  "message": "Bonjour,\n\nVeuillez trouver ci-joint votre facture.\n\nCordialement"
}
```

**Response Success (200):**
```json
{
  "message": "Email sent successfully"
}
```

**Response Error (400):**
```json
{
  "error": "Invalid email address"
}
```

---

### 15. Envoyer une facture par WhatsApp

**Endpoint:** `POST /api/invoices/:id/send-whatsapp`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone_number": "+33612345678",
  "message": "Bonjour, voici votre facture INV-2024-001"
}
```

**Response Success (200):**
```json
{
  "message": "WhatsApp message sent successfully"
}
```

**Response Error (400):**
```json
{
  "error": "Invalid phone number"
}
```

---

## 👥 Clients

### 16. Lister les clients

**Endpoint:** `GET /api/clients`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `search` (string, optional) - Recherche par nom, email ou téléphone
- `page` (number, optional, default: 1) - Numéro de page
- `limit` (number, optional, default: 10) - Nombre de résultats par page

**Exemple:** `GET /api/clients?search=ABC&page=1&limit=20`

**Response Success (200):**
```json
{
  "clients": [
    {
      "id": "client_123",
      "name": "Entreprise ABC",
      "email": "contact@abc.com",
      "phone": "+33 1 23 45 67 89",
      "address": "123 Rue de la Paix",
      "city": "Paris",
      "postal_code": "75001",
      "country": "France",
      "created_at": "2024-01-10T08:00:00Z",
      "total_invoices": 12,
      "total_revenue": 25000.00
    },
    {
      "id": "client_456",
      "name": "Société XYZ",
      "email": "info@xyz.com",
      "phone": "+33 1 98 76 54 32",
      "address": "456 Avenue des Champs",
      "city": "Lyon",
      "postal_code": "69001",
      "country": "France",
      "created_at": "2024-01-12T10:30:00Z",
      "total_invoices": 5,
      "total_revenue": 8500.00
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_items": 18,
    "items_per_page": 10
  }
}
```

---

### 17. Récupérer un client

**Endpoint:** `GET /api/clients/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "id": "client_123",
  "name": "Entreprise ABC",
  "email": "contact@abc.com",
  "phone": "+33 1 23 45 67 89",
  "address": "123 Rue de la Paix",
  "city": "Paris",
  "postal_code": "75001",
  "country": "France",
  "created_at": "2024-01-10T08:00:00Z",
  "total_invoices": 12,
  "total_revenue": 25000.00,
  "recent_invoices": [
    {
      "id": "inv_001",
      "invoice_number": "INV-2024-001",
      "total": 6000.00,
      "status": "paid",
      "issue_date": "2024-01-15"
    },
    {
      "id": "inv_005",
      "invoice_number": "INV-2024-005",
      "total": 3200.00,
      "status": "sent",
      "issue_date": "2024-01-20"
    }
  ]
}
```

**Response Error (404):**
```json
{
  "error": "Client not found"
}
```

---

### 18. Créer un client

**Endpoint:** `POST /api/clients`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nouvelle Entreprise SARL",
  "email": "contact@nouvelle-entreprise.fr",
  "phone": "+33 1 11 22 33 44",
  "address": "789 Boulevard de la Liberté",
  "city": "Marseille",
  "postal_code": "13001",
  "country": "France"
}
```

**Response Success (201):**
```json
{
  "id": "client_789",
  "name": "Nouvelle Entreprise SARL",
  "email": "contact@nouvelle-entreprise.fr",
  "phone": "+33 1 11 22 33 44",
  "address": "789 Boulevard de la Liberté",
  "city": "Marseille",
  "postal_code": "13001",
  "country": "France",
  "created_at": "2024-01-25T12:00:00Z",
  "total_invoices": 0,
  "total_revenue": 0.00
}
```

**Response Error (400):**
```json
{
  "error": "Email already exists"
}
```

**Response Error (403) - Limite Free Plan atteinte:**
```json
{
  "error": "You have reached the client limit for your plan. Please upgrade to Pro."
}
```

---

### 19. Modifier un client

**Endpoint:** `PUT /api/clients/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Entreprise ABC (Modifié)",
  "email": "nouveau-email@abc.com",
  "phone": "+33 1 99 88 77 66",
  "address": "123 Rue de la Paix, Bâtiment B",
  "city": "Paris",
  "postal_code": "75002",
  "country": "France"
}
```

**Response Success (200):**
```json
{
  "id": "client_123",
  "name": "Entreprise ABC (Modifié)",
  "email": "nouveau-email@abc.com",
  "phone": "+33 1 99 88 77 66",
  "address": "123 Rue de la Paix, Bâtiment B",
  "city": "Paris",
  "postal_code": "75002",
  "country": "France",
  "created_at": "2024-01-10T08:00:00Z",
  "total_invoices": 12,
  "total_revenue": 25000.00
}
```

---

### 20. Supprimer un client

**Endpoint:** `DELETE /api/clients/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "message": "Client deleted successfully"
}
```

**Response Error (400) - Client a des factures:**
```json
{
  "error": "Cannot delete client with existing invoices"
}
```

---

### 21. Exporter les clients en CSV

**Endpoint:** `GET /api/clients/export`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `search` (string, optional) - Recherche par nom, email ou téléphone

**Response Success (200):**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="clients_export_2024-01-25.csv"`

**Format CSV:**
```csv
Nom,Email,Téléphone,Ville,Pays,Nombre de factures,Revenu total,Date de création
Entreprise ABC,contact@abc.com,+33 1 23 45 67 89,Paris,France,12,25000.00,2024-01-10
Société XYZ,info@xyz.com,+33 1 98 76 54 32,Lyon,France,5,8500.00,2024-01-12
Tech Corp,hello@techcorp.fr,+33 1 55 66 77 88,Marseille,France,8,15000.00,2024-01-15
```

---

## 📊 Dashboard

### 22. Récupérer les statistiques du dashboard

**Endpoint:** `GET /api/dashboard/stats`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "total_revenue": 125000.00,
  "total_unpaid": 15000.00,
  "total_clients": 42,
  "total_invoices": 128,
  "monthly_revenue": [
    {
      "month": "Jan",
      "revenue": 12000.00
    },
    {
      "month": "Feb",
      "revenue": 15000.00
    },
    {
      "month": "Mar",
      "revenue": 18000.00
    },
    {
      "month": "Apr",
      "revenue": 22000.00
    },
    {
      "month": "May",
      "revenue": 19000.00
    },
    {
      "month": "Jun",
      "revenue": 25000.00
    }
  ],
  "recent_invoices": [
    {
      "id": "inv_120",
      "invoice_number": "INV-2024-120",
      "client_name": "Entreprise ABC",
      "amount": 5000.00,
      "status": "paid",
      "issue_date": "2024-06-20"
    },
    {
      "id": "inv_119",
      "invoice_number": "INV-2024-119",
      "client_name": "Société XYZ",
      "amount": 3200.00,
      "status": "sent",
      "issue_date": "2024-06-18"
    },
    {
      "id": "inv_118",
      "invoice_number": "INV-2024-118",
      "client_name": "Tech Corp",
      "amount": 7500.00,
      "status": "unpaid",
      "issue_date": "2024-06-15"
    },
    {
      "id": "inv_117",
      "invoice_number": "INV-2024-117",
      "client_name": "Digital Agency",
      "amount": 2800.00,
      "status": "paid",
      "issue_date": "2024-06-12"
    },
    {
      "id": "inv_116",
      "invoice_number": "INV-2024-116",
      "client_name": "Startup Inc",
      "amount": 4500.00,
      "status": "draft",
      "issue_date": "2024-06-10"
    }
  ]
}
```

**Notes:**
- `monthly_revenue` contient les revenus des 6 derniers mois
- `recent_invoices` contient les 5 dernières factures créées

---

### 23. Exporter les factures du dashboard en CSV

**Endpoint:** `GET /api/dashboard/export-invoices`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="dashboard_invoices_2024-01-25.csv"`

**Format CSV:**
```csv
Numéro,Client,Montant,Statut,Date d'émission
INV-2024-120,Entreprise ABC,5000.00,paid,2024-06-20
INV-2024-119,Société XYZ,3200.00,sent,2024-06-18
INV-2024-118,Tech Corp,7500.00,unpaid,2024-06-15
INV-2024-117,Digital Agency,2800.00,paid,2024-06-12
INV-2024-116,Startup Inc,4500.00,draft,2024-06-10
```

---

## 💳 Stripe

### 24. Créer une session de paiement Stripe

**Endpoint:** `POST /api/stripe/create-checkout-session`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "price_id": "price_1234567890",
  "success_url": "http://localhost:3000/billing/success",
  "cancel_url": "http://localhost:3000/billing/cancel"
}
```

**Notes:**
- `price_id` est l'ID du produit Stripe (plan Pro)
- Les URLs de callback doivent correspondre à votre domaine

**Response Success (200):**
```json
{
  "sessionId": "cs_test_1234567890abcdef",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890abcdef"
}
```

**Response Error (400):**
```json
{
  "error": "Invalid price_id"
}
```

---

### 25. Créer une session portail Stripe

**Endpoint:** `POST /api/stripe/create-portal-session`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "return_url": "http://localhost:3000/settings/billing"
}
```

**Response Success (200):**
```json
{
  "url": "https://billing.stripe.com/session/1234567890abcdef"
}
```

**Notes:**
- Permet à l'utilisateur de gérer son abonnement (modifier carte bancaire, voir factures, etc.)
- Nécessite un `subscription_id` valide pour l'utilisateur

---

### 26. Annuler un abonnement

**Endpoint:** `POST /api/stripe/cancel-subscription`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscription_id": "sub_1234567890"
}
```

**Response Success (200):**
```json
{
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": "sub_1234567890",
    "status": "canceled",
    "cancel_at_period_end": true,
    "current_period_end": "2024-02-25T23:59:59Z"
  }
}
```

**Notes:**
- L'abonnement reste actif jusqu'à la fin de la période en cours
- L'utilisateur garde l'accès Pro jusqu'à `current_period_end`

---

## 💬 Feedback

### 27. Envoyer un feedback/contact

**Endpoint:** `POST /api/feedback`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "bug",
  "email": "user@example.com",
  "subject": "Problème d'affichage des factures",
  "message": "Bonjour,\n\nJ'ai rencontré un problème lors de l'affichage de mes factures...\n\nCordialement"
}
```

**Notes:**
- `type` peut être : `question`, `bug`, `feature`, `other`
- `email` est pré-rempli avec l'email de l'utilisateur connecté mais peut être modifié

**Response Success (200):**
```json
{
  "message": "Feedback sent successfully",
  "ticket_id": "ticket_1234567"
}
```

---

## 📋 Modèles de Données

### User (Utilisateur)

```typescript
interface User {
  id: string;
  email: string;
  company_name: string;
  created_at: string; // ISO 8601
  subscription_plan: "free" | "pro";
  subscription_status: "active" | "canceled" | "past_due";
  subscription_id?: string; // ID Stripe
  usage?: {
    invoices_count: number;
    clients_count: number;
    storage_used_mb: number;
  };
}
```

---

### Invoice (Facture)

```typescript
interface Invoice {
  id: string;
  invoice_number: string; // Unique
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  items: InvoiceItem[];
  subtotal: number; // Calculé automatiquement
  tax_rate: number; // Pourcentage (ex: 20 pour 20%)
  tax_amount: number; // Calculé automatiquement
  total: number; // Calculé automatiquement
  status: "draft" | "sent" | "paid" | "unpaid";
  issue_date: string; // Format: YYYY-MM-DD
  due_date: string; // Format: YYYY-MM-DD
  paid_date: string | null; // Format: YYYY-MM-DD
  notes?: string;
  watermark: {
    enabled: boolean;
    text: string;
    rotation: number; // -90 à 90
    color: string; // Format hex: #RRGGBB
  };
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

---

### InvoiceItem (Ligne de facture)

```typescript
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number; // >= 1
  unit_price: number; // >= 0
}
```

---

### Client

```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  created_at: string; // ISO 8601
  total_invoices: number; // Nombre total de factures
  total_revenue: number; // Somme des factures payées
}
```

---

### DashboardStats (Statistiques Dashboard)

```typescript
interface DashboardStats {
  total_revenue: number; // Revenu total (factures payées)
  total_unpaid: number; // Montant impayé (factures unpaid + sent)
  total_clients: number; // Nombre de clients
  total_invoices: number; // Nombre de factures
  monthly_revenue: Array<{
    month: string; // Jan, Feb, Mar, etc.
    revenue: number;
  }>;
  recent_invoices: Array<{
    id: string;
    invoice_number: string;
    client_name: string;
    amount: number;
    status: string;
    issue_date: string; // Format: YYYY-MM-DD
  }>;
}
```

---

### SubscriptionPlan (Plan d'abonnement)

```typescript
interface SubscriptionPlan {
  id: "free" | "pro";
  name: string;
  price: number; // Prix mensuel en euros
  features: string[]; // Liste des fonctionnalités
  limits: {
    invoices_per_month: number | "unlimited";
    max_clients: number | "unlimited";
    storage_mb: number; // Espace de stockage
  };
  stripe_price_id?: string; // ID Stripe du produit
}
```

---

## ⚠️ Codes d'Erreur

### Erreurs d'authentification (401)

```json
{
  "error": "Invalid credentials"
}
```

```json
{
  "error": "Token expired"
}
```

```json
{
  "error": "Unauthorized"
}
```

---

### Erreurs de validation (400)

```json
{
  "error": "Email already exists"
}
```

```json
{
  "error": "Invalid email format"
}
```

```json
{
  "error": "Password must be at least 8 characters"
}
```

```json
{
  "error": "Invoice number already exists"
}
```

```json
{
  "error": "Client not found"
}
```

---

### Erreurs de limite de plan (403)

```json
{
  "error": "You have reached the invoice limit for your plan. Please upgrade to Pro.",
  "limit": 5,
  "current": 5
}
```

```json
{
  "error": "You have reached the client limit for your plan. Please upgrade to Pro.",
  "limit": 3,
  "current": 3
}
```

---

### Erreurs ressource non trouvée (404)

```json
{
  "error": "Invoice not found"
}
```

```json
{
  "error": "Client not found"
}
```

```json
{
  "error": "User not found"
}
```

---

### Erreurs serveur (500)

```json
{
  "error": "Internal server error"
}
```

```json
{
  "error": "Database connection failed"
}
```

---

## 🔒 Sécurité

### Authentification
- Tous les endpoints (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT
- Le token doit être envoyé dans le header `Authorization: Bearer <token>`
- Les tokens expirent après 24 heures (configurable)

### Validation
- Valider tous les inputs côté backend
- Échapper les caractères spéciaux pour prévenir les injections SQL
- Limiter la taille des requêtes (max 10 MB)

### Rate Limiting
- Implémenter un rate limiting pour éviter les abus
- Suggéré : 100 requêtes par minute par utilisateur

### CORS
- Configurer CORS pour accepter uniquement le domaine frontend
- En développement : `http://localhost:3000`
- En production : votre domaine de production

---

## 📝 Notes d'Implémentation

### Calculs automatiques
Les champs suivants doivent être calculés automatiquement côté backend :
- `invoice.subtotal` = Somme de (item.quantity × item.unit_price) pour tous les items
- `invoice.tax_amount` = subtotal × (tax_rate / 100)
- `invoice.total` = subtotal + tax_amount
- `client.total_invoices` = Nombre de factures liées au client
- `client.total_revenue` = Somme des factures payées du client

### Gestion des statuts de facture
- `draft` : Facture en brouillon, modifiable
- `sent` : Facture envoyée au client
- `paid` : Facture payée (définir automatiquement `paid_date` au moment du changement)
- `unpaid` : Facture impayée après la date d'échéance

### Webhooks Stripe
Implémenter un endpoint webhook pour recevoir les événements Stripe :
- `checkout.session.completed` : Mettre à jour le plan de l'utilisateur à "pro"
- `customer.subscription.deleted` : Rétrograder l'utilisateur à "free"
- `invoice.payment_succeeded` : Confirmer le paiement de l'abonnement

### Format CSV
- Encoder les CSV en UTF-8 avec BOM pour Excel
- Utiliser des virgules comme séparateur
- Échapper les guillemets dans les valeurs
- Inclure un header avec les noms de colonnes

### Emails
Pour l'envoi d'emails (factures, notifications) :
- Utiliser un service comme SendGrid, Mailgun ou AWS SES
- Inclure le PDF de la facture en pièce jointe
- Templates HTML responsive

### WhatsApp
Pour l'envoi WhatsApp :
- Utiliser l'API WhatsApp Business
- Ou un service comme Twilio API WhatsApp

---

## 🚀 Endpoints Prioritaires

Pour un MVP fonctionnel, implémenter dans cet ordre :

**Phase 1 (Critique):**
1. POST /auth/login
2. POST /auth/register
3. POST /api/auth/forgot-password
4. POST /api/auth/reset-password
5. GET /api/user
6. GET /api/invoices
7. POST /api/invoices
8. GET /api/invoices/:id
9. GET /api/clients
10. POST /api/clients

**Phase 2 (Important):**
11. PUT /api/invoices/:id
12. DELETE /api/invoices/:id
13. PUT /api/clients/:id
14. DELETE /api/clients/:id
15. GET /api/dashboard/stats

**Phase 3 (Avancé):**
16. POST /api/stripe/create-checkout-session
17. POST /api/stripe/create-portal-session
18. GET /api/invoices/export
19. GET /api/clients/export
20. POST /api/feedback

**Phase 4 (Optionnel):**
21. POST /api/invoices/:id/send-email
22. POST /api/invoices/:id/send-whatsapp
23. PUT /api/user/profile
24. DELETE /api/user/account

---

## 📧 Contact Backend

Pour toute question sur l'implémentation des API, contactez l'équipe frontend.

**Dernière mise à jour** : 2026-02-22
