import { create } from 'zustand';
import { Call, SMS, Agent } from '@prisma/client';

interface CallState {
  activeCalls: Call[];
  setActiveCalls: (calls: Call[]) => void;
  addCall: (call: Call) => void;
  updateCall: (callId: string, updates: Partial<Call>) => void;
  removeCall: (callId: string) => void;
}

interface SMSState {
  messages: SMS[];
  setMessages: (messages: SMS[]) => void;
  addMessage: (message: SMS) => void;
  updateMessage: (messageId: string, updates: Partial<SMS>) => void;
}

interface AgentState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
}

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeCalls: [],
  setActiveCalls: (calls) => set({ activeCalls: calls }),
  addCall: (call) => set((state) => ({ activeCalls: [...state.activeCalls, call] })),
  updateCall: (callId, updates) =>
    set((state) => ({
      activeCalls: state.activeCalls.map((call) =>
        call.id === callId ? { ...call, ...updates } : call
      ),
    })),
  removeCall: (callId) =>
    set((state) => ({
      activeCalls: state.activeCalls.filter((call) => call.id !== callId),
    })),
}));

export const useSMSStore = create<SMSState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, ...updates } : message
      ),
    })),
}));

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  updateAgent: (agentId, updates) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      ),
    })),
}));

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
})); 