import { apiClient } from './apiClient';
import { Agent, ApiResponse } from '../types/api';

export const agentService = {
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return apiClient.get<Agent[]>('/agents');
  },

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    return apiClient.get<Agent>(`/agents/${agentId}`);
  },

  async updateAgentStatus(agentId: string, status: string): Promise<ApiResponse<Agent>> {
    return apiClient.put<Agent>(`/agents/${agentId}/status`, { status });
  },

  async updateAgentSkills(agentId: string, skills: string[]): Promise<ApiResponse<Agent>> {
    return apiClient.put<Agent>(`/agents/${agentId}/skills`, { skills });
  },

  async getAvailableAgents(): Promise<ApiResponse<Agent[]>> {
    return apiClient.get<Agent[]>('/agents/available');
  },

  async getAgentMetrics(agentId: string, startDate: string, endDate: string): Promise<ApiResponse<{
    totalCalls: number;
    averageHandleTime: number;
    customerSatisfaction: number;
  }>> {
    return apiClient.get<{
      totalCalls: number;
      averageHandleTime: number;
      customerSatisfaction: number;
    }>(`/agents/${agentId}/metrics`, {
      params: { startDate, endDate },
    });
  },

  async createAgent(agentData: Omit<Agent, 'id'>): Promise<ApiResponse<Agent>> {
    return apiClient.post<Agent>('/agents', agentData);
  },

  async updateAgent(agentId: string, agentData: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return apiClient.put<Agent>(`/agents/${agentId}`, agentData);
  },

  async deleteAgent(agentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/agents/${agentId}`);
  },
}; 