
export type CallStatus = 'active' | 'waiting' | 'missed' | 'completed';

export interface Call {
  id: string;
  callerId: string;
  callerName: string;
  callerCompany?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  status: CallStatus;
  notes?: string;
  isB2B: boolean;
  agentId?: string;
  agentName?: string;
  recordingUrl?: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  skills: string[];
  activeCalls: number;
  completedCalls: number;
  avgCallDuration: number; // in seconds
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  score: number;
  source: string;
  createdAt: Date;
  lastContactedAt?: Date;
  notes?: string;
  isB2B: boolean;
}

export interface DashboardStats {
  totalCalls: number;
  activeCalls: number;
  completedCalls: number;
  missedCalls: number;
  avgWaitTime: number; // in seconds
  avgCallDuration: number; // in seconds
  callsPerHour: { hour: number; count: number }[];
}

export interface AIAssistant {
  id: string;
  name: string;
  voice: string;
  prompt: string;
  isActive: boolean;
  transcriptionEnabled: boolean;
  usedMinutes: number;
  maxMinutes: number;
}
