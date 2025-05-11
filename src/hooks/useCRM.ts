import { useState } from 'react';

interface CustomerData {
  id: string;
  type: 'B2B' | 'B2C';
  name: string;
  phone: string;
  email?: string;
  company?: string;
  interactions: Interaction[];
  metadata: Record<string, any>;
}

interface Interaction {
  id: string;
  type: 'call' | 'email' | 'chat';
  timestamp: string;
  duration?: number;
  summary?: string;
  sentiment?: number;
  metadata: Record<string, any>;
}

export const useCRM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCallerData = async (phoneNumber: string): Promise<CustomerData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call your CRM API
      const response = await fetch(`/api/crm/customer/${phoneNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCallerData = async (phoneNumber: string, data: Partial<CustomerData>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/customer/${phoneNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer data');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logInteraction = async (
    phoneNumber: string,
    interaction: Omit<Interaction, 'id'>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/customer/${phoneNumber}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interaction),
      });

      if (!response.ok) {
        throw new Error('Failed to log interaction');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerHistory = async (phoneNumber: string): Promise<Interaction[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/customer/${phoneNumber}/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer history');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCallerData,
    updateCallerData,
    logInteraction,
    getCustomerHistory,
    isLoading,
    error,
  };
}; 