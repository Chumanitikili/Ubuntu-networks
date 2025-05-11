import { useState } from 'react';

interface LLMConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface LLMResponse {
  response: string;
  requiresHuman: boolean;
  complexity: number;
  intent?: string;
  entities?: Record<string, any>;
}

export const useLLM = (config?: LLMConfig) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    input: string,
    context: {
      callerType: 'B2B' | 'B2C';
      context?: Record<string, any>;
    }
  ): Promise<LLMResponse> => {
    if (!config?.apiKey) {
      throw new Error('LLM API key not configured');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for a call center. The caller is a ${context.callerType} customer. 
              Your task is to:
              1. Understand the caller's intent
              2. Determine if human intervention is needed
              3. Provide a helpful response
              4. Assess the complexity of the request (0-1 scale)
              
              Additional context: ${JSON.stringify(context.context || {})}`
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse the response to extract structured data
      const parsedResponse = parseLLMResponse(content);

      return {
        response: parsedResponse.response,
        requiresHuman: parsedResponse.requiresHuman,
        complexity: parsedResponse.complexity,
        intent: parsedResponse.intent,
        entities: parsedResponse.entities,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseLLMResponse = (content: string): LLMResponse => {
    try {
      // In a real implementation, this would parse the LLM's structured response
      // For now, we'll use a simple heuristic
      const requiresHuman = content.toLowerCase().includes('transfer') || 
                          content.toLowerCase().includes('agent') ||
                          content.toLowerCase().includes('human');
      
      const complexity = requiresHuman ? 0.8 : 0.3;

      return {
        response: content,
        requiresHuman,
        complexity,
        intent: 'general_inquiry', // This would be extracted from the LLM response
        entities: {}, // This would be extracted from the LLM response
      };
    } catch (err) {
      console.error('Error parsing LLM response:', err);
      return {
        response: content,
        requiresHuman: true,
        complexity: 1,
      };
    }
  };

  return {
    generateResponse,
    isProcessing,
    error,
  };
}; 