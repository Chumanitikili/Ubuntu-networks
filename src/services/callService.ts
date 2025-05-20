import { apiClient } from './apiClient';
import { Call, CallMetrics, ApiResponse } from '../types/api';

export const callService = {
  async initiateCall(phoneNumber: string): Promise<ApiResponse<Call>> {
    return apiClient.post<Call>('/calls', { phoneNumber });
  },

  async getCall(callId: string): Promise<ApiResponse<Call>> {
    return apiClient.get<Call>(`/calls/${callId}`);
  },

  async updateCallStatus(callId: string, status: string): Promise<ApiResponse<Call>> {
    return apiClient.put<Call>(`/calls/${callId}/status`, { status });
  },

  async getCallMetrics(startDate: string, endDate: string): Promise<ApiResponse<CallMetrics>> {
    return apiClient.get<CallMetrics>('/calls/metrics', {
      params: { startDate, endDate },
    });
  },

  async getActiveCalls(): Promise<ApiResponse<Call[]>> {
    return apiClient.get<Call[]>('/calls/active');
  },

  async getCallHistory(
    page: number = 1,
    limit: number = 20,
    filters?: Record<string, unknown>
  ): Promise<ApiResponse<{ calls: Call[]; total: number }>> {
    return apiClient.get<{ calls: Call[]; total: number }>('/calls/history', {
      params: { page, limit, ...filters },
    });
  },

  async endCall(callId: string): Promise<ApiResponse<Call>> {
    return apiClient.post<Call>(`/calls/${callId}/end`);
  },

  async transferCall(callId: string, agentId: string): Promise<ApiResponse<Call>> {
    return apiClient.post<Call>(`/calls/${callId}/transfer`, { agentId });
  },
}; 