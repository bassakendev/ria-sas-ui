import apiClient from '@/lib/api';
import type { AdminFeedbackDetail, AdminFeedbackResponse, AdminFeedbackSummary } from './types';

export async function getAdminFeedbacks(params?: {
  page?: number;
  limit?: number;
  type?: 'question' | 'bug' | 'feature' | 'other';
  status?: 'submitted' | 'in_review' | 'responded' | 'closed';
}): Promise<AdminFeedbackResponse> {
  const response = await apiClient.get('/admin/feedbacks', { params });
  return response.data;
}

export async function updateAdminFeedbackStatus(
  feedbackId: string,
  status: 'submitted' | 'in_review' | 'responded' | 'closed'
): Promise<AdminFeedbackSummary> {
  const response = await apiClient.patch(`/admin/feedbacks/${feedbackId}/status`, { status });
  return response.data;
}

export async function deleteAdminFeedback(feedbackId: string): Promise<{ message: string }>{
  const response = await apiClient.delete(`/admin/feedbacks/${feedbackId}`);
  return response.data;
}

export async function getAdminFeedbackDetail(feedbackId: string): Promise<AdminFeedbackDetail> {
  const response = await apiClient.get(`/admin/feedbacks/${feedbackId}`);
  return response.data;
}

export async function updateAdminFeedbackResponse(
  feedbackId: string,
  response: string
): Promise<AdminFeedbackDetail> {
  const resp = await apiClient.patch(`/admin/feedbacks/${feedbackId}/response`, { response });
  return resp.data;
}
