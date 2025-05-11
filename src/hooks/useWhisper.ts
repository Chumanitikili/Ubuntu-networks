import { useState } from 'react';

interface WhisperConfig {
  apiKey: string;
  model?: string;
  language?: string;
}

export const useWhisper = (config?: WhisperConfig) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = async (audioStream: MediaStream): Promise<string> => {
    if (!config?.apiKey) {
      throw new Error('Whisper API key not configured');
    }

    setIsTranscribing(true);
    setError(null);

    try {
      // Convert audio stream to blob
      const audioBlob = await streamToBlob(audioStream);
      
      // Create form data for API request
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', config.model || 'whisper-1');
      if (config.language) {
        formData.append('language', config.language);
      }

      // Call Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      return data.text;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  };

  const streamToBlob = async (stream: MediaStream): Promise<Blob> => {
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        resolve(blob);
      };

      mediaRecorder.onerror = (e) => {
        reject(new Error('Error recording audio'));
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    });
  };

  return {
    transcribeAudio,
    isTranscribing,
    error,
  };
}; 