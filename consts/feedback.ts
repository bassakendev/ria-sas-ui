/**
 * Feedback Management Constants and Types
 * Gestion des retours utilisateur (questions, bugs, suggestions, autres)
 */

export type FeedbackType = 'question' | 'bug' | 'feature' | 'other';
export type FeedbackStatus = 'submitted' | 'in_review' | 'responded' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Interface pour un feedback
 */
export interface Feedback {
    id: string;
    userId: string;
    type: FeedbackType;
    email: string;
    subject: string;
    message: string;
    status: FeedbackStatus;
    priority?: FeedbackPriority;
    createdAt: string;
    updatedAt?: string;
    respondedAt?: string;
    response?: string;
    attachments?: string[]; // URLs des fichiers attachés
    sourceUrl?: string; // URL d'où vient le feedback
    userAgent?: string; // Info du navigateur/device
}

/**
 * Interface pour créer un feedback
 */
export interface CreateFeedbackRequest {
    type: FeedbackType;
    email: string;
    subject: string;
    message: string;
    sourceUrl?: string;
    userAgent?: string;
}

/**
 * Interface pour la réponse du serveur
 */
export interface FeedbackResponse {
    id: string;
    message: string;
    feedback: Feedback;
}

/**
 * Interface pour lister les feedbacks
 */
export interface FeedbackListResponse {
    total: number;
    page: number;
    limit: number;
    feedbacks: Feedback[];
}

/**
 * Interface pour les stats des feedbacks
 */
export interface FeedbackStats {
    total: number;
    byType: {
        question: number;
        bug: number;
        feature: number;
        other: number;
    };
    byStatus: {
        submitted: number;
        in_review: number;
        responded: number;
        closed: number;
    };
    avgResponseTime?: number; // en heures
}

/**
 * Configuration des types de feedback
 */
export const feedbackTypeConfig: Record<FeedbackType, {
    label: string;
    icon: string;
    color: string;
    description: string;
}> = {
    question: {
        label: 'Question',
        icon: 'MessageSquare',
        color: 'blue',
        description: 'Vous avez une question sur l\'utilisation',
    },
    bug: {
        label: 'Bug / Problème',
        icon: 'AlertCircle',
        color: 'red',
        description: 'Signaler un problème ou un dysfonctionnement',
    },
    feature: {
        label: 'Suggestion',
        icon: 'Lightbulb',
        color: 'green',
        description: 'Proposer une nouvelle fonctionnalité',
    },
    other: {
        label: 'Autre',
        icon: 'MoreHorizontal',
        color: 'gray',
        description: 'Message général ou feedback',
    },
};

/**
 * Configuration des statuts
 */
export const feedbackStatusConfig: Record<FeedbackStatus, {
    label: string;
    color: string;
    description: string;
}> = {
    submitted: {
        label: 'Soumis',
        color: 'blue',
        description: 'Le feedback a été reçu',
    },
    in_review: {
        label: 'En cours de révision',
        color: 'yellow',
        description: 'Notre équipe examine votre feedback',
    },
    responded: {
        label: 'Répondu',
        color: 'green',
        description: 'Nous avons répondu à votre feedback',
    },
    closed: {
        label: 'Fermé',
        color: 'gray',
        description: 'Le ticket a été fermé',
    },
};

/**
 * Configuration des niveaux de priorité
 */
export const feedbackPriorityConfig: Record<FeedbackPriority, {
    label: string;
    color: string;
    value: number;
}> = {
    low: {
        label: 'Basse',
        color: 'gray',
        value: 1,
    },
    medium: {
        label: 'Moyenne',
        color: 'yellow',
        value: 2,
    },
    high: {
        label: 'Haute',
        color: 'orange',
        value: 3,
    },
    urgent: {
        label: 'Urgente',
        color: 'red',
        value: 4,
    },
};

/**
 * Mock data pour le développement
 */
export const mockFeedbacks: Feedback[] = [
    {
        id: 'fb-001',
        userId: 'user-123',
        type: 'question',
        email: 'user@example.com',
        subject: 'Comment exporter les factures en PDF ?',
        message: 'Je ne trouve pas l\'option pour exporter les factures en PDF. Pouvez-vous m\'aider ?',
        status: 'responded',
        priority: 'medium',
        createdAt: '2026-02-20T10:00:00Z',
        updatedAt: '2026-02-21T14:30:00Z',
        respondedAt: '2026-02-21T14:30:00Z',
        response: 'Vous trouverez l\'option d\'export en PDF dans l\'en-tête de chaque facture, sous le bouton "Plus d\'options".',
        sourceUrl: 'https://app.example.com/invoices/123',
    },
    {
        id: 'fb-002',
        userId: 'user-456',
        type: 'bug',
        email: 'developer@example.com',
        subject: 'Erreur 500 lors de la création de facture',
        message: 'Lorsque j\'essaie de créer une facture avec plus de 20 articles, j\'obtiens une erreur 500.',
        status: 'in_review',
        priority: 'high',
        createdAt: '2026-02-22T09:15:00Z',
        updatedAt: '2026-02-22T11:00:00Z',
        sourceUrl: 'https://app.example.com/invoices/create',
    },
    {
        id: 'fb-003',
        userId: 'user-789',
        type: 'feature',
        email: 'customer@example.com',
        subject: 'Intégration avec Slack pour les notifications',
        message: 'Pourriez-vous ajouter l\'intégration Slack pour recevoir les notifications des nouvelles factures ?',
        status: 'submitted',
        priority: 'low',
        createdAt: '2026-02-22T15:45:00Z',
    },
];

/**
 * Mock stats
 */
export const mockFeedbackStats: FeedbackStats = {
    total: 43,
    byType: {
        question: 18,
        bug: 12,
        feature: 10,
        other: 3,
    },
    byStatus: {
        submitted: 5,
        in_review: 8,
        responded: 22,
        closed: 8,
    },
    avgResponseTime: 8.5,
};
