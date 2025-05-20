import { Whisper } from 'whisper-node';
import { Piper } from 'piper-tts';
import logger from './logger';

interface SpeechConfig {
  whisperModelPath: string;
  piperModelPath: string;
  piperConfigPath: string;
}

class SpeechService {
  private whisper: Whisper;
  private piper: Piper;
  private config: SpeechConfig;

  constructor(config: SpeechConfig) {
    this.config = config;
    this.whisper = new Whisper(config.whisperModelPath);
    this.piper = new Piper(config.piperModelPath, config.piperConfigPath);
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const result = await this.whisper.transcribe(audioBuffer);
      logger.info('Audio transcribed successfully');
      return result.text;
    } catch (error) {
      logger.error('Failed to transcribe audio:', error);
      throw error;
    }
  }

  async textToSpeech(text: string): Promise<Buffer> {
    try {
      const audioBuffer = await this.piper.synthesize(text);
      logger.info('Text converted to speech successfully');
      return audioBuffer;
    } catch (error) {
      logger.error('Failed to convert text to speech:', error);
      throw error;
    }
  }

  async processAudioStream(
    audioStream: NodeJS.ReadableStream,
    onTranscription: (text: string) => void
  ): Promise<void> {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
        if (chunks.length >= 10) { // Process every 10 chunks
          const audioBuffer = Buffer.concat(chunks);
          const text = await this.transcribeAudio(audioBuffer);
          onTranscription(text);
          chunks.length = 0; // Clear the array
        }
      }
      // Process remaining chunks
      if (chunks.length > 0) {
        const audioBuffer = Buffer.concat(chunks);
        const text = await this.transcribeAudio(audioBuffer);
        onTranscription(text);
      }
    } catch (error) {
      logger.error('Failed to process audio stream:', error);
      throw error;
    }
  }

  async generateResponse(text: string): Promise<Buffer> {
    try {
      // Here you would typically integrate with your AI model
      // For now, we'll just echo the text
      const response = `I heard you say: ${text}`;
      return await this.textToSpeech(response);
    } catch (error) {
      logger.error('Failed to generate response:', error);
      throw error;
    }
  }
}

export default SpeechService; 