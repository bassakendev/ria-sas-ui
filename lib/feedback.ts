import apiClient from '@/lib/api';

export interface Feedback {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  type: 'bug' | 'feature-request' | 'improvement' | 'other';
  priority?: 'low' | 'medium' | 'high';
  status: 'open' | 'reviewing' | 'in-progress' | 'closed';
  rating?: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedbackResponse extends Feedback {
  response?: {
    message: string;
    responded_by: string;
    responded_at: string;
  };
}

export interface FeedbacksResponse {
  total: number;
  page: number;
  limit: number;
  feedbacks: FeedbackResponse[];
}

export interface CreateFeedbackRequest {
  subject: string;
  message: string;
  type: 'bug' | 'feature-request' | 'improvement' | 'other';
  rating?: number;
}

export interface FeedbackStats {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
}

/**
 * Submit new feedback message
 * POST /api/feedback
 */
export async function submitFeedback(data: CreateFeedbackRequest): Promise<FeedbackResponse> {
  const response = await apiClient.post('/feedback', data);
  return response.data;
}

/**
 * Get all feedback messages from current user
 * GET /api/feedback
 */
export async function getFeedbacks(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<FeedbacksResponse> {
  const response = await apiClient.get('/feedback', { params });
  return response.data;
}

/**
 * List feedbacks (alias for getFeedbacks)
 */
export async function listFeedbacks(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<FeedbacksResponse> {
  return getFeedbacks(params);
}

/**
 * Get single feedback message details
 * GET /api/feedback/{feedback}
 */
export async function getFeedback(id: string): Promise<FeedbackResponse> {
  const response = await apiClient.get(`/feedback/${id}`);
  return response.data;
}

/**
 * Delete feedback message
 * DELETE /api/feedback/{feedback}
 */
export async function deleteFeedback(id: string): Promise<void> {
  await apiClient.delete(`/feedback/${id}`);
}

/**
 * Mark feedback as read
 * PATCH /api/feedback/{feedback}/mark-read
 */
export async function markFeedbackAsRead(id: string): Promise<FeedbackResponse> {
  const response = await apiClient.patch(`/feedback/${id}/mark-read`);
  return response.data;
}

/**
 * Close a feedback ticket
 * PATCH /api/feedback/{feedback}/close
 */
export async function closeFeedback(id: string): Promise<FeedbackResponse> {
  const response = await apiClient.patch(`/feedback/${id}/close`);
  return response.data;
}

/**
 * Update feedback (admin only)
 */
export async function updateFeedback(
  id: string,
  updates: Partial<{
    status: 'open' | 'reviewing' | 'in-progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    response: string;
  }>
): Promise<FeedbackResponse> {
  const response = await apiClient.patch(`/feedback/${id}`, updates);
  return response.data;
}

/**
 * Get feedback statistics (admin only)
 */
export async function getFeedbackStats(): Promise<FeedbackStats> {
  const response = await apiClient.get('/feedback/stats');
  return response.data;
}
