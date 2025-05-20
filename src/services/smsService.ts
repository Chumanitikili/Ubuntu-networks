import { apiClient } from './apiClient';
import { SMS, ApiResponse } from '../types/api';

export const smsService = {
  async sendSMS(phoneNumber: string, message: string): Promise<ApiResponse<SMS>> {
    return apiClient.post<SMS>('/sms', { phoneNumber, message });
  },

  async getSMS(smsId: string): Promise<ApiResponse<SMS>> {
    return apiClient.get<SMS>(`/sms/${smsId}`);
  },

  async getSMSHistory(
    page: number = 1,
    limit: number = 20,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<{ messages: SMS[]; total: number }>> {
    return apiClient.get<{ messages: SMS[]; total: number }>('/sms/history', {
      params: { page, limit, ...filters },
    });
  },

  async getSMSStatus(smsId: string): Promise<ApiResponse<{ status: string }>> {
    return apiClient.get<{ status: string }>(`/sms/${smsId}/status`);
  },

  async sendBulkSMS(
    phoneNumbers: string[],
    message: string
  ): Promise<ApiResponse<{ success: number; failed: number }>> {
    return apiClient.post<{ success: number; failed: number }>('/sms/bulk', {
      phoneNumbers,
      message,
    });
  },
}; 