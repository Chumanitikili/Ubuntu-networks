import { Handler } from '@netlify/functions';
import twilio from 'twilio';
import { LanguageServiceClient } from '@google-cloud/language';

const VoiceResponse = twilio.twiml.VoiceResponse;
const language = new LanguageServiceClient();

export const handler: Handler = async (event) => {
  const twiml = new VoiceResponse();
  const speechResult = event.body ? new URLSearchParams(event.body).get('SpeechResult') : null;

  if (!speechResult) {
    twiml.say('I didn\'t catch that. Could you please repeat?');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
      body: twiml.toString(),
    };
  }

  try {
    // Analyze the sentiment and entities of the speech
    const [result] = await language.analyzeEntities({
      document: {
        content: speechResult,
        type: 'PLAIN_TEXT',
      },
    });

    // Basic intent recognition based on entities
    const entities = result.entities || [];
    const hasGreeting = entities.some(entity => 
      entity.type === 'PERSON' || 
      entity.name?.toLowerCase().includes('hello') ||
      entity.name?.toLowerCase().includes('hi')
    );

    const hasQuestion = speechResult.includes('?');

    if (hasGreeting) {
      twiml.say('Hello! How can I assist you today?');
    } else if (hasQuestion) {
      twiml.say('Let me connect you with an agent who can help with your question.');
      // Here you would typically implement call transfer logic
    } else {
      twiml.say('I understand you said: ' + speechResult + '. How can I help you with that?');
    }

    // Add a gather verb to continue the conversation
    const gather = twiml.gather({
      input: 'speech',
      action: '/api/process-speech',
      method: 'POST',
      speechTimeout: 'auto',
      language: 'en-US',
    });

    gather.say('Is there anything else I can help you with?');

  } catch (error) {
    console.error('Error processing speech:', error);
    twiml.say('I apologize, but I encountered an error processing your request. Please try again.');
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
    body: twiml.toString(),
  };
}; 