export type AdminAlertSeverity = 'info' | 'warning' | 'critical';

export interface AdminMetricSummary {
  usersTotal: number;
  usersActive: number;
  mrr: number;
  churnRate: number;
  pendingFeedbacks: number;
  openTickets: number;
}

export interface AdminSubscriptionBreakdown {
  free: number;
  pro: number;
  trial: number;
}

export interface AdminSupportSummary {
  avgResponseTimeHours: number;
  slaBreaches: number;
}

export interface AdminSystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  lastBackupAt: string;
  queueDepth: number;
}

export interface AdminActivityItem {
  id: string;
  type: 'user' | 'billing' | 'feedback' | 'system';
  title: string;
  description?: string;
  createdAt: string;
}

export interface AdminAlertItem {
  id: string;
  severity: AdminAlertSeverity;
  title: string;
  description?: string;
  createdAt: string;
}

export interface AdminOverviewResponse {
  metrics: AdminMetricSummary;
  subscriptions: AdminSubscriptionBreakdown;
  support: AdminSupportSummary;
  system: AdminSystemHealth;
  recentActivity: AdminActivityItem[];
  alerts: AdminAlertItem[];
}

export interface AdminUserSummary {
  planName: string;
  id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'suspended';
  plan: 'free' | 'pro';
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  total: number;
  page: number;
  limit: number;
  users: AdminUserSummary[];
}

export interface AdminSubscriptionSummary {
  id: string;
  userId: string;
  plan: 'free' | 'pro';
  status: 'active' | 'canceled' | 'expired' | 'trialing';
  startDate: string;
  nextBillingDate?: string;
  canceledAt?: string;
}

export interface AdminSubscriptionsResponse {
  total: number;
  page: number;
  limit: number;
  subscriptions: AdminSubscriptionSummary[];
}

export interface AdminFeedbackSummary {
  id: string;
  type: 'question' | 'bug' | 'feature' | 'other';
  status: 'submitted' | 'in_review' | 'responded' | 'closed';
  email: string;
  subject: string;
  createdAt: string;
}

export interface AdminFeedbackDetail extends AdminFeedbackSummary {
  message: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: string;
}

export interface AdminFeedbackResponse {
  total: number;
  page: number;
  limit: number;
  feedbacks: AdminFeedbackSummary[];
}

export interface AdminAuditLogItem {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  target?: string;
  createdAt: string;
  ipAddress?: string;
}

export interface AdminAuditLogResponse {
  total: number;
  page: number;
  limit: number;
  logs: AdminAuditLogItem[];
}

export interface AdminSecuritySettings {
  mfaRequired: boolean;
  passwordMinLength: number;
  tokenTtlMinutes: number;
}

export interface AdminAccessSettings {
  allowAdminImpersonation: boolean;
  maxAdminSessions: number;
}

export interface AdminBillingSettings {
  prorationEnabled: boolean;
  gracePeriodDays: number;
  defaultCurrency: string;
}

export interface AdminNotificationSettings {
  slaWarningHours: number;
  emailFrom: string;
  webhookUrl: string;
}

export interface AdminIntegrationSettings {
  crmProvider: 'none' | 'hubspot' | 'salesforce';
  analyticsProvider: 'none' | 'mixpanel' | 'segment';
}

export interface AdminSystemSettings {
  maintenanceMode: boolean;
  backupFrequencyHours: number;
}

export interface AdminAuditSettings {
  retentionDays: number;
  exportEnabled: boolean;
}

export interface AdminSettingsResponse {
  security: AdminSecuritySettings;
  access: AdminAccessSettings;
  billing: AdminBillingSettings;
  notifications: AdminNotificationSettings;
  integrations: AdminIntegrationSettings;
  system: AdminSystemSettings;
  audit: AdminAuditSettings;
}

export interface AdminStatPoint {
  date: string;
  value: number;
}

export interface AdminStatsResponse {
  users: AdminStatPoint[];
  revenue: AdminStatPoint[];
  churnRate: AdminStatPoint[];
  period: 'week' | 'month' | 'year';
}
