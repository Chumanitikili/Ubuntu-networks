import { VoiceResponse } from 'twilio/lib/twiml/VoiceResponse';
import { logger } from '../utils/logger';

interface CallContext {
  callerId: string;
  callSid: string;
  transcription?: string;
  intent?: string;
  confidence?: number;
}

export class VoiceHandler {
  private static instance: VoiceHandler;
  private readonly defaultGreeting = "Hello, thank you for calling. How can I help you today?";
  private readonly fallbackResponse = "I'm sorry, I didn't quite catch that. Could you please repeat?";
  private readonly goodbyeMessage = "Thank you for calling. Have a great day!";

  private constructor() {}

  public static getInstance(): VoiceHandler {
    if (!VoiceHandler.instance) {
      VoiceHandler.instance = new VoiceHandler();
    }
    return VoiceHandler.instance;
  }

  public handleIncomingCall(context: CallContext): string {
    try {
      const twiml = new VoiceResponse();
      
      // Add initial greeting
      twiml.say({
        voice: 'Polly.Amy',
        language: 'en-GB'
      }, this.defaultGreeting);

      // Start gathering user input
      const gather = twiml.gather({
        input: 'speech',
        language: 'en-GB',
        speechTimeout: 'auto',
        action: `/api/twilio/voice/handle-input?callerId=${context.callerId}`,
        method: 'POST'
      });

      // Add fallback if no input is received
      gather.say({
        voice: 'Polly.Amy',
        language: 'en-GB'
      }, this.fallbackResponse);

      return twiml.toString();
    } catch (error) {
      logger.error('Error handling incoming call:', error);
      return this.handleError();
    }
  }

  public handleUserInput(context: CallContext): string {
    try {
      const twiml = new VoiceResponse();
      
      if (!context.transcription) {
        twiml.say({
          voice: 'Polly.Amy',
          language: 'en-GB'
        }, this.fallbackResponse);
        return twiml.toString();
      }

      // Process the transcription and determine intent
      const response = this.processUserInput(context);
      
      twiml.say({
        voice: 'Polly.Amy',
        language: 'en-GB'
      }, response);

      // If we're not ending the call, gather more input
      if (!this.shouldEndCall(response)) {
        const gather = twiml.gather({
          input: 'speech',
          language: 'en-GB',
          speechTimeout: 'auto',
          action: `/api/twilio/voice/handle-input?callerId=${context.callerId}`,
          method: 'POST'
        });

        gather.say({
          voice: 'Polly.Amy',
          language: 'en-GB'
        }, "Is there anything else I can help you with?");
      }

      return twiml.toString();
    } catch (error) {
      logger.error('Error handling user input:', error);
      return this.handleError();
    }
  }

  private processUserInput(context: CallContext): string {
    // Here you would integrate with your NLP service to determine intent
    // For now, we'll use a simple keyword-based approach
    const input = context.transcription?.toLowerCase() || '';
    
    if (input.includes('goodbye') || input.includes('bye')) {
      return this.goodbyeMessage;
    }

    if (input.includes('help')) {
      return "I can help you with scheduling appointments, answering questions, or connecting you with a human agent. What would you like to do?";
    }

    if (input.includes('schedule') || input.includes('appointment')) {
      return "I can help you schedule an appointment. What day and time would work best for you?";
    }

    if (input.includes('agent') || input.includes('human')) {
      return "I'll connect you with a human agent. Please hold for a moment.";
    }

    return "I understand you're saying: " + context.transcription + ". Could you please provide more details about what you need help with?";
  }

  private shouldEndCall(response: string): boolean {
    return response === this.goodbyeMessage;
  }

  private handleError(): string {
    const twiml = new VoiceResponse();
    twiml.say({
      voice: 'Polly.Amy',
      language: 'en-GB'
    }, "I'm sorry, I'm having trouble processing your request. Please try again or call back later.");
    return twiml.toString();
  }
} 