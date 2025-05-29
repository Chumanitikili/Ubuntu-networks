import { NextRequest, NextResponse } from 'next/server';
import { VoiceHandler } from '@/services/voiceHandler';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callerId = formData.get('From') as string;
    const callSid = formData.get('CallSid') as string;
    const transcription = formData.get('SpeechResult') as string;

    const voiceHandler = VoiceHandler.getInstance();
    const context = {
      callerId,
      callSid,
      transcription
    };

    const twiml = voiceHandler.handleUserInput(context);

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  } catch (error) {
    logger.error('Error in voice route handler:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Say>An error occurred. Please try again later.</Say></Response>',
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const callerId = searchParams.get('From') as string;
    const callSid = searchParams.get('CallSid') as string;

    const voiceHandler = VoiceHandler.getInstance();
    const context = {
      callerId,
      callSid
    };

    const twiml = voiceHandler.handleIncomingCall(context);

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  } catch (error) {
    logger.error('Error in voice route handler:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Say>An error occurred. Please try again later.</Say></Response>',
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );
  }
} 