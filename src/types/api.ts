export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Call {
  id: string;
  phoneNumber: string;
  status: CallStatus;
  duration?: number;
  startTime: string;
  endTime?: string;
  recordingUrl?: string;
  transcript?: string;
  agentId?: string;
}

export enum CallStatus {
  INITIATED = 'INITIATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  MISSED = 'MISSED'
}

export interface SMS {
  id: string;
  phoneNumber: string;
  message: string;
  status: SMSStatus;
  sentTime: string;
  deliveredTime?: string;
}

export enum SMSStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: AgentStatus;
  skills: string[];
  currentCallId?: string;
}

export enum AgentStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}

export interface CallMetrics {
  totalCalls: number;
  averageDuration: number;
  missedCalls: number;
  completedCalls: number;
  timeRange: {
    start: string;
    end: string;
  };
} 