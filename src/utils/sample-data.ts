
import { Agent, Call, DashboardStats, Lead, AIAssistant } from './types';

export const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
    skills: ['Sales', 'Enterprise', 'Technical'],
    activeCalls: 1,
    completedCalls: 45,
    avgCallDuration: 345, // 5:45 in seconds
  },
  {
    id: '2',
    name: 'Michael Johnson',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'busy',
    skills: ['Support', 'Technical'],
    activeCalls: 1,
    completedCalls: 36,
    avgCallDuration: 278, // 4:38 in seconds
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
    skills: ['Sales', 'Support'],
    activeCalls: 0,
    completedCalls: 28,
    avgCallDuration: 312, // 5:12 in seconds
  },
  {
    id: '4',
    name: 'Robert Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'away',
    skills: ['Enterprise', 'Technical', 'Support'],
    activeCalls: 0,
    completedCalls: 32,
    avgCallDuration: 401, // 6:41 in seconds
  },
  {
    id: '5',
    name: 'Sarah Thompson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'offline',
    skills: ['Sales', 'Enterprise'],
    activeCalls: 0,
    completedCalls: 41,
    avgCallDuration: 298, // 4:58 in seconds
  },
];

export const sampleCalls: Call[] = [
  {
    id: '1',
    callerId: '+14155551234',
    callerName: 'Alex Morgan',
    callerCompany: 'Acme Corp',
    startTime: new Date(Date.now() - 540000), // 9 minutes ago
    status: 'active',
    isB2B: true,
    agentId: '1',
    agentName: 'Jane Cooper',
  },
  {
    id: '2',
    callerId: '+14155552345',
    callerName: 'Jordan Smith',
    callerCompany: 'Globex Inc',
    startTime: new Date(Date.now() - 420000), // 7 minutes ago
    status: 'active',
    isB2B: true,
    agentId: '2',
    agentName: 'Michael Johnson',
  },
  {
    id: '3',
    callerId: '+14155553456',
    callerName: 'Taylor Brown',
    startTime: new Date(Date.now() - 180000), // 3 minutes ago
    status: 'waiting',
    isB2B: false,
  },
  {
    id: '4',
    callerId: '+14155554567',
    callerName: 'Ryan Williams',
    callerCompany: 'Initech LLC',
    startTime: new Date(Date.now() - 3600000), // 1 hour ago
    endTime: new Date(Date.now() - 3300000), // 55 minutes ago
    duration: 300, // 5 minutes
    status: 'completed',
    isB2B: true,
    agentId: '3',
    agentName: 'Emily Davis',
    recordingUrl: '#',
  },
  {
    id: '5',
    callerId: '+14155555678',
    callerName: 'Casey Jones',
    startTime: new Date(Date.now() - 7200000), // 2 hours ago
    status: 'missed',
    isB2B: false,
  },
  {
    id: '6',
    callerId: '+14155556789',
    callerName: 'Jamie Miller',
    callerCompany: 'Stark Industries',
    startTime: new Date(Date.now() - 10800000), // 3 hours ago
    endTime: new Date(Date.now() - 10680000), // 2 hours 58 minutes ago
    duration: 120, // 2 minutes
    status: 'completed',
    isB2B: true,
    agentId: '1',
    agentName: 'Jane Cooper',
    recordingUrl: '#',
  },
];

export const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    company: 'Acme Corp',
    email: 'alex@acmecorp.com',
    phone: '+14155551234',
    status: 'qualified',
    score: 85,
    source: 'Inbound Call',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    lastContactedAt: new Date(Date.now() - 540000), // 9 minutes ago
    notes: 'Interested in enterprise plan, decision maker',
    isB2B: true,
  },
  {
    id: '2',
    name: 'Jordan Smith',
    company: 'Globex Inc',
    email: 'jordan@globex.com',
    phone: '+14155552345',
    status: 'contacted',
    score: 60,
    source: 'Website Form',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    lastContactedAt: new Date(Date.now() - 420000), // 7 minutes ago
    notes: 'Evaluating options, needs technical demo',
    isB2B: true,
  },
  {
    id: '3',
    name: 'Taylor Brown',
    email: 'taylor@gmail.com',
    phone: '+14155553456',
    status: 'new',
    score: 35,
    source: 'Inbound Call',
    createdAt: new Date(Date.now() - 180000), // 3 minutes ago
    isB2B: false,
  },
  {
    id: '4',
    name: 'Ryan Williams',
    company: 'Initech LLC',
    email: 'ryan@initech.com',
    phone: '+14155554567',
    status: 'qualified',
    score: 78,
    source: 'LinkedIn Ad',
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    lastContactedAt: new Date(Date.now() - 3600000), // 1 hour ago
    notes: 'Has budget approval, looking to implement in Q3',
    isB2B: true,
  },
  {
    id: '5',
    name: 'Casey Jones',
    email: 'casey@yahoo.com',
    phone: '+14155555678',
    status: 'unqualified',
    score: 15,
    source: 'Facebook Ad',
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
    lastContactedAt: new Date(Date.now() - 7200000), // 2 hours ago
    notes: 'Not a good fit for our service',
    isB2B: false,
  },
];

export const sampleDashboardStats: DashboardStats = {
  totalCalls: 127,
  activeCalls: 2,
  completedCalls: 114,
  missedCalls: 11,
  avgWaitTime: 45, // 45 seconds
  avgCallDuration: 295, // 4:55 in seconds
  callsPerHour: [
    { hour: 9, count: 12 },
    { hour: 10, count: 18 },
    { hour: 11, count: 15 },
    { hour: 12, count: 8 },
    { hour: 13, count: 10 },
    { hour: 14, count: 16 },
    { hour: 15, count: 14 },
    { hour: 16, count: 11 },
  ],
};

export const sampleAIAssistants: AIAssistant[] = [
  {
    id: '1',
    name: 'Nova',
    voice: 'en-US-Standard-F',
    prompt: 'You are Nova, a friendly AI receptionist. Greet callers warmly and ask how you can help them today.',
    isActive: true,
    transcriptionEnabled: true,
    usedMinutes: 324,
    maxMinutes: 1000,
  },
  {
    id: '2',
    name: 'Max',
    voice: 'en-US-Standard-B',
    prompt: 'You are Max, a professional B2B sales assistant. Qualify leads by asking about their company size, needs, and timeline.',
    isActive: false,
    transcriptionEnabled: true,
    usedMinutes: 156,
    maxMinutes: 1000,
  }
];
