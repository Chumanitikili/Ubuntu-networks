import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get('CallSid') as string;
    const callerId = formData.get('From') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;
    const recordingDuration = formData.get('RecordingDuration') as string;

    if (!callSid || !callerId || !recordingUrl) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Save the message to the database
    await prisma.interaction.create({
      data: {
        type: 'CALL',
        direction: 'INBOUND',
        content: 'Voice message',
        metadata: {
          callSid,
          recordingUrl,
          recordingDuration,
          messageType: 'voicemail',
        },
      },
    });

    // Generate TwiML response
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Thank you for your message. We will get back to you as soon as possible.');
    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    logger.error('Failed to save voice message:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('We apologize, but we encountered an error while saving your message. Please try again later.');
    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
} 