import { useState } from 'react';
import { useWhisper } from './useWhisper';
import { useLLM } from './useLLM';

interface AIVoiceResponse {
  shouldTransfer: boolean;
  context: any;
  response?: string;
}

export const useAIVoice = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { transcribeAudio } = useWhisper();
  const { generateResponse: generateLLMResponse } = useLLM();

  const processVoiceInput = async (call: any, callerType: 'B2B' | 'B2C'): Promise<AIVoiceResponse> => {
    setIsProcessing(true);
    try {
      // Get audio from call
      const audioStream = await call.getAudioStream();
      
      // Transcribe audio to text
      const transcription = await transcribeAudio(audioStream);
      
      // Process with LLM based on caller type
      const llmResponse = await generateLLMResponse(transcription, {
        callerType,
        context: {
          previousInteractions: call.metadata?.previousInteractions || [],
          callerInfo: call.metadata?.callerInfo || {},
        }
      });

      // Determine if transfer is needed
      const shouldTransfer = llmResponse.requiresHuman || 
        (callerType === 'B2B' && llmResponse.complexity > 0.7);

      return {
        shouldTransfer,
        context: {
          transcription,
          llmResponse,
          callerType,
        },
        response: llmResponse.response
      };
    } catch (error) {
      console.error('Error processing voice input:', error);
      return {
        shouldTransfer: true,
        context: { error: 'Failed to process voice input' }
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const generateResponse = async (input: string, context: any): Promise<string> => {
    try {
      const response = await generateLLMResponse(input, context);
      return response.response;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'I apologize, but I am having trouble processing your request. Let me transfer you to a human agent.';
    }
  };

  return {
    processVoiceInput,
    generateResponse,
    isProcessing
  };
}; 