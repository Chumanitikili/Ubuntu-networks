import { useState, useEffect } from 'react';
import { useCall } from '../contexts/CallContext';

interface AnalyticsData {
  callVolume: {
    id: string;
    data: Array<{ x: string; y: number }>;
  }[];
  callDistribution: Array<{ id: string; value: number; color: string }>;
  customerTypeUsage: Array<{
    month: string;
    B2B: number;
    B2C: number;
  }>;
  metrics: {
    totalCalls: number;
    averageCallDuration: number;
    missedCallRate: number;
    customerSatisfaction: number;
  };
}

export function useAnalytics(timeRange: '7d' | '30d' | '90d' = '7d') {
  const { state } = useCall();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    callVolume: [],
    callDistribution: [],
    customerTypeUsage: [],
    metrics: {
      totalCalls: 0,
      averageCallDuration: 0,
      missedCallRate: 0,
      customerSatisfaction: 0,
    },
  });

  useEffect(() => {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
    }

    // Filter calls within the date range
    const relevantCalls = [
      ...state.callHistory,
      ...state.activeCalls,
    ].filter(call => call.startTime >= startDate && call.startTime <= endDate);

    // Calculate call volume data
    const callsByDay = new Map<string, number>();
    relevantCalls.forEach(call => {
      const day = call.startTime.toLocaleDateString('en-US', { weekday: 'short' });
      callsByDay.set(day, (callsByDay.get(day) || 0) + 1);
    });

    // Calculate call distribution
    const inboundCalls = relevantCalls.filter(call => call.type === 'inbound').length;
    const outboundCalls = relevantCalls.filter(call => call.type === 'outbound').length;

    // Calculate customer type usage
    const b2bCalls = relevantCalls.filter(call => call.accountType === 'B2B').length;
    const b2cCalls = relevantCalls.filter(call => call.accountType === 'B2C').length;

    // Calculate metrics
    const totalCalls = relevantCalls.length;
    const completedCalls = relevantCalls.filter(call => call.status === 'completed');
    const missedCalls = relevantCalls.filter(call => call.status === 'missed');
    
    const averageCallDuration = completedCalls.reduce((acc, call) => {
      if (call.endTime) {
        return acc + (call.endTime.getTime() - call.startTime.getTime());
      }
      return acc;
    }, 0) / (completedCalls.length || 1) / 1000 / 60; // Convert to minutes

    const missedCallRate = (missedCalls.length / totalCalls) * 100;
    
    // Update analytics data
    setAnalyticsData({
      callVolume: [{
        id: 'calls',
        data: Array.from(callsByDay.entries()).map(([day, count]) => ({
          x: day,
          y: count,
        })),
      }],
      callDistribution: [
        { id: 'Inbound', value: inboundCalls, color: '#2196F3' },
        { id: 'Outbound', value: outboundCalls, color: '#FF4081' },
      ],
      customerTypeUsage: [
        {
          month: new Date().toLocaleDateString('en-US', { month: 'short' }),
          B2B: b2bCalls,
          B2C: b2cCalls,
        },
      ],
      metrics: {
        totalCalls,
        averageCallDuration,
        missedCallRate,
        customerSatisfaction: 85 + Math.random() * 10, // Simulated satisfaction score
      },
    });
  }, [state.callHistory, state.activeCalls, timeRange]);

  return analyticsData;
}
