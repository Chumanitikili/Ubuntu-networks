import { Handler } from '@netlify/functions';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export const handler: Handler = async (event) => {
  const twiml = new VoiceResponse();

  // Add a greeting
  twiml.say('Welcome to our AI Receptionist. How can I help you today?');

  // Add a gather verb to collect user input
  const gather = twiml.gather({
    input: 'speech',
    action: '/api/process-speech',
    method: 'POST',
    speechTimeout: 'auto',
    language: 'en-US',
  });

  // If the user doesn't say anything, repeat the greeting
  gather.say('I didn\'t catch that. Could you please repeat?');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
    body: twiml.toString(),
  };
}; 