import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import { SpeechService } from '@/lib/speech';
import logger from '@/lib/logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const speechService = new SpeechService({
  whisperModelPath: process.env.WHISPER_MODEL_PATH || '',
  piperModelPath: process.env.PIPER_MODEL_PATH || '',
  piperConfigPath: process.env.PIPER_CONFIG_PATH || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const twiml = new twilio.twiml.VoiceResponse();

    // Handle incoming call
    twiml.say('Welcome to our call center. How can I help you today?');

    // Record the call
    twiml.record({
      action: '/api/twilio/recording',
      maxLength: 30,
      playBeep: false,
      trim: 'trim-silence',
    });

    // Send the TwiML response
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
  } catch (error) {
    logger.error('Error handling Twilio voice webhook:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleRecording(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const recordingUrl = req.body.RecordingUrl;
    const recordingSid = req.body.RecordingSid;

    // Download the recording
    const recording = await twilioClient.recordings(recordingSid).fetch();
    const audioBuffer = await fetch(recordingUrl).then((res) => res.buffer());

    // Transcribe the recording
    const transcription = await speechService.transcribeAudio(audioBuffer);
    logger.info('Call recording transcribed:', transcription);

    // Generate response
    const responseAudio = await speechService.generateResponse(transcription);

    // Create a new TwiML response
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.play({}, responseAudio);

    // Send the TwiML response
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
  } catch (error) {
    logger.error('Error handling recording:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 